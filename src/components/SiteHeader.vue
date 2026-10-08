<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Wordmark from './Wordmark.vue'
import { lang, t, toggleLang, type Key } from '@/lib/i18n'

const route = useRoute()
const open = ref(false)
watch(() => route.fullPath, () => (open.value = false))

const links: { key: Key; to: string }[] = [
  { key: 'nav.agenda', to: '/agenda' },
  { key: 'nav.training', to: '/trainingsschemas' },
  { key: 'nav.kids', to: '/kids' },
  { key: 'nav.photos', to: '/fotos' },
  { key: 'nav.myruns', to: '/mijnruns' },
  { key: 'nav.about', to: '/overons' },
  { key: 'nav.contact', to: '/contact' },
]
const isActive = (to: string) => route.path === to || (to === '/agenda' && route.path.startsWith('/evenement'))
const langLabel = computed(() => (lang.value === 'en' ? 'NL' : 'EN'))
</script>

<template>
  <header class="header" :class="{ open }">
    <div class="inner container">
      <RouterLink to="/" class="home" aria-label="RunningNederland, naar home"><Wordmark /></RouterLink>
      <nav class="nav" aria-label="Hoofdmenu">
        <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="link" :class="{ active: isActive(l.to) }" :aria-current="isActive(l.to) ? 'page' : undefined">
          {{ t(l.key) }}
        </RouterLink>
      </nav>
      <div class="tools">
        <RouterLink to="/admin" class="admin">Admin</RouterLink>
        <button type="button" class="lang" :aria-label="lang === 'en' ? 'Nederlands' : 'English'" @click="toggleLang">{{ langLabel }}</button>
        <button type="button" class="burger" :aria-expanded="open" :aria-label="t('nav.menu')" @click="open = !open">
          <span /><span /><span />
        </button>
      </div>
    </div>
    <nav v-if="open" class="mobile container" aria-label="Mobiel menu">
      <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="link" :class="{ active: isActive(l.to) }">{{ t(l.key) }}</RouterLink>
      <RouterLink to="/admin" class="link">Admin</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.header { position: sticky; top: 0; z-index: 30; background: var(--surface-200); border-bottom: 1px solid var(--line); }
.inner { height: 64px; display: flex; align-items: center; gap: var(--space-8); }
.home { text-decoration: none; }
.nav { display: flex; gap: var(--space-1); flex: 1; }
.link {
  font-size: 15px; font-weight: 600; line-height: 20px; color: var(--ink-muted); text-decoration: none;
  padding: 8px 12px; border-radius: var(--radius-pill); transition: color 0.15s, background 0.15s; white-space: nowrap;
}
.link:hover { color: var(--ink); background: var(--surface-300); }
.link.active { color: var(--brand); background: var(--brand-soft); }
.tools { display: flex; align-items: center; gap: var(--space-3); margin-left: auto; }
.admin { font-size: 13px; color: var(--ink-muted); text-decoration: none; }
.admin:hover { color: var(--ink); text-decoration: underline; }
.lang {
  font: inherit; font-size: 13px; font-weight: 600; color: var(--ink); background: transparent;
  border: 1px solid var(--line-strong); border-radius: var(--radius-pill); padding: 4px 10px; cursor: pointer;
}
.lang:hover { background: var(--surface-300); }
.burger { display: none; width: 40px; height: 40px; border: 0; background: transparent; border-radius: var(--radius-md); cursor: pointer; flex-direction: column; justify-content: center; align-items: center; gap: 4px; }
.burger span { display: block; width: 20px; height: 2px; border-radius: 2px; background: var(--ink); }
.mobile { display: none; }
@media (max-width: 1080px) {
  .nav, .admin { display: none; }
  .burger { display: flex; }
  .open .mobile { display: flex; flex-direction: column; padding-top: var(--space-2); padding-bottom: var(--space-4); border-top: 1px solid var(--line); }
  .mobile .link { padding: 12px; border-radius: var(--radius-md); font-size: 16px; }
}
</style>
