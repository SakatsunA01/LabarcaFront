<template>
  <main>
    <HeroCarousel />
    <MisionSection />
    <LanzamientosSection />
    <EventosDestacados />
    <ArtistasDestacados />
    <NoticiasSection />
    <TiendaSection />
    <PalabraDeAnimo v-if="authStore.isAuthenticated" id="palabra-animo" />
  </main>
</template>

<script setup lang="ts">
import HeroCarousel from '@/components/HeroCarousel.vue';
import EventosDestacados from '@/components/EventosDestacados.vue';
import ArtistasDestacados from '@/components/ArtistasDestacados.vue';
import PalabraDeAnimo from '@/components/PalabraDeAnimo.vue';
import MisionSection from '@/components/MisionSection.vue';
import LanzamientosSection from '@/components/LanzamientosSection.vue';
import NoticiasSection from '@/components/NoticiasSection.vue';
import TiendaSection from '@/components/TiendaSection.vue';

import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
</script>
