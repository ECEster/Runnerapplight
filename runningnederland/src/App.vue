<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <SiteHeader />
  <main class="page"><RouterView /></main>
  <SiteFooter />
</template>

<style>
#app { min-height: 100vh; display: flex; flex-direction: column; }
.page { flex: 1; }
</style>
