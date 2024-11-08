<script setup lang="ts">
//import MainLayout from '@/layouts/MainLayout.vue'
import { onMounted, onBeforeUnmount } from 'vue'
import ProgressBar from '@/components/questionnaire-form/ProgressBar.vue'
import Actions from '@/components/questionnaire-form/Actions.vue'


onMounted(() => {
  document.body.classList.add('h-full')
  document.body.classList.add('m-0')
});

onBeforeUnmount(() => {
  document.body.classList.add('h-full')
  document.body.classList.add('m-0')
});
</script>


<template>
  <MainLayout>
    <template #default>
      <ProgressBar />
      <div class="md:mx-auto max-w-3xl flex flex-col h-screen justify-center items-center max-[767px]:mx-5 mb-0">  
        <div class="w-45 h-10 absolute top-14 left-1/2 transform -translate-x-1/2 mt-4">
          <img src="@/assets/images/MindTime-logo.png" class="max-w-44 mb-8" alt="MindTime" />
        </div>
        <slot />
      </div>
      <Actions />
    </template>
  </MainLayout>
</template>

<style lang="scss">
@import "./QuestionnaireLayout.scss";
</style>