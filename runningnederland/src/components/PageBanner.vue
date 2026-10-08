<script setup lang="ts">
withDefaults(defineProps<{ title: string; subtitle?: string; image?: string; size?: 'md' | 'sm'; position?: string }>(), { size: 'sm', position: 'center' })
</script>

<template>
  <section class="banner" :class="size">
    <img v-if="image" class="img" :src="image" alt="" :style="{ objectPosition: position }" />
    <div class="shade" />
    <div class="inner container">
      <h1 class="title">{{ title }}</h1>
      <p v-if="subtitle" class="sub">{{ subtitle }}</p>
      <div v-if="$slots.default" class="actions"><slot /></div>
    </div>
    <svg class="curve" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 48 L0 30 C240 6 480 2 720 18 C960 34 1200 36 1440 14 L1440 48 Z" />
    </svg>
  </section>
</template>

<style scoped>
.banner { position: relative; overflow: hidden; display: flex; align-items: flex-end; background: var(--brand); color: #fff; }
.md { min-height: 420px; }
.sm { min-height: 260px; }
.img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.shade {
  position: absolute; inset: 0;
  background:
    linear-gradient(90deg, rgba(13, 20, 24, 0.72) 0%, rgba(13, 20, 24, 0.45) 45%, rgba(13, 20, 24, 0.08) 100%),
    linear-gradient(0deg, rgba(13, 20, 24, 0.35) 0%, rgba(13, 20, 24, 0) 50%);
}
.inner { position: relative; z-index: 1; padding-top: var(--space-12); padding-bottom: 72px; }
.title { margin: 0; color: #fff; font-size: 44px; line-height: 52px; font-weight: 700; letter-spacing: -0.01em; max-width: 640px; text-shadow: 0 1px 12px rgba(0, 0, 0, 0.25); }
.sub { margin: var(--space-3) 0 0; font-size: 18px; line-height: 26px; max-width: 540px; opacity: 0.94; }
.actions { display: flex; gap: var(--space-3); flex-wrap: wrap; margin-top: var(--space-6); }
.curve { position: absolute; left: 0; right: 0; bottom: -1px; width: 100%; height: 40px; z-index: 1; }
.curve path { fill: var(--surface-100); }
@media (max-width: 640px) {
  .md { min-height: 340px; }
  .sm { min-height: 220px; }
  .title { font-size: 32px; line-height: 40px; }
  .sub { font-size: 16px; line-height: 24px; }
  .inner { padding-bottom: 56px; }
}
</style>
