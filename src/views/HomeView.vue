<template>
  <div class="home">
    <main class="home-content">
      <HeroCarousel />

      <EventosDestacados />
      <ArtistasDestacados />

      <PalabraDeAnimo v-if="authStore.isAuthenticated" id="palabra-animo" />

    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EventosDestacados from '@/components/EventosDestacados.vue';
import ArtistasDestacados from '@/components/ArtistasDestacados.vue';
import HeroCarousel from '@/components/HeroCarousel.vue';
import PalabraDeAnimo from '@/components/PalabraDeAnimo.vue';
import { useAuthStore } from '@/stores/authStore';

export default defineComponent({
  name: 'HomeView',
  components: {
    EventosDestacados,
    ArtistasDestacados,
    HeroCarousel,
    PalabraDeAnimo,
  },
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
});
</script>

<style scoped>
.home-content {
  /* Los paddings y márgenes ahora se manejan mejor dentro de cada sección con Tailwind */
}
</style>
