<script setup lang="ts">
import Wordmark from './Wordmark.vue'
import { REGIONS } from '@/data/provinces'
import { t } from '@/lib/i18n'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <svg class="hills" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true">
      <path class="h1" d="M0 64 L0 40 C200 14 380 8 560 26 C760 46 980 10 1200 18 C1320 22 1390 32 1440 28 L1440 64 Z" />
      <path class="h2" d="M0 64 L0 50 C240 30 460 34 700 48 C920 60 1160 30 1440 42 L1440 64 Z" />
    </svg>
    <div class="inner container">
      <div class="brand">
        <Wordmark inverse />
        <p>{{ t('footer.tagline') }}</p>
      </div>
      <div class="col">
        <h4>{{ t('footer.discover') }}</h4>
        <ul>
          <li><RouterLink to="/agenda">{{ t('nav.agenda') }}</RouterLink></li>
          <li><RouterLink to="/kids">{{ t('nav.kids') }}</RouterLink></li>
          <li><RouterLink to="/trainingsschemas">{{ t('nav.training') }}</RouterLink></li>
          <li><RouterLink to="/fotos">{{ t('nav.photos') }}</RouterLink></li>
        </ul>
      </div>
      <div class="col">
        <h4>{{ t('footer.regions') }}</h4>
        <ul>
          <li v-for="r in REGIONS" :key="r.id"><RouterLink :to="{ path: '/agenda', query: { regio: r.id } }">{{ r.label }}</RouterLink></li>
        </ul>
      </div>
      <div class="col">
        <h4>RunningNederland</h4>
        <ul>
          <li><RouterLink to="/overons">{{ t('nav.about') }}</RouterLink></li>
          <li><RouterLink to="/contact">{{ t('nav.contact') }}</RouterLink></li>
          <li><RouterLink :to="{ path: '/contact', query: { onderwerp: 'evenement' } }">{{ t('footer.submit') }}</RouterLink></li>
        </ul>
      </div>
    </div>
    <div class="bottom container">
      <span>© {{ year }} RunningNederland.nl</span>
      <RouterLink to="/admin">Admin</RouterLink>
    </div>
  </footer>
</template>

<style scoped>
.footer { position: relative; background: var(--inverse); color: var(--on-inverse-muted); margin-top: 96px; }
.hills { position: absolute; left: 0; right: 0; top: -63px; width: 100%; height: 64px; }
.hills .h1 { fill: var(--accent); }
.hills .h2 { fill: var(--inverse); }
.inner { padding-top: var(--space-8); padding-bottom: var(--space-8); display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: var(--space-8); }
.brand p { margin: var(--space-3) 0 0; font-size: 14px; line-height: 20px; max-width: 280px; }
h4 { margin: 0 0 var(--space-3); font-size: 14px; line-height: 20px; font-weight: 600; color: var(--on-inverse); }
ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-2); }
a { color: var(--on-inverse-muted); text-decoration: none; font-size: 14px; line-height: 20px; }
a:hover { color: var(--inverse-link); text-decoration: underline; }
.bottom { padding-top: var(--space-4); padding-bottom: var(--space-6); display: flex; justify-content: space-between; font-size: 13px; border-top: 1px solid rgba(238, 242, 240, 0.12); }
.bottom a { font-size: 13px; }
@media (max-width: 760px) {
  .inner { grid-template-columns: 1fr 1fr; }
  .brand { grid-column: 1 / -1; }
}
</style>
