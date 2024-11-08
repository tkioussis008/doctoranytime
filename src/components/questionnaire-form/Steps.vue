<script setup lang="ts">
import { computed } from 'vue';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { defineAsyncComponent } from 'vue';


const store = useQuestionnaireStore();


const components: any = {
  1: defineAsyncComponent(() => import('@/components/questionnaire-form/Intro.vue')),
  2: defineAsyncComponent(() => import('@/components/questionnaire-form/Form.vue')),
  3: defineAsyncComponent(() => import('@/components/questionnaire-form/Results.vue')),
};


const currentComponent = computed(() => components[store.component] || 1);


</script>


<template>
  <div class="min-h-20 mt-20">
    <component :is="currentComponent" />
  </div>
</template>