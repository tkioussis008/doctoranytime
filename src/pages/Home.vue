<script setup lang="ts">
import { ref } from "vue";
import { watch } from 'vue';


const props = defineProps({
  destinationPortCode: {
    type: String,
    default: 'test'
  },
});


const userInput = ref<{from: string, to: string}>({from: '', to: ''})


const onInput = (key: "from" | "to") => {
  const value = (this as any).value as string
  key == 'from' 
    ? userInput.value = { ...userInput.value, from: value.toLocaleLowerCase() }
    : userInput.value = { ...userInput.value, to: value.toLocaleLowerCase() }
}


watch(props, async(value: { text: string }) => {
    if(!value) return
  },
  { deep: true, immediate: true }
);

</script>


<template>
  <div class="home">
    <h1>This is an about page {{ destinationPortCode }}</h1>
    <div class="bg-blue-500 text-white p-4 rounded-lg">
      <h1 class="text-2xl font-bold">Hello, This is my Exam Home Page!</h1>
      <p class="mt-2 text-lg">Styled with Tailwind CSS</p>
    </div>
  </div>
</template>


<style scoped lang="scss">
@import "./index.scss";
</style>