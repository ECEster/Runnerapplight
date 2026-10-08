<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PageBanner from '@/components/PageBanner.vue'
import EventCard from '@/components/EventCard.vue'
import { loadEvents, usingSampleData } from '@/lib/events'
import { REGIONS } from '@/data/provinces'
import type { RunEvent } from '@/lib/types'
import { t } from '@/lib/i18n'

const events = ref<RunEvent[]>([])
const loading = ref(true)
const error = ref(false)
onMounted(async () => {
  try {
    events.value = await loadEvents()
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})

// Uitgelicht: eerst evenementen met featured = true, aangevuld met de eerstvolgende.
const featured = computed(() => {
  const f = events.value.filter((e) => e.featured)
  const rest = events.value.filter((e) => !e.featured)
  return [...f, ...rest].slice(0, 6).sort((a, b) => a.date.localeCompare(b.date))
})
const regionCount = (provs: string[]) => events.value.filter((e) => provs.includes(e.province)).length
</script>

<template>
  <PageBanner size="md" :title="t('home.title')" :subtitle="t('home.sub')" image="/images/categories/weg.webp">
    <RouterLink to="/agenda" class="btn btn-primary">{{ t('home.cta') }}</RouterLink>
    <RouterLink to="/kids" class="btn btn-secondary">{{ t('nav.kids') }}</RouterLink>
  </PageBanner>

  <section class="section container">
    <div class="section-head">
      <h2 class="h2">{{ t('home.featured') }}</h2>
      <RouterLink to="/agenda" class="btn btn-quiet">{{ t('home.all') }}</RouterLink>
    </div>
    <p v-if="usingSampleData" class="notice" style="margin-bottom: var(--space-6)">{{ t('common.sample') }}</p>
    <p v-if="error" class="notice notice-error">{{ t('common.error') }}</p>
    <p v-else-if="loading" class="muted">{{ t('common.loading') }}</p>
    <div v-else class="card-grid">
      <EventCard v-for="e in featured" :key="e.id" :event="e" />
    </div>
  </section>

  <section class="container">
    <h2 class="h2" style="margin-bottom: var(--space-6)">{{ t('home.regions') }}</h2>
    <div class="regions">
      <RouterLink v-for="r in REGIONS" :key="r.id" :to="{ path: '/agenda', query: { regio: r.id } }" class="region panel">
        <span class="h3">{{ r.label }}</span>
        <span class="muted small">{{ r.provinces.join(', ') }}</span>
        <span class="count">{{ regionCount(r.provinces) }} →</span>
      </RouterLink>
    </div>
  </section>

  <section class="section container promos">
    <RouterLink to="/kids" class="promo kids">
      <div>
        <h2 class="h2">{{ t('home.kidsTitle') }}</h2>
        <p>{{ t('home.kidsText') }}</p>
      </div>
      <svg viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
        <path class="a" d="M0 90 L0 50 C80 20 160 18 240 40 C300 56 350 36 400 30 L400 90 Z" />
        <path class="b" d="M0 90 L0 70 C100 50 200 58 300 68 C340 72 370 64 400 60 L400 90 Z" />
      </svg>
    </RouterLink>
    <RouterLink to="/trainingsschemas" class="promo train">
      <div>
        <h2 class="h2">{{ t('home.trainTitle') }}</h2>
        <p>{{ t('home.trainText') }}</p>
      </div>
      <svg viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
        <path class="trail" d="M10 80 C80 60 120 84 180 62 C240 40 220 24 290 20 C340 17 370 12 395 6" />
      </svg>
    </RouterLink>
  </section>
</template>

<style scoped>
.regions { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); }
.region { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-1); text-decoration: none; color: var(--ink); transition: box-shadow 0.2s, transform 0.2s; }
.region:hover { box-shadow: var(--shadow-raised); transform: translateY(-2px); color: var(--ink); }
.count { margin-top: var(--space-3); font-weight: 600; color: var(--brand); }
.promos { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); }
.promo {
  position: relative; overflow: hidden; border-radius: var(--radius-lg); padding: var(--space-8) var(--space-8) 110px;
  text-decoration: none; color: var(--ink); transition: transform 0.2s;
}
.promo:hover { transform: translateY(-2px); color: var(--ink); }
.promo p { margin: var(--space-3) 0 0; max-width: 420px; }
.promo svg { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 90px; }
.kids { background: var(--accent-soft); }
.kids .a { fill: var(--accent); }
.kids .b { fill: var(--brand); }
.train { background: var(--brand-soft); }
.train .trail { fill: none; stroke: var(--brand); stroke-width: 4; stroke-linecap: round; stroke-dasharray: 1 12; }
@media (max-width: 900px) {
  .regions { grid-template-columns: 1fr 1fr; }
  .promos { grid-template-columns: 1fr; }
}
</style>
