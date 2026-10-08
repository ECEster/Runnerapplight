<script setup lang="ts">
defineProps<{ inverse?: boolean }>()
</script>

<template>
  <span class="wordmark" :class="{ inverse }"><b>Running</b><span>Nederland</span></span>
</template>

<style scoped>
.wordmark { font-size: 22px; line-height: 28px; letter-spacing: -0.01em; color: var(--ink); white-space: nowrap; }
.wordmark b { font-weight: 700; }
.wordmark span { font-weight: 400; color: var(--brand); }
.inverse { color: var(--on-inverse); }
.inverse span { color: var(--inverse-link); }
</style>
