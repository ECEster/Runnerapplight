<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <button type="button" class="chip" :aria-pressed="model" @click="model = !model">
    <span v-if="model" aria-hidden="true">✓</span><slot />
  </button>
</template>

<style scoped>
.chip {
  font: inherit; font-size: 14px; font-weight: 600; line-height: 20px; padding: 7px 14px; border-radius: var(--radius-pill);
  border: 1px solid var(--line-strong); background: var(--surface-200); color: var(--ink); cursor: pointer;
  display: inline-flex; gap: 6px; align-items: center;
}
.chip:hover { background: var(--surface-300); }
.chip[aria-pressed='true'] { background: var(--brand-soft); border-color: var(--brand); color: var(--brand); }
</style>
