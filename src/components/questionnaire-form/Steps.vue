<script setup lang="ts">
import { computed } from 'vue';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { defineAsyncComponent } from 'vue';


const store = useQuestionnaireStore();


const components = {
  1: defineAsyncComponent(() => import('@/components/questionnaire-form/Intro.vue')),
  2: defineAsyncComponent(() => import('@/components/questionnaire-form/Form.vue')),
  3: defineAsyncComponent(() => import('@/components/questionnaire-form/Results.vue')),
  // Add more as needed
};


const currentComponent = computed(() => components[store.component] || 1);


</script>


<template>
  <div>
    <h2>Step {{ store.count }}</h2>
    <component :is="currentComponent" />
  </div>
</template>