<script setup lang="ts">
import { ref } from 'vue'
import FilterChip from './FilterChip.vue'
import { EVENT_TYPES } from '@/data/categories'
import { PROVINCES } from '@/data/provinces'
import { EMPTY_FILTERS, type EventFilters } from '@/lib/types'
import { t } from '@/lib/i18n'

const f = defineModel<EventFilters>({ required: true })
const props = defineProps<{ hideKids?: boolean }>()
const more = ref(Boolean(f.value.postcode || f.value.query || f.value.radius))

const distances = [
  { v: '5', l: '5 km' },
  { v: '10', l: '10 km' },
  { v: '15', l: '15 km' },
  { v: '21.1', l: '21,1 km' },
  { v: '42.2', l: '42,2 km' },
]
function clear() {
  f.value = { ...EMPTY_FILTERS, kids: props.hideKids ? f.value.kids : false }
}
</script>

<template>
  <form class="filters panel" @submit.prevent>
    <div class="top">
      <h2 class="h3">{{ t('filters.title') }}</h2>
      <button type="button" class="btn btn-quiet btn-sm" @click="clear">{{ t('filters.clear') }}</button>
    </div>

    <label class="field">
      <span class="field-label">{{ t('filters.type') }}</span>
      <select v-model="f.type" class="input">
        <option value="">{{ t('filters.allTypes') }}</option>
        <option v-for="ty in EVENT_TYPES" :key="ty" :value="ty">{{ ty }}</option>
      </select>
    </label>
    <label class="field">
      <span class="field-label">{{ t('filters.province') }}</span>
      <select v-model="f.province" class="input">
        <option value="">{{ t('filters.allProvinces') }}</option>
        <option v-for="p in PROVINCES" :key="p" :value="p">{{ p }}</option>
      </select>
    </label>
    <label class="field">
      <span class="field-label">{{ t('filters.distance') }}</span>
      <select v-model="f.distance" class="input">
        <option value="">{{ t('filters.allDistances') }}</option>
        <option v-for="d in distances" :key="d.v" :value="d.v">{{ t('filters.upto', { d: d.l }) }}</option>
        <option value="ultra">{{ t('filters.ultra') }}</option>
      </select>
    </label>
    <div class="row">
      <label class="field">
        <span class="field-label">{{ t('filters.from') }}</span>
        <input v-model="f.dateFrom" type="date" class="input" />
      </label>
      <label class="field">
        <span class="field-label">{{ t('filters.to') }}</span>
        <input v-model="f.dateTo" type="date" class="input" :min="f.dateFrom || undefined" />
      </label>
    </div>

    <div class="chips">
      <FilterChip v-if="!hideKids" v-model="f.kids">{{ t('filters.kids') }}</FilterChip>
      <FilterChip v-model="f.relay">{{ t('filters.relay') }}</FilterChip>
      <FilterChip v-model="f.free">{{ t('filters.free') }}</FilterChip>
      <FilterChip v-model="f.certified">{{ t('filters.certified') }}</FilterChip>
    </div>

    <button type="button" class="more" :aria-expanded="more" @click="more = !more">
      {{ more ? t('filters.less') : t('filters.more') }} <span aria-hidden="true">{{ more ? '−' : '+' }}</span>
    </button>
    <div v-if="more" class="extra">
      <label class="field">
        <span class="field-label">{{ t('filters.query') }}</span>
        <input v-model="f.query" type="search" class="input" :placeholder="t('filters.queryPh')" />
      </label>
      <div class="row">
        <label class="field">
          <span class="field-label">{{ t('filters.postcode') }}</span>
          <input v-model="f.postcode" class="input" inputmode="text" maxlength="7" placeholder="9401" autocomplete="postal-code" />
        </label>
        <label class="field">
          <span class="field-label">{{ t('filters.radius') }}</span>
          <select v-model.number="f.radius" class="input" :disabled="!f.postcode">
            <option :value="0">{{ t('filters.noLimit') }}</option>
            <option v-for="r in [10, 25, 50, 100, 150]" :key="r" :value="r">{{ r }} km</option>
          </select>
        </label>
      </div>
      <span v-if="!f.postcode" class="field-hint">{{ t('filters.postcodeHint') }}</span>
    </div>
  </form>
</template>

<style scoped>
.filters { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); }
.top { display: flex; justify-content: space-between; align-items: center; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.more {
  font: inherit; font-size: 14px; font-weight: 600; color: var(--brand); background: none; border: 0; padding: 0;
  cursor: pointer; text-align: left; display: flex; gap: 6px;
}
.more:hover { text-decoration: underline; }
.extra { display: flex; flex-direction: column; gap: var(--space-4); }
</style>
