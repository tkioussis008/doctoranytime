<script lang="ts" setup>
import Question from './Question.vue';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { onMounted } from 'vue';

const store = useQuestionnaireStore();


</script>


<template>
  <div v-if="store.component !== 3" class="flex sm:flex-row flex-col sticky absolute bottom-0 border-t divide-gray-300/50 p-2 justify-center bg-white max-[767px]:px-5">
    <div v-if="store.component === 1">
      <button @click="store.GoToComponent(2)" class="bg-red-500 mb-2 py-3 px-5 rounded hover:text-red-500 hover:bg-white hover:ring-red-500 hover:ring-1 text-white sm:mx-5 sm:order-last">Start questionnaire</button>
      <button @click="$router.push('/')" class="py-3 px-5 mb-2 hover:ring-1 hover:ring-red-500 hover:text-red-500 mx-5 rounded">Skip for now</button>
    </div>
    <div v-else>
      <button @click="store.goToPreviousQuestion()" class="py-3 px-5 mb-2 hover:ring-1 hover:ring-blue-500 hover:text-blue-500 mx-5 rounded">Back</button>
      <button @click="store.goToNextQuestionOrComplete()" class="bg-blue-500 mb-2 py-3 px-5 rounded hover:text-blue-500 hover:bg-white hover:ring-blue-500 hover:ring-1 text-white sm:mx-5 sm:order-last">Continue</button>
    </div>
  </div>
</template>