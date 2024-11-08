<script lang="ts" setup>
import Question from './Question.vue'
import { useQuestionnaireStore } from '@/store/questionnaire'
import { onMounted } from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'


const store = useQuestionnaireStore();


</script>


<template>
  <div v-if="store.component !== 3" :class="[store.component === 1 ? 'justify-center' : 'justify-end']" class="flex sm:flex-row flex-col w-full fixed bottom-0 border-t divide-gray-300/50 p-2 bg-white max-[767px]:px-5">
    <div v-if="store.component === 1">
      <button @click="store.GoToComponent(2)" class="bg-red-500 mb-2 py-3 px-5 rounded hover:text-red-500 hover:bg-white hover:ring-red-500 hover:ring-1 text-white sm:mx-5 sm:order-last max-[767px]:w-full">Start questionnaire</button>
      <button @click="$router.push('/')" class="py-3 px-5 mb-2 hover:ring-1 hover:ring-red-500 hover:text-red-500 mx-5 rounded">Skip for now</button>
    </div>
    <div class="min-[767px]:mr-16" v-else>
      <button @click="store.goToPreviousQuestion()" class="py-3 px-5 mb-2 hover:ring-1 hover:ring-sky-500 hover:text-sky-500 mx-5 rounded"><FontAwesomeIcon class="cursor-pointer" :icon="faArrowLeft" /></button>
      <button @click="store.goToNextQuestionOrComplete()" class="bg-sky-500 mb-2 py-3 px-5 rounded hover:text-sky-500 hover:bg-white hover:ring-sky-500 hover:ring-1 text-white sm:mx-5 sm:order-last max-[767px]:w-3/4">Continue</button>
    </div>
  </div>
</template>