<template>
  <div class="lanzamientos-view bg-brand-gris-claro min-h-screen py-section-md">
    <div class="container mx-auto px-4 max-w-5xl">
      <header class="mb-6 md:mb-10 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-brand-negro">Todos los Lanzamientos</h1>
      </header>

      <!-- Filtro de Búsqueda -->
      <section class="mb-6 md:mb-8 p-3 md:p-4 bg-white rounded-xl shadow-lg">
        <input
v-model="terminoBusqueda" type="text" placeholder="Buscar lanzamiento por título o artista..."
          class="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-brand-camel focus:border-brand-camel transition-colors" />
      </section>

      <!-- Lista de Lanzamientos -->
      <transition name="fade" mode="out-in">
        <div v-if="isLoading" class="text-center py-10">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-camel">
          </div>
          <p class="mt-4 text-brand-negro">Cargando lanzamientos...</p>
        </div>
        <div v-else-if="lanzamientosFiltrados.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div
v-for="lanzamiento in lanzamientosFiltrados" :key="lanzamiento.id"
            class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
            <router-link :to="`/lanzamientos/${lanzamiento.id}`" class="block relative">
              <img
:src="lanzamiento.cover_image_url ? `${API_BASE_URL}${lanzamiento.cover_image_url}` : `https://placehold.co/400x400/E2E2E2/171C1E?text=${encodeURIComponent(lanzamiento.titulo.substring(0, 2))}`"
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
        <div v-else class="text-center py-10 bg-white rounded-xl shadow-md">
          <p class="text-xl text-brand-negro">No se encontraron lanzamientos.</p>
          <p v-if="terminoBusqueda" class="text-gray-600 mt-2">Intenta con otro término de búsqueda.</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
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

const todosLosLanzamientos = ref<Lanzamiento[]>([]);
const terminoBusqueda = ref('');
const isLoading = ref(true);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api`;

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/lanzamientos`);
    // Ordenar por fecha de lanzamiento, los más nuevos primero
    todosLosLanzamientos.value = response.data.sort((a: Lanzamiento, b: Lanzamiento) => {
      return new Date(b.fecha_lanzamiento).getTime() - new Date(a.fecha_lanzamiento).getTime();
    });
  } catch (error) {
    console.error('Error al cargar lanzamientos:', error);
  } finally {
    isLoading.value = false;
  }
});

const lanzamientosFiltrados = computed(() => {
  if (!terminoBusqueda.value) {
    return todosLosLanzamientos.value;
  }
  const searchTerm = terminoBusqueda.value.toLowerCase();
  return todosLosLanzamientos.value.filter(lanzamiento =>
    lanzamiento.titulo.toLowerCase().includes(searchTerm) ||
    lanzamiento.artista.name.toLowerCase().includes(searchTerm)
  );
});

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
