<script setup lang="ts">
import PageBanner from '@/components/PageBanner.vue'
import { lang, t } from '@/lib/i18n'
</script>

<template>
  <PageBanner :title="t('about.title')" :subtitle="t('about.sub')" image="/images/categories/cross.webp" position="center 30%" />
  <section class="section container">
    <div v-if="lang === 'nl'" class="prose">
      <p>
        RunningNederland is het overzicht van hardloopevenementen in Nederland: van de grote stadsmarathon tot de kleine,
        lokaal georganiseerde cross in het bos. Juist die kleinere loopjes zijn vaak lastig te vinden — daarom zetten we
        ze allemaal op één plek.
      </p>
      <h2>Wat je hier vindt</h2>
      <p>
        Een agenda die je kunt filteren op soort, provincie, afstand en datum; Kids Runs voor de jongste lopers;
        trainingsschema’s om rustig naar je doel toe te werken; en Mijn Runs om evenementen te bewaren.
      </p>
      <h2>Mis je een evenement?</h2>
      <p>
        Laat het ons weten via de <RouterLink to="/contact">contactpagina</RouterLink>. We controleren de gegevens en
        zetten het evenement zo snel mogelijk in de agenda.
      </p>
    </div>
    <div v-else class="prose">
      <p>
        RunningNederland is the overview of running events in the Netherlands: from the big city marathon to the small,
        locally organised cross-country run in the woods. Those smaller races are often hard to find — so we list them all in one place.
      </p>
      <h2>Missing an event?</h2>
      <p>Let us know via the <RouterLink to="/contact">contact page</RouterLink>.</p>
    </div>
  </section>
</template>
