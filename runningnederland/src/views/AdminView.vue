<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { deleteEvent, loadEvents, saveEvent } from '@/lib/events'
import { EVENT_TYPES } from '@/data/categories'
import { PROVINCES } from '@/data/provinces'
import type { RunEvent } from '@/lib/types'
import { shortDate } from '@/lib/format'

const session = ref<Session | null>(null)
const email = ref('')
const password = ref('')
const authError = ref('')
const events = ref<RunEvent[]>([])
const search = ref('')
const showPast = ref(false)
const editing = ref<(Partial<RunEvent> & { distancesText?: string }) | null>(null)
const busy = ref(false)
const message = ref('')

onMounted(async () => {
  if (!supabase) return
  session.value = (await supabase.auth.getSession()).data.session
  supabase.auth.onAuthStateChange((_e, s) => {
    session.value = s
  })
  if (session.value) await refresh()
})

async function login() {
  authError.value = ''
  const { error } = await supabase!.auth.signInWithPassword({ email: email.value, password: password.value })
  if (error) authError.value = 'Inloggen mislukt: controleer je e-mail en wachtwoord.'
  else await refresh()
}
async function logout() {
  await supabase!.auth.signOut()
}
async function refresh() {
  events.value = await loadEvents({ includePast: true, fresh: true })
}

const today = new Date().toISOString().slice(0, 10)
const list = computed(() => {
  const q = search.value.toLowerCase()
  return events.value
    .filter((e) => showPast.value || e.date >= today)
    .filter((e) => !q || `${e.name} ${e.place}`.toLowerCase().includes(q))
})

function edit(e?: RunEvent) {
  message.value = ''
  editing.value = e
    ? { ...e, distancesText: e.distances.join(', ').replace(/\./g, ',').replace(/,(\d) /g, ',$1 ') }
    : { name: '', date: today, place: '', province: 'Groningen', categories: [], distances: [], free: false, kids: false, relay: false, certified: false, featured: false, distancesText: '' }
}
function parseDistances(s: string): number[] {
  return s
    .split(/[;|]|,(?=\s)|\s+/)
    .map((x) => Number(x.replace(',', '.').replace(/km/i, '')))
    .filter((n) => !Number.isNaN(n) && n > 0)
}
async function save() {
  if (!editing.value) return
  busy.value = true
  message.value = ''
  try {
    const { distancesText, ...e } = editing.value
    await saveEvent({ ...e, distances: parseDistances(distancesText ?? '') })
    message.value = 'Opgeslagen.'
    editing.value = null
    await refresh()
  } catch (err) {
    message.value = 'Opslaan mislukt: ' + (err as Error).message
  } finally {
    busy.value = false
  }
}
async function remove(e: RunEvent) {
  if (!confirm(`"${e.name}" definitief verwijderen?`)) return
  try {
    await deleteEvent(e.id)
    await refresh()
  } catch (err) {
    message.value = 'Verwijderen mislukt: ' + (err as Error).message
  }
}
function toggleCategory(c: string) {
  const cats = editing.value!.categories ?? []
  editing.value!.categories = cats.includes(c) ? cats.filter((x) => x !== c) : [...cats, c]
}
</script>

