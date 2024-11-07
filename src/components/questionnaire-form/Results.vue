<script setup lang="ts">
import { ref } from "vue";
import { watch } from 'vue';
import { useQuestionnaireStore } from '@/store/questionnaire';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons';


const store = useQuestionnaireStore();

</script>


<template>
  <div class="space-y-6 py-8 text-base text-gray-500 leading-7 text-center">
    <h1 class="text-indigo-800 text-3xl pb-3 font-bold text-wrap">Questionnaire Completed!<br>
    Use this url to find your match</h1>
    <div> 
      <a :href="store.finalUrl" target="_blank" class="underline hover:no-underline break-all">
        {{ store.finalUrl }}
      </a>
    </div>
  </div>
   
</template>

