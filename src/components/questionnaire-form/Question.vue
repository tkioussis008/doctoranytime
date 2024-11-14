<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import type { Question } from '@/store/types'

import { useQuestionnaireStore } from '@/store/questionnaire'


const store = useQuestionnaireStore()


const props = defineProps({
  question: {
    type: Object as () => Question,
    default: ''
  },
})


const checkboxGroup = ref<number[]>([])
const optionGroup = ref<number>()


const handleCheckbox = (answerId: number[]) => {
  const selectedQuestion = store.questions?.find(q => q.Id === store.currentQuestionId)?.Options
  store.storeAnswer( 
    props.question.Id,
    selectedQuestion?.filter(ans => answerId?.includes(ans?.AnswerId)) || null 
  )
}

const handleOption = (answerId: number) => {
  const selectedQuestion = store.questions?.find(q => q.Id === store.currentQuestionId)?.Options
  store.storeAnswer( 
    props.question.Id,
    selectedQuestion?.find(ans => ans?.AnswerId === answerId) || null 
  )
}

const initializeSelection = () => {
  const storedAnswer = store.userAnswers.get(props.question.Id)
  if (Array.isArray(storedAnswer)) {
    checkboxGroup.value = storedAnswer.map((opt) => opt.AnswerId)
  } else if (storedAnswer) {
    optionGroup.value = storedAnswer.AnswerId
  }
}


onMounted(() => {
  initializeSelection()
})

</script>


<template>
  <div>
    <span class="flex mb-10 font-bold">{{ question.Question }}</span>
    <div v-if="question.QuestionSelectType === 1">
      <el-checkbox-group 
        @update:model-value="handleCheckbox($event)"
        v-model="checkboxGroup"
        size="large"
        class="w-full m-0"
      >
        <el-checkbox
          v-for="option in question.Options"
          :class="[
            'w-full mb-2 px-4 py-2 rounded-md whitespace-normal break-words max-w-full',
            checkboxGroup.includes(option.AnswerId) ? 'bg-sky-50' : ''
          ]"
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
        class="w-full m-0"
      >
        <el-radio
          v-for="option in question.Options"
          :class="[
            'w-full mb-2 px-4 py-2 rounded-md whitespace-normal break-words max-w-full',
            optionGroup === option.AnswerId ? 'bg-sky-50' : ''
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

<style lang="scss">
.el-radio.el-radio--large {
    @media (max-width: 900px) {
      height: auto;
    }
    line-height: 20px;
}
.el-radio__label, .el-checkbox__label {
  @media (max-width: 900px) {
    padding: 7px;
    margin: 0 auto;
  }
  word-wrap: break-word;   
  white-space: normal !important;
  color: black !important; 
}
.el-radio:last-child {
  margin-right: 30px !important;
}
</style>