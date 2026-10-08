<script setup lang="ts">
import { computed } from 'vue'
import type { RunEvent } from '@/lib/types'
import { photoFor } from '@/data/categories'
import { distanceList, price, shortDate } from '@/lib/format'
import { t } from '@/lib/i18n'

const props = defineProps<{ event: RunEvent }>()
const labels = computed(() => (props.event.kids ? ['Kids Runs', ...props.event.categories] : props.event.categories).slice(0, 2))
</script>

<template>
  <RouterLink :to="`/evenement/${event.id}`" class="card">
    <div class="media">
      <img :src="photoFor(event)" alt="" loading="lazy" />
      <div class="labels">
        <span v-for="c in labels" :key="c" class="label">{{ c }}</span>
      </div>
    </div>
    <div class="body">
      <span class="date">
        {{ shortDate(event.date) }}
        <span v-if="event.cancelled" class="cancelled">· {{ t('event.cancelled') }}</span>
      </span>
      <h3 class="title">{{ event.name }}</h3>
      <span class="place">{{ event.place }}</span>
      <span v-if="event.distances.length" class="dist">{{ distanceList(event.distances) }}</span>
      <div class="foot">
        <span class="price" :class="{ free: event.free }">{{ price(event, t('event.free')) }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  display: flex; flex-direction: column; background: var(--surface-200); border: 1px solid var(--line);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-card); overflow: hidden; color: inherit;
  text-decoration: none; transition: box-shadow 0.2s, transform 0.2s;
}
.card:hover { box-shadow: var(--shadow-raised); transform: translateY(-2px); color: inherit; }
.media { position: relative; aspect-ratio: 4 / 3; background: var(--surface-300); overflow: hidden; }
.media img { width: 100%; height: 100%; object-fit: cover; }
.labels { position: absolute; right: 8px; bottom: 6px; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.label {
  font-size: 11px; font-weight: 700; line-height: 14px; letter-spacing: 0.05em; text-transform: uppercase;
  padding: 3px 9px; border-radius: var(--radius-pill); background: var(--scrim); color: var(--on-scrim);
  border: 1px solid rgba(255, 255, 255, 0.55); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);
}
.body { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); flex: 1; }
.date { font-size: 13px; font-weight: 600; line-height: 18px; color: var(--brand); }
.cancelled { color: var(--danger); }
.title { font-size: 18px; line-height: 24px; font-weight: 650; }
.place { font-size: 14px; line-height: 20px; color: var(--ink-muted); }
.dist { font-size: 14px; line-height: 20px; }
.foot { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: var(--space-3); border-top: 1px solid var(--line); font-size: 14px; line-height: 20px; }
.price { font-weight: 600; }
.price.free { color: var(--brand); }
</style>
