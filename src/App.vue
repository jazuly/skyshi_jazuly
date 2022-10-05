<template>
  <section>
    <Header />
    <router-view  class="h-[90vh] px-28 py-16 bg-[#E5E5E5]" />
  </section>
</template>

<script setup lang="ts">
  import Header from './components/layout/Header.vue'
</script>