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
import enzoNoMoreCover from '@/assets/album/enzo_no_more.png';
import deVueltaCover from '@/assets/album/de_vuelta.png';
import trapficandoCover from '@/assets/album/trapficando.png';

const sectionRef = ref(null);
const isVisible = ref(false);

const recentReleases = ref([
  {
    id: 1,
    title: 'No More',
    artist: 'Enzo FNZ',
    cover: enzoNoMoreCover,
    spotifyUrl: 'https://open.spotify.com/intl-es/album/002Uu26kNV28jYfD9cGGCm?si=pPG0zcfLSn-6N0nuKuhogw',
    youtubeUrl: '#',
  },
  {
    id: 2,
    title: 'De Vuelta',
    artist: 'Joni Tevez',
    cover: deVueltaCover,
    spotifyUrl: '#',
    youtubeUrl: '#',
  },
  {
    id: 3,
    title: 'TRAPFICANDO',
    artist: 'Matu Seven',
    cover: trapficandoCover,
    spotifyUrl: 'https://open.spotify.com/intl-es/album/0dI0KymwTHwnaBoSR4N8zw',
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
