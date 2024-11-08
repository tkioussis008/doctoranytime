 
<script setup lang="ts">
import { ref } from "vue";
import { defineProps } from 'vue';
import { ElMessageBox } from 'element-plus'
import { useQuestionnaireStore } from '@/store/questionnaire';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const store = useQuestionnaireStore();


const handleReset = () => {
  ElMessageBox.confirm('If you cancel all progress will be lost. Are you sure?', 'Confirmation', {
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
  .then(() => {
    store.resetQuestionnaire()
    store.GoToComponent(1)
  })
  .catch(() => {
  });
};

</script>


<template>
  <div v-if="store.component !== 1" class="absolute pl-5 pr-5 pt-2 flex items-center justify-center w-full h-10 bg-gray-200">
    <div class="w-full h-1.5 bg-gray-200 rounded-md overflow-hidden">
      <div 
        class="h-full bg-blue-600 transition-all duration-300" 
        :style="{ width: `${store.progress}%` }"
      ></div>
      
    </div>
    <FontAwesomeIcon @click="handleReset" class="cursor-pointer pl-2" :icon="faXmark" />
  </div>
</template>