<template>
  <section class="section container admin">
    <h1 class="h2">Beheer</h1>

    <p v-if="!supabase" class="notice">
      Supabase is nog niet gekoppeld. Vul <code>VITE_SUPABASE_URL</code> en <code>VITE_SUPABASE_ANON_KEY</code> in
      (lokaal in <code>.env.local</code>, online bij Netlify → Site configuration → Environment variables). Zie de README.
    </p>

    <form v-else-if="!session" class="login panel" @submit.prevent="login">
      <h2 class="h3">Inloggen</h2>
      <label class="field"><span class="field-label">E-mail</span><input v-model="email" type="email" class="input" required autocomplete="username" /></label>
      <label class="field"><span class="field-label">Wachtwoord</span><input v-model="password" type="password" class="input" required autocomplete="current-password" /></label>
      <p v-if="authError" class="notice notice-error">{{ authError }}</p>
      <button type="submit" class="btn btn-primary">Inloggen</button>
    </form>

    <template v-else>
      <div class="bar">
        <input v-model="search" type="search" class="input search" placeholder="Zoek op naam of plaats" />
        <label class="check"><input v-model="showPast" type="checkbox" /> Ook voorbije evenementen</label>
        <button type="button" class="btn btn-primary" @click="edit()">+ Nieuw evenement</button>
        <button type="button" class="btn btn-quiet" @click="logout">Uitloggen</button>
      </div>
      <p v-if="message" class="notice">{{ message }}</p>

      <form v-if="editing" class="editor panel" @submit.prevent="save">
        <h2 class="h3">{{ editing.id ? 'Evenement bewerken' : 'Nieuw evenement' }}</h2>
        <div class="grid">
          <label class="field wide"><span class="field-label">Naam</span><input v-model="editing.name" class="input" required /></label>
          <label class="field"><span class="field-label">Datum</span><input v-model="editing.date" type="date" class="input" required /></label>
          <label class="field"><span class="field-label">Starttijd</span><input v-model="editing.time" type="time" class="input" /></label>
          <label class="field"><span class="field-label">Plaats</span><input v-model="editing.place" class="input" required /></label>
          <label class="field">
            <span class="field-label">Provincie</span>
            <select v-model="editing.province" class="input"><option v-for="p in PROVINCES" :key="p">{{ p }}</option></select>
          </label>
          <label class="field"><span class="field-label">Afstanden (km)</span><input v-model="editing.distancesText" class="input" placeholder="5, 10, 21,1" /></label>
          <label class="field"><span class="field-label">Editie</span><input v-model="editing.edition" class="input" placeholder="bv. 12e editie" /></label>
          <label class="field"><span class="field-label">Prijs vanaf (€)</span><input v-model.number="editing.priceMin" type="number" step="0.5" min="0" class="input" /></label>
          <label class="field"><span class="field-label">Prijs tot (€)</span><input v-model.number="editing.priceMax" type="number" step="0.5" min="0" class="input" /></label>
          <label class="field wide"><span class="field-label">Website</span><input v-model="editing.website" type="url" class="input" placeholder="https://" /></label>
          <label class="field"><span class="field-label">Organisatie</span><input v-model="editing.organizer" class="input" /></label>
          <label class="field"><span class="field-label">Eigen foto (URL, optioneel)</span><input v-model="editing.image" class="input" placeholder="Leeg = foto van de categorie" /></label>
          <label class="field"><span class="field-label">Breedtegraad (lat)</span><input v-model.number="editing.lat" type="number" step="0.0001" class="input" /></label>
          <label class="field"><span class="field-label">Lengtegraad (lng)</span><input v-model.number="editing.lng" type="number" step="0.0001" class="input" /></label>
          <label class="field wide"><span class="field-label">Omschrijving</span><textarea v-model="editing.description" class="input" rows="4" /></label>
        </div>
        <fieldset class="cats">
          <legend class="field-label">Soort</legend>
          <label v-for="c in EVENT_TYPES" :key="c" class="check"><input type="checkbox" :checked="editing.categories?.includes(c)" @change="toggleCategory(c)" /> {{ c }}</label>
        </fieldset>
        <div class="flags">
          <label class="check"><input v-model="editing.kids" type="checkbox" /> Kids Run</label>
          <label class="check"><input v-model="editing.relay" type="checkbox" /> Estafette</label>
          <label class="check"><input v-model="editing.free" type="checkbox" /> Gratis</label>
          <label class="check"><input v-model="editing.certified" type="checkbox" /> Gecertificeerd</label>
          <label class="check"><input v-model="editing.featured" type="checkbox" /> Uitlichten op homepage</label>
          <label class="check"><input v-model="editing.cancelled" type="checkbox" /> Afgelast</label>
        </div>
        <div class="actions">
          <button type="submit" class="btn btn-primary" :disabled="busy">Opslaan</button>
          <button type="button" class="btn btn-secondary" @click="editing = null">Annuleren</button>
        </div>
      </form>

      <div class="table panel">
        <table>
          <thead><tr><th>Datum</th><th>Naam</th><th>Plaats</th><th>Soort</th><th></th></tr></thead>
          <tbody>
            <tr v-for="e in list" :key="e.id">
              <td class="nowrap">{{ shortDate(e.date) }}</td>
              <td>{{ e.name }} <span v-if="e.featured" class="star" title="Uitgelicht">★</span></td>
              <td>{{ e.place }}</td>
              <td class="muted small">{{ e.categories.join(', ') }}</td>
              <td class="nowrap">
                <button type="button" class="btn btn-quiet btn-sm" @click="edit(e)">Bewerken</button>
                <button type="button" class="btn btn-quiet btn-sm del" @click="remove(e)">Verwijderen</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>

<style scoped>
.admin { display: flex; flex-direction: column; gap: var(--space-6); }
.login { padding: var(--space-6); max-width: 420px; display: flex; flex-direction: column; gap: var(--space-4); }
.bar { display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap; }
.search { max-width: 320px; }
.check { display: inline-flex; gap: 6px; align-items: center; font-size: 14px; }
.editor { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); }
.wide { grid-column: span 2; }
.cats { border: 0; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: var(--space-2) var(--space-4); }
.cats legend { margin-bottom: var(--space-2); }
.flags { display: flex; flex-wrap: wrap; gap: var(--space-4); }
.actions { display: flex; gap: var(--space-3); }
.table { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
th, td { text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--line); vertical-align: middle; }
th { font-weight: 600; color: var(--ink-muted); }
.nowrap { white-space: nowrap; }
.star { color: var(--brand); }
.del { color: var(--danger); }
code { font-size: 13px; }
@media (max-width: 800px) { .grid { grid-template-columns: 1fr 1fr; } }
</style>
