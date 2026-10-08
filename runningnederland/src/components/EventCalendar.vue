<script setup lang="ts">
import { computed } from 'vue'
import type { RunEvent } from '@/lib/types'
import { lang, t } from '@/lib/i18n'

const props = defineProps<{ events: RunEvent[]; selected: string }>()
const emit = defineEmits<{ select: [day: string] }>()
const month = defineModel<string>('month', { required: true }) // "2026-10"

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const today = iso(new Date())

const title = computed(() => {
  const [y, m] = month.value.split('-').map(Number)
  const s = new Date(y, m - 1, 1).toLocaleDateString(lang.value === 'en' ? 'en-GB' : 'nl-NL', { month: 'long', year: 'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
})
const weekdays = computed(() => (lang.value === 'en' ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] : ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']))

const counts = computed(() => {
  const m = new Map<string, number>()
  for (const e of props.events) m.set(e.date, (m.get(e.date) ?? 0) + 1)
  return m
})

const days = computed(() => {
  const [y, m] = month.value.split('-').map(Number)
  const first = new Date(y, m - 1, 1)
  const start = new Date(first)
  start.setDate(1 - ((first.getDay() + 6) % 7)) // maandag
  const out: { iso: string; day: number; inMonth: boolean; count: number }[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const k = iso(d)
    out.push({ iso: k, day: d.getDate(), inMonth: d.getMonth() === m - 1, count: counts.value.get(k) ?? 0 })
  }
  // laatste week weglaten als die helemaal in de volgende maand valt
  return out.slice(35).every((d) => !d.inMonth) ? out.slice(0, 35) : out
})

function shift(n: number) {
  const [y, m] = month.value.split('-').map(Number)
  const d = new Date(y, m - 1 + n, 1)
  month.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
</script>

<template>
  <div class="cal panel">
    <div class="head">
      <button type="button" class="nav" :aria-label="t('agenda.prev')" @click="shift(-1)">‹</button>
      <h2 class="month">{{ title }}</h2>
      <button type="button" class="nav" :aria-label="t('agenda.next')" @click="shift(1)">›</button>
    </div>
    <div class="grid" role="grid">
      <div v-for="w in weekdays" :key="w" class="wd" role="columnheader">{{ w }}</div>
      <button
        v-for="d in days"
        :key="d.iso"
        type="button"
        class="day"
        :class="{ out: !d.inMonth, today: d.iso === today, sel: d.iso === selected, has: d.count > 0 }"
        :disabled="d.count === 0"
        :aria-label="`${d.iso}: ${d.count}`"
        @click="emit('select', selected === d.iso ? '' : d.iso)"
      >
        <span class="num">{{ d.day }}</span>
        <span v-if="d.count" class="dots" aria-hidden="true">
          <i v-for="n in Math.min(d.count, 5)" :key="n" />
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.cal { overflow: hidden; }
.head { display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--line); }
.month { font-size: 18px; line-height: 24px; font-weight: 650; }
.nav {
  width: 36px; height: 36px; border-radius: var(--radius-pill); border: 1px solid var(--line); background: var(--surface-200);
  color: var(--ink); font: inherit; font-size: 20px; line-height: 1; cursor: pointer;
}
.nav:hover { background: var(--surface-300); }
.grid { display: grid; grid-template-columns: repeat(7, 1fr); }
.wd { text-align: center; font-size: 12px; font-weight: 600; color: var(--ink-muted); padding: var(--space-2) 0; border-bottom: 1px solid var(--line); }
.day {
  font: inherit; background: transparent; border: 0; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line);
  min-height: 52px; padding: 6px 8px; text-align: left; display: flex; flex-direction: column; gap: 4px; color: var(--ink); cursor: default;
}
.day:nth-child(7n + 7) { border-right: 0; }
.day.has { cursor: pointer; }
.day.has:hover { background: var(--surface-300); }
.out { color: var(--line-strong); background: var(--surface-100); }
.num { font-size: 13px; font-weight: 600; line-height: 18px; }
.today .num { color: var(--brand); text-decoration: underline; text-underline-offset: 3px; }
.sel { background: var(--brand-soft) !important; }
.sel .num { color: var(--brand); }
.dots { display: flex; gap: 3px; flex-wrap: wrap; }
.dots i { width: 6px; height: 6px; border-radius: 50%; background: var(--brand); }
.day:disabled { opacity: 1; }
@media (max-width: 600px) { .day { min-height: 44px; padding: 4px; } }
</style>
