<script setup lang="ts">
import { ref } from 'vue'
import PageBanner from '@/components/PageBanner.vue'
import { PLANS } from '@/data/training'
import { lang, t } from '@/lib/i18n'
const open = ref<string>('5k')
</script>

<template>
  <PageBanner :title="t('training.title')" :subtitle="t('training.sub')" image="/images/categories/cross.webp" position="center 30%" />
  <section class="section container">
    <div class="prose intro">
      <p v-if="lang === 'nl'">
        Kies een schema dat past bij waar je nu staat. Loop rustig: je moet tijdens het lopen nog kunnen praten.
        Voel je pijn, neem dan een extra rustdag of herhaal een week. Bij twijfel over je gezondheid: overleg eerst met je huisarts.
      </p>
      <p v-else>
        Choose a plan that matches where you are now. Run at an easy pace: you should still be able to talk. If something hurts,
        take an extra rest day or repeat a week. If in doubt about your health, check with your GP first. (Plans are in Dutch.)
      </p>
    </div>
    <div class="plans">
      <article v-for="p in PLANS" :key="p.id" class="plan panel" :class="{ open: open === p.id }">
        <button type="button" class="head" :aria-expanded="open === p.id" @click="open = open === p.id ? '' : p.id">
          <span>
            <span class="level">{{ p.level }} · {{ p.weeks.length }} weken</span>
            <h2 class="h3">{{ p.title }}</h2>
            <span class="muted small">{{ p.goal }} {{ p.perWeek }}.</span>
          </span>
          <span class="toggle" aria-hidden="true">{{ open === p.id ? '−' : '+' }}</span>
        </button>
        <ol v-if="open === p.id" class="weeks">
          <li v-for="(w, i) in p.weeks" :key="i"><span class="wk">Week {{ i + 1 }}</span><span>{{ w }}</span></li>
        </ol>
      </article>
    </div>
  </section>
</template>

<style scoped>
.intro { margin-bottom: var(--space-8); }
.plans { display: flex; flex-direction: column; gap: var(--space-4); max-width: 820px; }
.head {
  font: inherit; color: inherit; width: 100%; background: none; border: 0; cursor: pointer; text-align: left;
  display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); padding: var(--space-6);
}
.head > span:first-child { display: flex; flex-direction: column; gap: var(--space-1); }
.level { font-size: 13px; font-weight: 600; color: var(--brand); }
.toggle { width: 36px; height: 36px; flex: none; border-radius: 50%; background: var(--brand-soft); color: var(--brand); display: grid; place-items: center; font-size: 20px; }
.weeks { list-style: none; margin: 0; padding: 0 var(--space-6) var(--space-6); display: flex; flex-direction: column; }
.weeks li { display: grid; grid-template-columns: 90px 1fr; gap: var(--space-3); padding: var(--space-3) 0; border-top: 1px solid var(--line); }
.wk { font-weight: 600; color: var(--ink-muted); font-size: 14px; }
</style>
