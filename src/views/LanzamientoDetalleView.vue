<template>
  <div class="bg-brand-gris-claro min-h-screen py-12 md:py-20 px-6">
    <div v-if="lanzamiento" class="max-w-5xl mx-auto">

      <router-link to="/lanzamientos"
        class="inline-flex items-center text-[10px] uppercase tracking-[0.3em] text-brand-camel hover:text-brand-negro mb-12 font-bold transition-colors group">
        <ArrowLeftIcon class="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        Volver al catálogo
      </router-link>

      <div class="grid md:grid-cols-12 gap-12 lg:gap-20 items-start">
        <div class="md:col-span-5 lg:col-span-4">
          <div class="sticky top-24">
            <img :src="lanzamiento.cover_image_url ? `${API_BASE_URL}${lanzamiento.cover_image_url}` : ''"
              :alt="lanzamiento.titulo"
              class="w-full h-auto rounded-2xl shadow-card object-cover aspect-square transition-transform duration-700 hover:scale-[1.02]">
            <div class="mt-8 space-y-2 opacity-50">
              <p class="text-[9px] uppercase tracking-widest font-bold text-brand-negro">Fecha de Lanzamiento</p>
              <p class="font-playfair text-sm italic">{{ formatDate(lanzamiento.fecha_lanzamiento) }}</p>
            </div>
          </div>
        </div>

        <div class="md:col-span-7 lg:col-span-8">
          <header class="mb-12">
            <h1 class="text-5xl md:text-7xl font-playfair text-brand-negro italic leading-tight mb-4">
              {{ lanzamiento.titulo }}
            </h1>
            <h2 class="text-[12px] uppercase tracking-[0.5em] font-bold text-brand-camel">
              {{ lanzamiento.artista?.name }}
            </h2>
          </header>

          <div class="mb-16">
            <div class="flex flex-wrap gap-4">
              <a v-if="lanzamiento.spotify_link" :href="lanzamiento.spotify_link" target="_blank"
                class="flex items-center px-8 py-3 rounded-full border border-black/5 bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 text-[10px] uppercase tracking-widest font-bold text-brand-negro">
                <PlayCircleIcon class="h-5 w-5 mr-3 text-[#1DB954]" />
                Escuchar en Spotify
              </a>
              <a v-if="lanzamiento.youtube_link" :href="lanzamiento.youtube_link" target="_blank"
                class="flex items-center px-8 py-3 rounded-full border border-black/5 bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 text-[10px] uppercase tracking-widest font-bold text-brand-negro">
                <VideoCameraIcon class="h-5 w-5 mr-3 text-[#FF0000]" />
                Ver en YouTube
              </a>
            </div>
          </div>

          <section class="mt-20">
            <div class="flex items-center gap-6 mb-10">
              <h3 class="font-playfair text-3xl text-brand-negro italic shrink-0">Tracklist</h3>
              <div class="h-[1px] w-full bg-brand-camel/10"></div>
            </div>

            <div class="space-y-1">
              <div v-for="(track, index) in lanzamiento.tracks" :key="index"
                class="group flex items-center justify-between py-4 px-6 rounded-xl hover:bg-white hover:shadow-card transition-all duration-300">
                <div class="flex items-center gap-6">
                  <span
                    class="font-playfair italic text-lg text-brand-camel/40 group-hover:text-brand-camel transition-colors w-6">
                    {{ (index + 1).toString().padStart(2, '0') }}
                  </span>
                  <p class="font-inter text-brand-negro text-sm tracking-wide font-medium">
                    {{ track.titulo }}
                  </p>
                </div>
                <div class="flex items-center gap-4">
                  <span class="font-inter text-[10px] text-gray-400 tracking-widest">
                    {{ track.duracion }}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <div v-else-if="isLoading" class="flex flex-col items-center justify-center py-40">
      <div class="w-10 h-10 border-2 border-brand-camel border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-6 text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Preparando la experiencia</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { ArrowLeftIcon, PlayCircleIcon, VideoCameraIcon } from '@heroicons/vue/24/solid';

interface Lanzamiento {
  id: number;
  titulo: string;
  artista_id: number;
  fecha_lanzamiento: string;
  cover_image_url?: string | null;
  youtube_link?: string | null;
  spotify_link?: string | null;
  tracks: Track[];
  artista: {
    id: number;
    name: string;
  };
}

interface Track {
  titulo: string;
  duracion: string;
}

const route = useRoute();
const lanzamiento = ref<Lanzamiento | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

onMounted(async () => {
  window.scrollTo(0, 0);
  try {
    const response = await axios.get(`${API_URL}/lanzamientos/${route.params.id}`);
    lanzamiento.value = response.data;
  } catch (err: any) {
    console.error('Error al cargar el lanzamiento:', err);
    error.value = 'No se pudo cargar el lanzamiento.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
