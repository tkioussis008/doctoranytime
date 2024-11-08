import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

import { ElNotification } from 'element-plus'
import type { Option, QuestionsResponse, Question, State } from './types'


export const useQuestionnaireStore = defineStore('questionnaireStore', 
  () => {
    const component = ref(1)
    const questions = ref<Question[]>([])
    const currentQuestionId = ref<number | null>(null)
    const userAnswers = ref<Map<number, Option[] | Option>>(new Map())
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)

    const memoizedResults = new Map<number, boolean>()



    const progress = computed(() => {
      return component.value !== 3 ? 
        questions.value.length
          ? (userAnswers.value.size / questions.value.length) * 100
          : 0
        : 100
    })

    const finalUrl = computed(() => {
      const baseUrl = "https://www.doctoranytime.gr/s/Psychologos?"
      const queryParams = Array.from(userAnswers.value.entries()).reduce((acc: Record<string, string>, [_, answer]) => {
        if (Array.isArray(answer)) {
          answer.forEach((opt) => {
            const key = opt.FilterQueryStringKey
            const value = opt.FilterQueryStringValue
            
            if (key && value) {
              if (acc[key]) {
                acc[key] += `_and_${value}`
              } else {
                acc[key] = value
              }
            }
          })
        } else {
          const key = answer.FilterQueryStringKey
          const value = answer.FilterQueryStringValue
          
          if (key && value) {
            if (acc[key]) {
              acc[key] += `_and_${value}`
            } else {
              acc[key] = value
            }
          }
        }
        return acc
      }, {} as Record<string, string>)
      
      const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
      
      return baseUrl + queryString
    })



    const fetchQuestions = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await fetch("/searchq/GetQuestions?version=v2")
        const data: QuestionsResponse = await response.json()
        questions.value = data.Data
        if(!currentQuestionId.value) {
          currentQuestionId.value = data.Data.find(q => q.Id === 1000)?.Id || data.Data[0]?.Id
        }
      } catch (err) {
        error.value = "Failed to fetch questions. Please try again."
      } finally {
        loading.value = false
      }
    }

    const willAllBranchesLeadToUrl = (questionId: number, visitedQuestions: Set<number> = new Set()): boolean => {
      // console.log(questionId, visitedQuestions)
      if (memoizedResults.has(questionId)) {
        return memoizedResults.get(questionId)!
      }
    
      if (visitedQuestions.has(questionId)) {
        return false
      }
      visitedQuestions.add(questionId)
    
      const question = questions.value.find(q => q.Id === questionId)
      if (!question) {
        memoizedResults.set(questionId, false)
        return false
      }
    
      for (const option of question.Options) {
        if (option.Action === "GoToUrl") {
          continue
        } else if (option.Action === "GoToQuestion" && option.GoToQuestionId) {
          // console.log('CALL', option.GoToQuestionId, visitedQuestions)
          const allBranchesLeadToUrl = willAllBranchesLeadToUrl(option.GoToQuestionId, new Set(visitedQuestions))
          if (!allBranchesLeadToUrl) {
            memoizedResults.set(questionId, false)
            return false
          }
        } else {
          memoizedResults.set(questionId, false)
          return false
        }
      }
    
      memoizedResults.set(questionId, true)
      return true
    }

    const GoToComponent = (componentId: number) => {
      component.value = componentId
    }

    const storeAnswer = (questionId: number, selectedOption: Option[] | Option | null) => {
      if(!selectedOption) return
      updateOrAddQuestionEntry(questionId, selectedOption)   
    }

    const goToNextQuestionOrComplete = () => {
      let nextQuestion = questions.value.find(q => q.Id === getLastQuestionValue('GoToQuestionId'))
      if(currentQuestionId.value && nextQuestion) {
        const currentQuestion = userAnswers.value.get(currentQuestionId.value)
        if(!currentQuestion) {
          const isOptional = questions.value.find(q => q.Id === currentQuestionId.value)?.IsOptional
          if(!isOptional) {
            ElNotification({
              message: 'Please Select An Answer',
              type: 'warning',
            })
            return
          } else {
            const firstAnswerOfNextQuestion = questions.value.find(q => q.Id === currentQuestionId.value)?.Options?.[0]
            const firstAnswerAction = firstAnswerOfNextQuestion?.Action
            const GoToQuestionId = firstAnswerOfNextQuestion?.GoToQuestionId
            if(firstAnswerAction === 'GoToQuestion' && GoToQuestionId) {
              nextQuestion = questions.value.find(q => q.Id === GoToQuestionId)
            } else if(firstAnswerAction === 'GoToUrl') {
              GoToComponent(3)
            }
          }
        }
        if(nextQuestion && nextQuestion.Id !== getLastQuestionValue('Id') && willAllBranchesLeadToUrl(nextQuestion.Id)) {
          currentQuestionId.value = nextQuestion.Id
        } else {
          ElNotification({
            message: 'Something went wrong! Please Reset the form and Try again Later',
            type: 'error',
          })
        }
      }
      if(getLastQuestionValue('Action') === "GoToUrl") {
        GoToComponent(3)
      }
    }

    const goToPreviousQuestion = () => {
      if(userAnswers.value.size === 0) {
        GoToComponent(1)
      } else {
        popLastQuestionEntry()
        currentQuestionId.value = getLastQuestionValue('GoToQuestionId') || 1000
      }
    }

    const addQuestionEntry = (questionId: number, question: Option | Option[]) => {
      userAnswers.value.set(questionId, question)
    }

    const updateOrAddQuestionEntry = (questionId: number, question: Option | Option[]) => {
      if (userAnswers.value.has(questionId)) {
        userAnswers.value.set(questionId, question)
      } else {
        addQuestionEntry(questionId, question)
      }
    }

    const deleteQuestionEntry = (questionId: number) => {
      userAnswers.value.delete(questionId)
    }

    const popLastQuestionEntry = () => {
      const lastKey = Array.from(userAnswers.value.keys()).pop()
      if (lastKey !== undefined) {
        userAnswers.value.delete(lastKey)
      }
    }

    const getLastQuestionValue = (property: keyof Option) => {
      const lastEntry = Array.from(userAnswers.value.values()).pop()
      
      if (Array.isArray(lastEntry) && lastEntry.length > 0) {
        const lastOption = lastEntry[lastEntry.length - 1]
        return lastOption ? lastOption[property] : undefined
      }
    
      if (lastEntry && 'Id' in lastEntry) {
        return lastEntry[property]
      }
    
      return undefined;
    }

    const resetQuestionnaire = () => {
      userAnswers.value.clear()
      currentQuestionId.value = questions.value.length ? questions.value[0].Id : 1000
    }

    const serializeUserAnswers = (userAnswers: Map<number, Option | Option[]>) => {
      return JSON.stringify(Array.from(userAnswers.entries()))
    };

    const saveToLocalStorage = () => {
      localStorage.setItem('userAnswers', serializeUserAnswers(userAnswers.value))
    };



    // Save userAnswers to localStorage on change because piniaPluginPersistedstate not storing Map keyed data items
    watch(() => userAnswers.value, saveToLocalStorage, { deep: true })



    return {
      memoizedResults,
      component,
      questions,
      currentQuestionId,
      userAnswers,
      loading,
      error,
      progress,
      finalUrl,
      fetchQuestions,
      storeAnswer,
      goToNextQuestionOrComplete,
      goToPreviousQuestion,
      resetQuestionnaire,
      GoToComponent,
    }
  },
  { 
    persist: {
      afterHydrate: (ctx) => {
        const storedData = localStorage.getItem('userAnswers')
        if (storedData) {
          const parsedData = JSON.parse(storedData)
          ctx.store.userAnswers = new Map(parsedData)
        }
      }
    },
  },
)
