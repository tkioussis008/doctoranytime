import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { Option, QuestionsResponse, Question, State } from './types'


export const useQuestionnaireStore = defineStore('questionnaireStore', 
  () => {
    const component = ref(1);
    const questions = ref<Question[]>([])
    const currentQuestionId = ref<number | null>(null)
    const userAnswers = ref<Option[]>([])
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)

    const memoizedResults = new Map<number, boolean>()



    const progress = computed(() => {
      return questions.value.length
        ? (userAnswers.value.length / questions.value.length) * 100
        : 0
    })

    const finalUrl = computed(() => {
      const baseUrl = "/s/Psychologos?"
      const queryParams = userAnswers.value.reduce((acc: Record<string, string>, answer) => {
        const key = answer.FilterQueryStringKey
        const value = answer.FilterQueryStringValue
        
        if (key && value) {
          if (acc[key]) {
            acc[key] += `_and_${value}`
          } else {
            acc[key] = value
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
        currentQuestionId.value = data.Data.find(q => q.Id === 1000)?.Id || data.Data[0]?.Id // Start with first question
        console.log(willAllBranchesLeadToUrl(currentQuestionId.value)) // Call path builder after fetching questions
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
    };

    const goToNextQuestion = (selectedOption: Option) => {
      userAnswers.value.push(selectedOption)
      const nextQuestion = questions.value.find(q => q.Id === selectedOption.GoToQuestionId)
      if (nextQuestion) {
        currentQuestionId.value = nextQuestion.Id
      }
    }

    const GoToComponent = (componentId: number) => {
      component.value = componentId;
    }

    const goToPreviousQuestion = () => {
      userAnswers.value.pop()
      const previousAnswer = userAnswers.value[userAnswers.value.length - 1]
      currentQuestionId.value = previousAnswer?.GoToQuestionId || 1000 // Default to 1000 if previousAnswer is undefined
    }

    const resetQuestionnaire = () => {
      userAnswers.value = []
      currentQuestionId.value = questions.value.length ? questions.value[0].Id : null
    }


    return {
      component,
      questions,
      currentQuestionId,
      userAnswers,
      loading,
      error,
      progress,
      finalUrl,
      fetchQuestions,
      goToNextQuestion,
      goToPreviousQuestion,
      resetQuestionnaire,
      GoToComponent,
    }
  },
  { 
    persist: true 
  },
)
