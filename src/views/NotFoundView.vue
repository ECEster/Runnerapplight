<script setup lang="ts">
import { t } from '@/lib/i18n'
</script>

<template>
  <section class="section container nf">
    <h1 class="h2">{{ t('notfound.title') }}</h1>
    <p class="muted">{{ t('notfound.text') }}</p>
    <RouterLink to="/agenda" class="btn btn-primary">{{ t('home.cta') }}</RouterLink>
  </section>
</template>

<style scoped>
.nf { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-4); min-height: 40vh; }
</style>
