<template>
  <section class="py-16 lg:py-20 px-2 sm:px-4 lg:px-6 bg-white">
    <div class="container mx-auto max-w-7xl">
      <div class="flex justify-between items-center mb-6 md:mb-8">
        <h2 class="text-3xl md:text-4xl font-bold text-brand-negro mb-6 md:mb-8">
          Nuestros Artistas
        </h2>
        <router-link to="/artistas"
          class="bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-80 transition-colors text-md font-medium">
          Ver Todos
        </router-link>
      </div>

      <div v-if="isLoading" class="text-center text-brand-negro py-10">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-camel mb-4"></div>
        <p class="text-xl">Cargando artistas...</p>
      </div>
      <div v-else-if="artistas.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <div v-for="artista in artistas" :key="artista.id"
          class="relative group aspect-square bg-brand-gris-claro rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <img
            :src="artista.imageUrl
              ? `${API_BASE_URL}${artista.imageUrl}`
              : `https://placehold.co/300x300/${artista.color?.substring(1) || 'E2E2E2'}/171C1E?text=${encodeURIComponent(artista.name.substring(0, 3))}`"
            :alt="`Foto de ${artista.name}`"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
          <div
            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center p-4">
            <h3
              class="text-white text-lg md:text-xl font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {{ artista.name }}
            </h3>
          </div>
          <router-link :to="`/artistas/${artista.id}`" class="absolute inset-0"
            :aria-label="`Ver más de ${artista.name}`"></router-link>
        </div>
      </div>
      <div v-else class="text-center text-brand-negro py-10">
        <p class="text-xl">No hay artistas para mostrar en este momento.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Artista {
  id: string | number;
  name: string;
  imageUrl?: string | null;
  color?: string; // Para el placeholder, aunque no venga de la API
}

const artistas = ref<Artista[]>([]);
const isLoading = ref(true);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:8000/api/artistas');
    // Ordenar por nombre y tomar los primeros 6
    const artistasOrdenados = response.data.sort((a: Artista, b: Artista) => a.name.localeCompare(b.name));
    artistas.value = artistasOrdenados.slice(0, 6);
  } catch (error) {
    console.error("Error al cargar artistas destacados:", error);
    artistas.value = []; // Limpiar artistas en caso de error
  } finally {
    isLoading.value = false;
  }
});
</script>