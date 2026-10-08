<script setup lang="ts">
import PageBanner from '@/components/PageBanner.vue'
import { lang, t } from '@/lib/i18n'

// Voeg hier je eigen foto's toe (bestanden in public/images/…).
const photos = [
  { src: '/images/categories/cross.webp', alt: 'Loper in een mistig grasland', caption: 'Cross & trail' },
  { src: '/images/categories/weg.webp', alt: 'Groep lopers op een stadsweg', caption: 'Wegwedstrijden' },
  { src: '/images/categories/kids.webp', alt: 'Kinderen bij de start van een kidsrun', caption: 'Kids Runs' },
]
</script>

<template>
  <PageBanner :title="t('photos.title')" :subtitle="t('photos.sub')" image="/images/categories/weg.webp" />
  <section class="section container">
    <p class="muted intro">
      {{ lang === 'nl' ? 'Binnenkort vind je hier foto’s van evenementen. Heb je mooie foto’s? Stuur ze via de contactpagina.' : 'Event photos are coming soon. Got great shots? Send them via the contact page.' }}
    </p>
    <div class="gallery">
      <figure v-for="p in photos" :key="p.src" class="photo">
        <img :src="p.src" :alt="p.alt" loading="lazy" />
        <figcaption>{{ p.caption }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.intro { margin: 0 0 var(--space-6); }
.gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); }
.photo { margin: 0; position: relative; border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 4 / 3; background: var(--surface-300); }
.photo img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.photo:hover img { transform: scale(1.03); }
figcaption {
  position: absolute; right: 10px; bottom: 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
  padding: 3px 9px; border-radius: var(--radius-pill); background: var(--scrim); color: var(--on-scrim); border: 1px solid rgba(255, 255, 255, 0.55);
}
@media (max-width: 760px) { .gallery { grid-template-columns: 1fr 1fr; } }
@media (max-width: 480px) { .gallery { grid-template-columns: 1fr; } }
</style>
