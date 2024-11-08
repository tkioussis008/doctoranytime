import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

import { ElNotification } from 'element-plus'
import type { Option, QuestionsResponse, Question } from './types'


export const useQuestionnaireStore = defineStore('questionnaireStore', 
  () => {
    const component = ref(1)
    const questions = ref<Question[]>([])
    const currentQuestionId = ref<number | null>(null)
    const userAnswers = ref<Map<number, Option[] | Option>>(new Map())
    const memoizedResults = ref<Map<number, boolean>>(new Map())
    const saveResult = ref<Map<number, Option[] | Option | null>>(new Map())
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)



    const progress = computed(() => {
      const remainingSteps = calculateMaxRemainingSteps(currentQuestionId.value || 1000)
      const estimatedTotalSteps = remainingSteps + userAnswers.value.size
      if (estimatedTotalSteps === 0) return 100
      return component.value !== 3 ? 
        questions.value.length
          ? 100 - Math.round((remainingSteps / estimatedTotalSteps) * 100)
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
        component.value = 1
        error.value = "Our Server is not responding. Please try again!"
        ElNotification({
          message: error.value,
          type: 'error',
        })
      } finally {
        loading.value = false
      }
    }

    const GoToComponent = (componentId: number) => {
      component.value = componentId
    }

    const storeAnswer = (questionId: number, selectedOption: Option[] | Option | null) => {
      if(!selectedOption) return
      saveResult.value.set(questionId, selectedOption)
    }

    const goToNextQuestionOrComplete = () => {
      if (!currentQuestionId.value) return;

      const savedAnswer = saveResult.value.get(currentQuestionId.value);
      if (savedAnswer) {
        updateOrAddAnswerEntry(currentQuestionId.value, savedAnswer);
      }

      let nextQuestion = questions.value.find(q => q.Id === getLastAnswerValue('GoToQuestionId'))
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
        if(nextQuestion && nextQuestion.Id !== getLastAnswerValue('Id') && willAllAnswersLeadToFinalUrl(nextQuestion.Id)) {
          currentQuestionId.value = nextQuestion.Id
        } else {
          ElNotification({
            message: 'Something went wrong! Please Reset the form and Try again Later',
            type: 'error',
          })
        }
      } else if(currentQuestionId.value === 1000) {
        ElNotification({
          message: 'Please Select An Answer',
          type: 'warning',
        })
      }
      if(getLastAnswerValue('Action') === "GoToUrl") {
        GoToComponent(3)
      }
    }

    const goToPreviousQuestion = () => {
      if(userAnswers.value.size === 0) {
        resetQuestionnaire()
        GoToComponent(1)
      } else {
        popLastAnswerEntry()
      }
    }

    const addAnswerEntry = (questionId: number, question: Option | Option[]) => {
      userAnswers.value.set(questionId, question)
    }

    const updateOrAddAnswerEntry = (questionId: number, question: Option | Option[]) => {
      if (userAnswers.value.has(questionId)) {
        userAnswers.value.set(questionId, question)
      } else {
        addAnswerEntry(questionId, question)
      }
    }

    const deleteAnswerEntry = (questionId: number) => {
      userAnswers.value.delete(questionId)
    }

    const popLastAnswerEntry = () => {
      const lastKey = Array.from(userAnswers.value.keys()).pop()
      if (lastKey !== undefined) {
        currentQuestionId.value = lastKey || 1000
        userAnswers.value.delete(lastKey)
        saveResult.value.delete(lastKey)
      }
    }

    const getLastAnswerValue = (property: keyof Option) => {
      const lastEntry = Array.from(userAnswers.value.values()).pop()
      
      if (Array.isArray(lastEntry) && lastEntry.length > 0) {
        const lastOption = lastEntry[lastEntry.length - 1]
        return lastOption ? lastOption[property] : undefined
      }
    
      if (lastEntry && 'Id' in lastEntry) {
        return lastEntry[property]
      }
    
      return undefined
    }

    const resetQuestionnaire = () => {
      userAnswers.value.clear()
      memoizedResults.value.clear()
      saveResult.value.clear()
      currentQuestionId.value = questions.value.length ? questions.value[0].Id : 1000
    }

    const serializeUserAnswers = (userAnswers: Map<number, Option | Option[]>) => {
      return JSON.stringify(Array.from(userAnswers.entries()))
    }

    const serializeMemoizedResults = (memoizedResults: Map<number, boolean>) => {
      return JSON.stringify(Array.from(memoizedResults.entries()))
    }

    const saveToLocalStorage = () => {
      localStorage.setItem('userAnswers', serializeUserAnswers(userAnswers.value))
      localStorage.setItem('memoizedResults', serializeMemoizedResults(memoizedResults.value))
    }

    const calculateMaxRemainingSteps = (startQuestionId: number): number => {
      const visitedQuestions = new Set<number>()
      const questionQueue: Array<{ questionId: number, depth: number }> = []
      let maxSteps = 0
    
      questionQueue.push({ questionId: startQuestionId, depth: 0 })
    
      while (questionQueue.length > 0) {
        const { questionId, depth } = questionQueue.shift()!
    
        if(visitedQuestions.has(questionId)) continue
        visitedQuestions.add(questionId)
    
        const question = questions.value.find(q => q.Id === questionId)
        if(!question) continue
    
        maxSteps = Math.max(maxSteps, depth)
    
        for (const option of question.Options) {
          if (option.Action === "GoToUrl") {
            continue
          } else if (option.Action === "GoToQuestion" && option.GoToQuestionId) {
            questionQueue.push({ questionId: option.GoToQuestionId, depth: depth + 1 })
          }
        }
      }
    
      return maxSteps
    }

    const willAllAnswersLeadToFinalUrl = (questionId: number, visitedQuestions: Set<number> = new Set()): boolean => {
      if (memoizedResults.value.has(questionId)) {
        return memoizedResults.value.get(questionId)!
      }
    
      if (visitedQuestions.has(questionId)) {
        return false
      }
      visitedQuestions.add(questionId)
    
      const question = questions.value.find(q => q.Id === questionId)
      if (!question) {
        memoizedResults.value.set(questionId, false)
        return false
      }
    
      for (const option of question.Options) {
        if (option.Action === "GoToUrl") {
          continue
        } else if (option.Action === "GoToQuestion" && option.GoToQuestionId) {
          const allBranchesLeadToUrl = willAllAnswersLeadToFinalUrl(option.GoToQuestionId, new Set(visitedQuestions))
          if (!allBranchesLeadToUrl) {
            memoizedResults.value.set(questionId, false)
            return false
          }
        } else {
          memoizedResults.value.set(questionId, false)
          return false
        }
      }
    
      memoizedResults.value.set(questionId, true)
      return true
    }



    // Save userAnswers and memoizedResults to localStorage on change because piniaPluginPersistedstate not storing Map keyed data items
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
        const storedData2 = localStorage.getItem('memoizedResults')
        if (storedData) {
          const parsedData = JSON.parse(storedData)
          ctx.store.userAnswers = new Map(parsedData)
        }
        if (storedData2) {
          const parsedData = JSON.parse(storedData2)
          ctx.store.memoizedResults = new Map(parsedData)
        }
      }
    },
  },
)
