<script setup lang="ts">
import PageBanner from '@/components/PageBanner.vue'
import EventBrowser from '@/components/EventBrowser.vue'
import { lang, t } from '@/lib/i18n'
</script>

<template>
  <PageBanner :title="t('kids.title')" :subtitle="t('kids.sub')" image="/images/categories/kids.webp" />
  <section class="container intro prose">
    <p v-if="lang === 'nl'">
      Bij veel loopevenementen kunnen kinderen meedoen aan een eigen, korte afstand: van een paar honderd meter voor
      de kleintjes tot een kilometer of twee voor de wat oudere lopers. Hieronder vind je alle Kids Runs.
    </p>
    <p v-else>
      Many running events have their own short distance for children: from a few hundred metres for the little ones to
      a mile or so for older kids. Below you’ll find all Kids Runs.
    </p>
  </section>
  <EventBrowser kids-only />
</template>

<style scoped>
.intro { padding-top: var(--space-6); }
</style>
