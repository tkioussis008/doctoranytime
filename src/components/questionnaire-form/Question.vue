<script lang="ts" setup>
import { useQuestionnaireStore } from '@/store/questionnaire';
import { onMounted } from 'vue';

const store = useQuestionnaireStore();


const props = defineProps({
  question: {
    type: Object,
    default: ''
  },
});



</script>


<template>
  <div class="m-20">
    <span :key="question">{{ question }}</span>
  </div>
</template>