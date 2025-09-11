<template>
  <section class="py-16 lg:py-20 px-2 sm:px-4 lg:px-6 bg-gray-50">
    <div class="container mx-auto max-w-7xl">
      <div class="flex justify-between items-center mb-6 md:mb-8">
        <h2 class="text-3xl md:text-4xl font-bold text-brand-negro mb-6 md:mb-8">Nuestra Música Más Reciente</h2>
        <router-link
to="/lanzamientos"
          class="bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-80 transition-colors text-md font-medium">
          Ver Todos
        </router-link>
      </div>

      <div v-if="isLoading" class="text-center text-brand-negro py-10">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-camel mb-4"></div>
        <p class="text-xl">Cargando lanzamientos...</p>
      </div>
      <div
v-else-if="lanzamientos.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div
v-for="lanzamiento in lanzamientos" :key="lanzamiento.id"
          class="bg-brand-gris-claro rounded-xl shadow-lg overflow-hidden flex flex-col">
          <router-link :to="`/lanzamientos/${lanzamiento.id}`" class="block relative">
            <img
:src="lanzamiento.cover_image_url ? lanzamiento.cover_image_url : `https://placehold.co/400x400/E2E2E2/171C1E?text=${encodeURIComponent(lanzamiento.titulo.substring(0, 2))}`"
              :alt="`Portada de ${lanzamiento.titulo}`" class="w-full h-64 object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <PlayIcon class="h-16 w-16 text-white" />
            </div>
          </router-link>
          <div class="p-4 flex-grow">
            <h3 class="text-xl font-bold text-brand-negro mb-1">{{ lanzamiento.titulo }}</h3>
            <p class="text-brand-camel text-md mb-2">{{ lanzamiento.artista.name }}</p>
            <p class="text-gray-600 text-sm">Lanzado el: {{ formatDate(lanzamiento.fecha_lanzamiento) }}</p>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-brand-negro py-10">
        <p class="text-xl">No hay lanzamientos recientes para mostrar en este momento.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '@/services/api';
import { PlayIcon } from '@heroicons/vue/24/solid';

interface Lanzamiento {
  id: number;
  titulo: string;
  artista_id: number;
  fecha_lanzamiento: string;
  cover_image_url?: string | null;
  artista: {
    id: number;
    name: string;
  };
}

const lanzamientos = ref<Lanzamiento[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.get(`/lanzamientos/latest`);
    lanzamientos.value = response.data;
  } catch (error) {
    console.error('Error al cargar lanzamientos recientes:', error);
    lanzamientos.value = [];
  } finally {
    isLoading.value = false;
  }});

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<style scoped>
/* Add any specific styles here */
</style>
