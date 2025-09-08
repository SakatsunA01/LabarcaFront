<template>
  <main>
    <HeroCarousel />
    <EventosDestacados />
    <LanzamientosRecientes />
    <ArtistasDestacados />
    <NoticiasSection />
    <MisionSection />
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

import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
</script>
