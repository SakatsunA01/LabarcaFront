<template>
  <main class="home-view">
    <section class="home-section bg-brand-carbon">
      <HeroCarousel />
    </section>
    <section
      class="home-section bg-gradient-to-b from-brand-cream to-white dark:from-brand-carbon dark:to-brand-negro"
    >
      <AvailableTicketsSection />
    </section>
    <section
      class="home-section bg-gradient-to-b from-brand-gris-claro to-white dark:from-brand-negro dark:to-brand-carbon"
    >
      <EventosDestacados />
    </section>
    <section
      class="home-section bg-gradient-to-b from-white to-brand-cream dark:from-brand-carbon dark:to-brand-negro"
    >
      <LanzamientosRecientes />
    </section>
    <section
      class="home-section bg-gradient-to-b from-brand-cream to-brand-gris-claro dark:from-brand-negro dark:to-brand-carbon"
    >
      <ArtistasDestacados />
    </section>
    <section
      class="home-section bg-gradient-to-b from-brand-gris-claro to-brand-cream dark:from-brand-carbon dark:to-brand-negro"
    >
      <NoticiasSection />
    </section>
    <section
      class="home-section bg-gradient-to-b from-white to-brand-gris-claro dark:from-brand-negro dark:to-brand-carbon"
    >
      <MisionSection />
    </section>
    <!-- <TiendaSection /> -->
    <PalabraDeAnimo v-if="authStore.isAuthenticated" id="palabra-animo" />
  </main>
</template>

<script setup lang="ts">
import HeroCarousel from '@/components/HeroCarousel.vue';
import LanzamientosRecientes from '@/components/LanzamientosRecientes.vue'; // Importar el componente correcto
import EventosDestacados from '@/components/EventosDestacados.vue';
import ArtistasDestacados from '@/components/ArtistasDestacados.vue';
import NoticiasSection from '@/components/NoticiasSection.vue';
import MisionSection from '@/components/MisionSection.vue';
// import TiendaSection from '@/components/TiendaSection.vue';
import PalabraDeAnimo from '@/components/PalabraDeAnimo.vue';

import AvailableTicketsSection from '@/components/AvailableTicketsSection.vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
</script>

<style scoped>
.home-view {
  background-color: #f5efe6;
}

.home-section {
  box-shadow:
    inset 0 1px 0 rgba(0, 0, 0, 0.04),
    inset 0 -1px 0 rgba(0, 0, 0, 0.08);
}

:global(.dark) .home-view {
  background-color: #0f1315;
}

:global(.dark) .home-section {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    inset 0 -1px 0 rgba(0, 0, 0, 0.45);
}
</style>
