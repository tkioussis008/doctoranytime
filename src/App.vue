<script lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: "App",
  setup() {
    const route = useRoute();

    // Select layout based on the current route's meta.layout
    const layout = computed(() => route.meta.layout);

    return { layout };
  },
};

</script>


<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
