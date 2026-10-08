<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PageBanner from '@/components/PageBanner.vue'
import EventCard from '@/components/EventCard.vue'
import { loadEvents } from '@/lib/events'
import { savedIds } from '@/lib/saved'
import type { RunEvent } from '@/lib/types'
import { t } from '@/lib/i18n'

const all = ref<RunEvent[]>([])
onMounted(async () => (all.value = await loadEvents({ includePast: true })))
const today = new Date().toISOString().slice(0, 10)
const saved = computed(() => all.value.filter((e) => savedIds.value.includes(e.id)).sort((a, b) => a.date.localeCompare(b.date)))
const upcoming = computed(() => saved.value.filter((e) => e.date >= today))
const past = computed(() => saved.value.filter((e) => e.date < today))
</script>

<template>
  <PageBanner :title="t('myruns.title')" :subtitle="t('myruns.sub')" image="/images/categories/cross.webp" position="center 30%" />
  <section class="section container">
    <p v-if="!saved.length" class="panel empty">{{ t('myruns.empty') }}</p>
    <template v-else>
      <div class="card-grid"><EventCard v-for="e in upcoming" :key="e.id" :event="e" /></div>
      <template v-if="past.length">
        <h2 class="h2 past">Gelopen</h2>
        <div class="card-grid"><EventCard v-for="e in past" :key="e.id" :event="e" /></div>
      </template>
      <p class="small muted note">{{ t('myruns.note') }}</p>
    </template>
  </section>
</template>

<style scoped>
.empty { padding: var(--space-8); text-align: center; color: var(--ink-muted); margin: 0; }
.past { margin: var(--space-12) 0 var(--space-6); }
.note { margin-top: var(--space-6); }
</style>
