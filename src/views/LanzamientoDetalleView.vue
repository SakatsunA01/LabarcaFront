<template>
  <div class="bg-brand-gris-claro min-h-screen py-section-md px-4 sm:px-6 lg:px-8">
    <div v-if="lanzamiento" class="max-w-5xl mx-auto">

      <router-link to="/lanzamientos" class="inline-flex items-center text-brand-camel hover:text-brand-borgona mb-8 font-inter font-semibold group">
        <ArrowLeftIcon class="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        Volver a Lanzamientos
      </router-link>

      <div class="grid md:grid-cols-3 gap-8 md:gap-12">
        <!-- Columna de la Portada -->
        <div class="md:col-span-1">
          <img :src="lanzamiento.cover_image_url ? `${API_BASE_URL}${lanzamiento.cover_image_url}` : ''" :alt="lanzamiento.titulo" class="w-full h-auto rounded-lg shadow-card object-cover aspect-square">
        </div>

        <!-- Columna de la Información -->
        <div class="md:col-span-2">
          <h1 class="text-4xl md:text-5xl font-bold font-playfair text-brand-negro">{{ lanzamiento.titulo }}</h1>
          <h2 class="text-2xl font-inter text-brand-camel mt-2">{{ lanzamiento.artista?.name }}</h2>

          <!-- Plataformas de Streaming -->
          <div class="mt-8">
            <h3 class="font-inter text-lg font-bold text-brand-negro mb-4">Escúchalo ahora:</h3>
            <div class="flex items-center space-x-4">
              <a v-if="lanzamiento.spotify_link" :href="lanzamiento.spotify_link" target="_blank" class="inline-flex items-center justify-center bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-colors duration-300 shadow-lg">
                <PlayCircleIcon class="h-6 w-6 mr-2" />
                Spotify
              </a>
              <a v-if="lanzamiento.youtube_link" :href="lanzamiento.youtube_link" target="_blank" class="inline-flex items-center justify-center bg-red-600 text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition-colors duration-300 shadow-lg">
                <VideoCameraIcon class="h-6 w-6 mr-2" />
                YouTube
              </a>
            </div>
          </div>

          <!-- Lista de Canciones -->
          <div class="md:col-span-3 mt-16 pt-8 border-t border-gray-200">
            <h3 class="font-playfair text-2xl font-bold text-brand-negro mb-6">Lista de Canciones</h3>
            <ul class="space-y-4">
              <li v-for="(track, index) in lanzamiento.tracks" :key="index" class="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-colors duration-200">
                <div class="flex items-center">
                  <span class="font-inter text-brand-camel w-8 text-center">{{ index + 1 }}</span>
                  <p class="font-inter text-brand-negro ml-4">{{ track.titulo }}</p>
                </div>
                <span class="font-inter text-brand-camel">{{ track.duracion }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="isLoading" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-camel"></div>
      <p class="mt-4 text-brand-negro font-inter">Cargando lanzamiento...</p>
    </div>
    <div v-else class="text-center py-20">
      <p class="text-brand-negro font-inter">{{ error || 'Lanzamiento no encontrado.' }}</p>
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
