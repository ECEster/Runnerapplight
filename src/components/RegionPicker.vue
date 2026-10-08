<script setup lang="ts">
import { REGIONS } from '@/data/provinces'
import { t } from '@/lib/i18n'
const model = defineModel<string>({ default: '' })
const rot: Record<string, number> = { noord: 0, oost: 90, zuid: 180, west: 270 }
</script>

<template>
  <div class="regions" role="group" :aria-label="t('footer.regions')">
    <button type="button" class="region" :aria-pressed="model === ''" @click="model = ''">{{ t('region.all') }}</button>
    <button v-for="r in REGIONS" :key="r.id" type="button" class="region" :aria-pressed="model === r.id" @click="model = model === r.id ? '' : r.id">
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" :style="{ transform: `rotate(${rot[r.id]}deg)` }">
        <path d="M8 2 L13 12 L8 9.5 L3 12 Z" fill="currentColor" />
      </svg>
      {{ r.label }}
    </button>
  </div>
</template>

<style scoped>
.regions { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.region {
  font: inherit; font-size: 15px; font-weight: 600; line-height: 20px; padding: 9px 16px; border-radius: var(--radius-pill);
  border: 1px solid var(--line); background: var(--surface-200); color: var(--ink); cursor: pointer;
  display: inline-flex; gap: 8px; align-items: center; transition: background 0.15s, border-color 0.15s;
}
.region svg { color: var(--brand); }
.region:hover { border-color: var(--line-strong); }
.region[aria-pressed='true'] { background: var(--brand-soft); border-color: var(--brand); color: var(--brand); }
</style>
