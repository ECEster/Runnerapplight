<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EventCard from './EventCard.vue'
import EventCalendar from './EventCalendar.vue'
import FilterPanel from './FilterPanel.vue'
import RegionPicker from './RegionPicker.vue'
import { loadEvents, usingSampleData } from '@/lib/events'
import { applyFilters, sortEvents } from '@/lib/filter'
import { geocodePostcode } from '@/lib/geo'
import { EMPTY_FILTERS, type DistanceBucket, type EventFilters, type RunEvent } from '@/lib/types'
import { longDate } from '@/lib/format'
import { t } from '@/lib/i18n'

const props = defineProps<{ kidsOnly?: boolean }>()
const PAGE = 12
const route = useRoute()
const router = useRouter()

const all = ref<RunEvent[]>([])
const loading = ref(true)
const error = ref(false)

// --- filters uit de URL lezen, zodat je een gefilterde agenda kunt delen ---
const q = route.query
const s = (k: string) => (typeof q[k] === 'string' ? (q[k] as string) : '')
const filters = ref<EventFilters>({
  ...EMPTY_FILTERS,
  region: s('regio'),
  type: s('soort'),
  province: s('provincie'),
  distance: s('afstand') as DistanceBucket,
  dateFrom: s('van'),
  dateTo: s('tot'),
  kids: props.kidsOnly || s('kids') === '1',
  relay: s('estafette') === '1',
  free: s('gratis') === '1',
  certified: s('gecertificeerd') === '1',
  postcode: s('postcode'),
  radius: Number(s('straal')) || 0,
  query: s('q'),
})
const day = ref(s('dag'))
const sort = ref<'date' | 'name'>(s('sort') === 'name' ? 'name' : 'date')
const page = ref(Number(s('pagina')) || 1)
const now = new Date()
const month = ref(day.value ? day.value.slice(0, 7) : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)

const origin = ref<{ lat: number; lng: number } | null>(null)
watch(
  () => filters.value.postcode,
  async (pc) => (origin.value = pc ? await geocodePostcode(pc) : null),
  { immediate: true },
)

const filtered = computed(() => applyFilters(all.value, filters.value, origin.value))
const visible = computed(() => sortEvents(day.value ? filtered.value.filter((e) => e.date === day.value) : filtered.value, sort.value))
const pages = computed(() => Math.max(1, Math.ceil(visible.value.length / PAGE)))
const shown = computed(() => visible.value.slice((page.value - 1) * PAGE, page.value * PAGE))

watch([filters, day, sort], () => (page.value = 1), { deep: true })
watch(
  [filters, day, sort, page],
  () => {
    const f = filters.value
    const query: Record<string, string> = {}
    const set = (k: string, v: string | number | boolean) => {
      if (v && v !== '0') query[k] = v === true ? '1' : String(v)
    }
    set('regio', f.region); set('soort', f.type); set('provincie', f.province); set('afstand', f.distance)
    set('van', f.dateFrom); set('tot', f.dateTo); if (!props.kidsOnly) set('kids', f.kids)
    set('estafette', f.relay); set('gratis', f.free); set('gecertificeerd', f.certified)
    set('postcode', f.postcode); set('straal', f.radius); set('q', f.query)
    set('dag', day.value); if (sort.value === 'name') set('sort', 'name'); if (page.value > 1) set('pagina', page.value)
    router.replace({ query })
  },
  { deep: true },
)

function goPage(n: number) {
  page.value = n
  document.getElementById('resultaten')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(async () => {
  try {
    all.value = await loadEvents()
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="browser container">
    <RegionPicker v-model="filters.region" class="regions" />
    <p v-if="usingSampleData" class="notice sample">{{ t('common.sample') }}</p>

    <div class="layout">
      <aside class="side">
        <FilterPanel v-model="filters" :hide-kids="kidsOnly" />
      </aside>

      <div class="main">
        <EventCalendar v-model:month="month" :events="filtered" :selected="day" @select="(d) => (day = d)" />

        <div id="resultaten" class="bar">
          <p class="count muted">
            <template v-if="loading">{{ t('common.loading') }}</template>
            <template v-else>{{ visible.length === 1 ? t('agenda.found1') : t('agenda.found', { n: visible.length }) }}</template>
            <template v-if="day">
              · {{ t('agenda.day', { d: longDate(day) }) }}
              <button type="button" class="btn btn-quiet btn-sm" @click="day = ''">{{ t('agenda.clearDay') }}</button>
            </template>
          </p>
          <label>
            <span class="visually-hidden">Sorteren</span>
            <select v-model="sort" class="input sort">
              <option value="date">{{ t('agenda.sortDate') }}</option>
              <option value="name">{{ t('agenda.sortName') }}</option>
            </select>
          </label>
        </div>

        <p v-if="error" class="notice notice-error">{{ t('common.error') }}</p>
        <p v-else-if="!loading && !visible.length" class="empty panel">{{ t('agenda.none') }}</p>
        <div v-else class="card-grid">
          <EventCard v-for="e in shown" :key="e.id" :event="e" />
        </div>

        <nav v-if="pages > 1" class="pager" aria-label="Paginering">
          <button type="button" class="btn btn-secondary btn-sm" :disabled="page <= 1" @click="goPage(page - 1)">{{ t('agenda.prev') }}</button>
          <span class="muted small">{{ t('agenda.page', { p: page, n: pages }) }}</span>
          <button type="button" class="btn btn-secondary btn-sm" :disabled="page >= pages" @click="goPage(page + 1)">{{ t('agenda.next') }}</button>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.browser { padding-top: var(--space-6); }
.regions { margin-bottom: var(--space-6); }
.sample { margin-bottom: var(--space-6); }
.layout { display: grid; grid-template-columns: 300px 1fr; gap: var(--space-8); align-items: start; }
.side { position: sticky; top: 88px; }
.main { display: flex; flex-direction: column; gap: var(--space-6); min-width: 0; }
.bar { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); flex-wrap: wrap; scroll-margin-top: 88px; }
.count { margin: 0; font-size: 14px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.sort { width: auto; font-size: 14px; padding: 7px 10px; }
.empty { padding: var(--space-8); text-align: center; color: var(--ink-muted); margin: 0; }
.pager { display: flex; justify-content: center; align-items: center; gap: var(--space-4); }
.main :deep(.card-grid) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (max-width: 1180px) { .main :deep(.card-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .side { position: static; }
}
@media (max-width: 600px) { .main :deep(.card-grid) { grid-template-columns: 1fr; } }
</style>
