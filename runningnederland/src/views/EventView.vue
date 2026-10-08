<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import EventCard from '@/components/EventCard.vue'
import { getEvent, loadEvents } from '@/lib/events'
import { photoFor } from '@/data/categories'
import { km, longDate, price } from '@/lib/format'
import { distanceKm } from '@/lib/geo'
import { isSaved, toggleSaved } from '@/lib/saved'
import type { RunEvent } from '@/lib/types'
import { t } from '@/lib/i18n'

const props = defineProps<{ id: string }>()
const ev = ref<RunEvent | null>(null)
const nearby = ref<RunEvent[]>([])
const loading = ref(true)

watch(
  () => props.id,
  async (id) => {
    loading.value = true
    ev.value = (await getEvent(id)) ?? null
    if (ev.value) document.title = `${ev.value.name} — RunningNederland`
    const e = ev.value
    const all = await loadEvents()
    nearby.value =
      e && e.lat != null && e.lng != null
        ? all
            .filter((o) => o.id !== e.id && o.lat != null && o.lng != null)
            .map((o) => ({ o, d: distanceKm({ lat: e.lat!, lng: e.lng! }, { lat: o.lat!, lng: o.lng! }) }))
            .filter((x) => x.d < 60)
            .sort((a, b) => a.o.date.localeCompare(b.o.date))
            .slice(0, 3)
            .map((x) => x.o)
        : []
    loading.value = false
  },
  { immediate: true },
)
const labels = computed(() => (ev.value ? (ev.value.kids ? ['Kids Runs', ...ev.value.categories] : ev.value.categories) : []))
const mapsUrl = computed(() =>
  ev.value ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ev.value.place}, ${ev.value.province}`)}` : '',
)
</script>

<template>
  <div class="container wrap">
    <RouterLink to="/agenda" class="btn btn-quiet back">{{ t('event.back') }}</RouterLink>
    <p v-if="loading" class="muted">{{ t('common.loading') }}</p>
    <p v-else-if="!ev" class="panel empty">{{ t('event.notFound') }}</p>

    <article v-else class="event">
      <div class="media">
        <img :src="photoFor(ev)" alt="" />
        <div class="labels"><span v-for="c in labels" :key="c" class="label">{{ c }}</span></div>
      </div>

      <div class="content">
        <p class="date">{{ longDate(ev.date) }}<template v-if="ev.time"> · {{ ev.time.slice(0, 5) }}</template></p>
        <h1 class="title">{{ ev.name }}</h1>
        <p class="place muted">{{ ev.place }}, {{ ev.province }}</p>
        <p v-if="ev.cancelled" class="notice notice-error">{{ t('event.cancelled') }}</p>

        <dl class="facts panel">
          <div>
            <dt>{{ t('event.when') }}</dt>
            <dd>{{ longDate(ev.date) }}<template v-if="ev.time">, {{ ev.time.slice(0, 5) }}</template></dd>
          </div>
          <div>
            <dt>{{ t('event.where') }}</dt>
            <dd><a :href="mapsUrl" target="_blank" rel="noopener">{{ ev.place }}</a></dd>
          </div>
          <div v-if="ev.distances.length">
            <dt>{{ t('event.distances') }}</dt>
            <dd>{{ [...ev.distances].sort((a, b) => a - b).map(km).join(' · ') }}</dd>
          </div>
          <div v-if="price(ev)">
            <dt>{{ t('event.price') }}</dt>
            <dd>{{ price(ev, t('event.free')) }}</dd>
          </div>
          <div v-if="ev.organizer">
            <dt>{{ t('event.organizer') }}</dt>
            <dd>{{ ev.organizer }}</dd>
          </div>
          <div v-if="ev.edition">
            <dt>{{ t('event.edition') }}</dt>
            <dd>{{ ev.edition }}</dd>
          </div>
        </dl>
        <p v-if="ev.certified" class="small muted">✓ {{ t('event.certified') }}</p>

        <p v-if="ev.description" class="desc">{{ ev.description }}</p>

        <div class="actions">
          <a v-if="ev.website" :href="ev.website" class="btn btn-primary" target="_blank" rel="noopener">{{ t('event.website') }}</a>
          <button type="button" class="btn btn-secondary" :aria-pressed="isSaved(ev.id)" @click="toggleSaved(ev.id)">
            {{ isSaved(ev.id) ? '✓ ' + t('event.saved') : t('event.save') }}
          </button>
        </div>
      </div>
    </article>

    <section v-if="nearby.length" class="section">
      <h2 class="h2" style="margin-bottom: var(--space-6)">{{ t('event.related') }}</h2>
      <div class="card-grid"><EventCard v-for="e in nearby" :key="e.id" :event="e" /></div>
    </section>
  </div>
</template>

<style scoped>
.wrap { padding-top: var(--space-6); }
.back { margin-left: calc(-1 * var(--space-2)); margin-bottom: var(--space-4); }
.empty { padding: var(--space-8); }
.event { display: grid; grid-template-columns: 1.1fr 1fr; gap: var(--space-8); align-items: start; }
.media { position: relative; border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 4 / 3; background: var(--surface-300); }
.media img { width: 100%; height: 100%; object-fit: cover; }
.labels { position: absolute; right: 10px; bottom: 8px; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.label {
  font-size: 12px; font-weight: 700; line-height: 16px; letter-spacing: 0.05em; text-transform: uppercase;
  padding: 4px 10px; border-radius: var(--radius-pill); background: var(--scrim); color: var(--on-scrim);
  border: 1px solid rgba(255, 255, 255, 0.55); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35); backdrop-filter: blur(4px);
}
.content { display: flex; flex-direction: column; gap: var(--space-3); }
.date { margin: 0; font-weight: 600; color: var(--brand); }
.title { font-size: 32px; line-height: 40px; font-weight: 700; }
.place { margin: 0; }
.facts { margin: var(--space-3) 0 0; padding: var(--space-4) var(--space-6); display: grid; gap: var(--space-3); }
.facts div { display: grid; grid-template-columns: 130px 1fr; gap: var(--space-3); }
dt { font-size: 14px; font-weight: 600; color: var(--ink-muted); }
dd { margin: 0; }
.desc { margin: var(--space-2) 0 0; }
.actions { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-3); }
@media (max-width: 860px) {
  .event { grid-template-columns: 1fr; }
  .title { font-size: 28px; line-height: 36px; }
  .facts div { grid-template-columns: 1fr; gap: 0; }
}
</style>
