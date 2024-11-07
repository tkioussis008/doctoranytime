<script lang="ts" setup>
import { ref } from "vue";
import type { Question } from '@/store/types'

import { useQuestionnaireStore } from '@/store/questionnaire';
import { onMounted } from 'vue';


const store = useQuestionnaireStore();


const props = defineProps({
  question: {
    type: Object as () => Question,
    default: ''
  },
});


const checkboxGroup = ref<number[]>([])
const optionGroup = ref<number>()


const handleCheckbox = (answerId: number[]) => {
  console.log(answerId)

  const selectedQuestion = store.questions?.find(q => q.Id === store.currentQuestionId)?.Options;
  store.goToNextQuestionOrComplete( 
    selectedQuestion?.find(ans => answerId?.includes(ans?.AnswerId)) || null 
  );
};

const handleOption = (answerId: number) => {
  console.log(answerId)

  const selectedQuestion = store.questions?.find(q => q.Id === store.currentQuestionId)?.Options;
  store.goToNextQuestionOrComplete( 
    selectedQuestion?.find(ans => ans?.AnswerId === answerId) || null 
  );
};

</script>


<template>
  <div class="m-20">
    <span :key="question">{{ question.Question }}</span>
    <div v-if="question.QuestionSelectType === 0">
      <el-checkbox-group 
        @update:model-value="handleCheckbox($event)"
        v-model="checkboxGroup"
        size="large"
      >
        <el-checkbox
          v-for="option in question.Options"
          :class="[
            'w-full mb-2 px-4 py-2 rounded-md',
            checkboxGroup.includes(option.AnswerId) ? 'bg-blue-50' : ''
          ]"
          class="w-full mb-2 px-4 py-2 rounded-md"
          :key="option.AnswerId"
          :label="option.Answer"
          :value="option.AnswerId"       
          border 
        />
      </el-checkbox-group>  
    </div>
    <div v-else>

      <el-radio-group 
        @update:model-value="handleOption($event)"
        v-model="optionGroup"
        size="large"
      >
        <el-radio
          v-for="option in question.Options"
          :class="[
            'w-full mb-2 px-4 py-2 rounded-md',
            checkboxGroup.includes(option.AnswerId) ? 'bg-blue-50' : ''
          ]"
          :key="option.AnswerId"
          :label="option.Answer"
          :value="option.AnswerId"       
          border 
        >
          {{ option.Answer }}
        </el-radio>
      </el-radio-group>

    </div>
  </div>
</template>