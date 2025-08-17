<template>
  <section ref="sectionRef" class="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="max-w-7xl mx-auto">
      <div 
        class="text-center mb-16 transition-all duration-1000 ease-out"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
      >
        <h2 class="font-playfair text-4xl md:text-5xl font-bold text-brand-negro">
          Nuestra Música Más Reciente
        </h2>
        <p class="mt-4 font-inter text-lg text-brand-camel">
          El sonido que nace de corazones rendidos.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <router-link
          v-for="(album, index) in recentReleases"
          :key="album.id"
          :to="{ name: 'lanzamiento-detalle', params: { id: album.id } }"
          class="transition-all duration-700 ease-out block"
          :style="{ transitionDelay: `${index * 150}ms` }"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
        >
          <AlbumCard :album="album" />
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AlbumCard from './AlbumCard.vue';

const sectionRef = ref(null);
const isVisible = ref(false);

const recentReleases = ref([
  {
    id: 1,
    title: 'Cielos Abiertos',
    artist: 'Comunidad Adoración',
    cover: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?q=80&w=1974&auto=format&fit=crop',
    spotifyUrl: '#',
    youtubeUrl: '#',
  },
  {
    id: 2,
    title: 'Tu Paz Inunda',
    artist: 'Salmistas Unidos',
    cover: 'https://images.unsplash.com/photo-1593533923213-fc6a6a3a3341?q=80&w=1974&auto=format&fit=crop',
    spotifyUrl: '#',
    youtubeUrl: '#',
  },
  {
    id: 3,
    title: 'Eco de Tu Voz',
    artist: 'La Barca Collective',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop',
    spotifyUrl: '#',
    youtubeUrl: '#',
  },
]);

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // Lower threshold for grid
    }
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});
</script>

<style scoped>
</style>
