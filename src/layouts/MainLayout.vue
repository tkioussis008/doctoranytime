<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

</script>


<template>
  <div>
    <Header/>
    <main>
      <slot/>
    </main>
    <Footer/>
  </div>
</template>

<style lang="scss">
@import "./MainLayout.scss";
</style>