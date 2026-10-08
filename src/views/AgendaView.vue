<script setup lang="ts">
import PageBanner from '@/components/PageBanner.vue'
import EventBrowser from '@/components/EventBrowser.vue'
import { t } from '@/lib/i18n'
</script>

<template>
  <PageBanner :title="t('agenda.title')" :subtitle="t('agenda.sub')" image="/images/categories/cross.webp" position="center 30%" />
  <EventBrowser />
</template>
