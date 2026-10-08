<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import PageBanner from '@/components/PageBanner.vue'
import { lang, t } from '@/lib/i18n'

// Het formulier gebruikt Netlify Forms: berichten komen binnen in je Netlify-dashboard
// (Site → Forms) en kunnen naar je e-mail worden doorgestuurd.
const route = useRoute()
const subject = ref(route.query.onderwerp === 'evenement' ? 'Evenement aanmelden' : 'Vraag')
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')

async function submit(e: Event) {
  const form = e.target as HTMLFormElement
  status.value = 'sending'
  try {
    const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString()
    const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    if (!res.ok) throw new Error(String(res.status))
    status.value = 'sent'
    form.reset()
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <PageBanner :title="t('contact.title')" :subtitle="t('contact.sub')" image="/images/categories/weg.webp" />
  <section class="section container layout">
    <div class="prose">
      <p v-if="lang === 'nl'">
        Heb je een vraag, een tip of wil je een evenement aanmelden? Vul het formulier in, dan nemen we zo snel mogelijk contact met je op.
        Bij een evenement: vermeld naam, datum, plaats, afstanden en de website van de organisatie.
      </p>
      <p v-else>Have a question, a tip, or want to submit an event? Fill in the form and we’ll get back to you.</p>
    </div>

    <p v-if="status === 'sent'" class="notice panel-ok">{{ lang === 'nl' ? 'Bedankt! Je bericht is verstuurd.' : 'Thanks! Your message has been sent.' }}</p>
    <form v-else name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" class="form panel" @submit.prevent="submit">
      <input type="hidden" name="form-name" value="contact" />
      <p class="visually-hidden"><label>Niet invullen: <input name="bot-field" /></label></p>
      <div class="row">
        <label class="field"><span class="field-label">{{ lang === 'nl' ? 'Naam' : 'Name' }}</span><input name="naam" class="input" required autocomplete="name" /></label>
        <label class="field"><span class="field-label">E-mail</span><input name="email" type="email" class="input" required autocomplete="email" /></label>
      </div>
      <label class="field">
        <span class="field-label">{{ lang === 'nl' ? 'Onderwerp' : 'Subject' }}</span>
        <select v-model="subject" name="onderwerp" class="input">
          <option>Vraag</option>
          <option>Evenement aanmelden</option>
          <option>Fout in de agenda</option>
          <option>Foto’s</option>
          <option>Anders</option>
        </select>
      </label>
      <label class="field"><span class="field-label">{{ lang === 'nl' ? 'Bericht' : 'Message' }}</span><textarea name="bericht" class="input" rows="6" required /></label>
      <p v-if="status === 'error'" class="notice notice-error">{{ t('common.error') }}</p>
      <div><button type="submit" class="btn btn-primary" :disabled="status === 'sending'">{{ lang === 'nl' ? 'Verstuur' : 'Send' }}</button></div>
    </form>
  </section>
</template>

<style scoped>
.layout { display: grid; grid-template-columns: 1fr 1.3fr; gap: var(--space-8); align-items: start; }
.form { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.panel-ok { background: var(--brand-soft); color: var(--brand); }
@media (max-width: 800px) { .layout, .row { grid-template-columns: 1fr; } }
</style>
