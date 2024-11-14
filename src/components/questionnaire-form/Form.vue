<script lang="ts" setup>
import Question from './Question.vue'
import { useQuestionnaireStore } from '@/store/questionnaire'
import { onMounted } from 'vue'

const store = useQuestionnaireStore()


onMounted(() => {
  store.fetchQuestions()
})


</script>


<template>
  <div class="question-container space-y-6 py-8 text-base text-gray-500 leading-7 text-center">
    <Question :question="store.questions.find(q => q.Id === store.currentQuestionId)" :key="store.currentQuestionId || 1"/>
  </div>
</template>