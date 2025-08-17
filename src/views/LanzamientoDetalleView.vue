<template>
  <div class="bg-brand-gris-claro min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div v-if="album" class="max-w-5xl mx-auto">

      <router-link to="/" class="inline-flex items-center text-brand-camel hover:text-brand-borgona mb-8 font-inter font-semibold group">
        <svg class="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Volver a Inicio
      </router-link>

      <div class="grid md:grid-cols-3 gap-8 md:gap-12">
        <!-- Columna de la Portada -->
        <div class="md:col-span-1">
          <img :src="album.cover" :alt="album.title" class="w-full h-auto rounded-lg shadow-2xl object-cover aspect-square">
        </div>

        <!-- Columna de la Información -->
        <div class="md:col-span-2">
          <h1 class="text-4xl md:text-5xl font-bold font-playfair text-brand-negro">{{ album.title }}</h1>
          <h2 class="text-2xl font-inter text-brand-camel mt-2">{{ album.artist }}</h2>
          
          <p class="font-inter text-brand-negro mt-6 leading-relaxed">{{ album.description }}</p>

          <!-- Plataformas de Streaming -->
          <div class="mt-8">
            <h3 class="font-inter text-lg font-bold text-brand-negro mb-4">Escúchalo ahora:</h3>
            <div class="flex items-center space-x-4">
              <a :href="album.spotifyUrl" target="_blank" class="inline-flex items-center justify-center bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.194 14.054c-.19.31-.57.413-.88.223-2.5-1.52-5.653-1.86-9.354-1.02-.34.08-.68-.14-.76-.48-.08-.34.14-.68.48-.76 4.02-0.913 7.48-0.533 10.28 1.14.31.19.413.57.223.88zm.87-2.31c-.23.37-.7.49-1.07.26-2.79-1.72-7.03-2.23-10.28-1.22-.41.12-.85-.12-.97-.53s.12-.85.53-.97c3.65-1.1 8.28-.55 11.47 1.38.37.23.49.7.26 1.07zm.1-2.58c-3.3-1.98-8.7-2.15-12.05-1.18-.48.14-.99-.16-1.13-.64s.16-.99.64-1.13c3.8-.97 9.7-.73 13.5 1.5.45.27.6.85.33 1.3-.27.45-.85.6-1.3.33z"/></svg>
                Spotify
              </a>
              <a :href="album.youtubeUrl" target="_blank" class="inline-flex items-center justify-center bg-red-600 text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 7.333c-.246-1.418-1.356-2.528-2.774-2.774C17.068 4 12 4 12 4s-5.068 0-6.808.559c-1.418.246-2.528 1.356-2.774 2.774C2 9.071 2 12 2 12s0 2.929.42 4.667c.246 1.418 1.356 2.528 2.774 2.774C7.071 20 12 20 12 20s4.932 0 6.808-.559c1.418-.246 2.528-1.356 2.774-2.774C22 14.929 22 12 22 12s0-2.929-.418-4.667zM9.75 15.5V8.5l6.5 3.5-6.5 3.5z"/></svg>
                YouTube
              </a>
            </div>
          </div>

          <!-- Lista de Canciones -->
          <div class="md:col-span-3 mt-12 pt-8 border-t border-brand-gris-claro">
            <h3 class="font-inter text-2xl font-bold text-brand-negro mb-6">Lista de Canciones</h3>
            <ul class="space-y-4">
              <li v-for="(track, index) in album.tracklist" :key="index" class="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-colors duration-200">
                <div class="flex items-center">
                  <span class="font-inter text-brand-camel w-8 text-center">{{ index + 1 }}</span>
                  <p class="font-inter text-brand-negro ml-4">{{ track.title }}</p>
                </div>
                <span class="font-inter text-brand-camel">{{ track.duration }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20">
      <p class="text-brand-negro font-inter">Álbum no encontrado.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// Mock data para los álbumes
const albums = ref([
  {
    id: 1,
    title: 'Cielos Abiertos',
    artist: 'Comunidad Adoración',
    cover: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?q=80&w=1974&auto=format&fit=crop',
    description: 'Un álbum que explora la majestuosidad de Dios a través de sonidos contemporáneos y letras profundas. Grabado en vivo, captura la energía de una comunidad unida en adoración.',
    spotifyUrl: '#',
    youtubeUrl: '#',
    tracklist: [
      { title: 'Intro (Apertura)', duration: '1:15' },
      { title: 'Tu Reino Aquí', duration: '4:30' },
      { title: 'Cielos Abiertos', duration: '5:12' },
      { title: 'Digno Eres', duration: '6:02' },
      { title: 'Interludio (Oración)', duration: '2:05' },
      { title: 'Mi Refugio', duration: '4:55' },
    ]
  },
  {
    id: 2,
    title: 'Tu Paz Inunda',
    artist: 'Salmistas Unidos',
    cover: 'https://images.unsplash.com/photo-1593533923213-fc6a6a3a3341?q=80&w=1974&auto=format&fit=crop',
    description: 'Canciones de quietud y confianza en medio de la tormenta. Este proyecto acústico es una invitación a encontrar descanso en la presencia de Dios.',
    spotifyUrl: '#',
    youtubeUrl: '#',
    tracklist: [
      { title: 'Al Contemplarte', duration: '3:45' },
      { title: 'Tu Paz Inunda', duration: '4:20' },
      { title: 'Selah', duration: '1:30' },
      { title: 'Confiaré', duration: '5:01' },
    ]
  },
  {
    id: 3,
    title: 'Eco de Tu Voz',
    artist: 'La Barca Collective',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop',
    description: 'El álbum debut de nuestro colectivo de artistas. Una fusión de estilos que celebra la diversidad del cuerpo de Cristo y la unidad en Su Espíritu.',
    spotifyUrl: '#',
    youtubeUrl: '#',
    tracklist: [
      { title: 'Somos Tu Eco', duration: '4:10' },
      { title: 'Libre Soy', duration: '3:50' },
      { title: 'Nuevo Amanecer', duration: '5:15' },
      { title: 'Danzaré', duration: '4:05' },
    ]
  },
]);

const route = useRoute();
const album = computed(() => {
  // El `id` de la ruta es un string, lo convertimos a número
  return albums.value.find(a => a.id === Number(route.params.id));
});

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
