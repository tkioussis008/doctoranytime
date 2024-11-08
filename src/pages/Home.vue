<script setup lang="ts">
import { ref } from "vue";
import { watch } from 'vue';

</script>


<template>
  <div class="home">
    <div class="min-h-screen flex flex-col items-center justify-center text-gray-800 m-0 p-0">
      <div class="max-w-md bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 class="text-3xl font-bold mb-4 text-cyan-600">Anastasios Kioussis Assignment</h1>
        <p class="text-lg mb-6">
          I'd be very glad to receive your feedback on the work. Everything is well-intentioned. It was a great challenge. Thank you.
        </p>
        <p class="text-md mb-6">
          Thank you for giving me the opportunity to become a member of your team.
        </p>
        <router-link to="/questionnaire">
        <button class="px-6 py-2 mt-4 bg-sky-600 text-white font-semibold rounded-full hover:bg-cyan-500 focus:outline-none">
          See my Assignment in Action
        </button>
        </router-link>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
@import "./index.scss";
</style>