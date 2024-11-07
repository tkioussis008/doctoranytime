<script lang="ts" setup>
import Question from './Question.vue';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { onMounted } from 'vue';

const store = useQuestionnaireStore();


onMounted(() => {
  store.fetchQuestions()
})


</script>


<template>
  <div>
    <Question :question="question" :key="question" v-for="question of store.questions"/>
  </div>
</template>