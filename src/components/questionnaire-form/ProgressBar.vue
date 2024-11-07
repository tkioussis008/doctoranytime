 
<script setup lang="ts">
import { ref } from "vue";
import { defineProps } from 'vue';
import { useQuestionnaireStore } from '@/store/questionnaire';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const store = useQuestionnaireStore();

</script>


<template>
  <div class="pl-5 pr-5 pt-2 flex items-center justify-center w-full h-10 bg-gray-200">
    <div class="w-full h-1.5 bg-gray-200 rounded-md overflow-hidden">
      <div 
        class="h-full bg-blue-600 transition-all duration-300" 
        :style="{ width: `${store.progress}%` }"
      ></div>
      
    </div>
    <FontAwesomeIcon class="cursor-pointer" :icon="faXmark" />
  </div>
</template>