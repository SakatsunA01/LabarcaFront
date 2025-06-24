<template>
  <section class="py-8 md:py-12 px-2 sm:px-4 lg:px-6 bg-white">
    <div class="container mx-auto max-w-7xl">
      <div class="flex justify-between items-center mb-6 md:mb-8">
        <h2 class="text-3xl md:text-4xl font-bold text-brand-negro">
          Nuestros Artistas
        </h2>
        <router-link to="/artistas"
          class="bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-80 transition-colors text-md font-medium">
          Ver Todos
        </router-link>
      </div>

      <div v-if="artistas.length > 0"
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
        <p class="text-xl">Próximamente más artistas. ¡Estamos trabajando en ello!</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
// import axios from 'axios'; // Descomentar para usar con API

interface Artista {
  id: string | number;
  name: string;
  imageUrl?: string;
  color?: string; // Color de fallback para el placeholder
}

export default defineComponent({
  name: 'ArtistasDestacados',
  setup() {
    const artistas = ref<Artista[]>([]);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Simulación de carga de datos (reemplazar con llamada a API)
    onMounted(async () => {
      // Aquí iría la llamada a tu API /api/artistas
      // Ejemplo: const response = await axios.get('/api/artistas?limit=6');
      // artistas.value = response.data;
      // Por ahora, datos de ejemplo:
      artistas.value = [
        { id: 1, name: 'Jesús Adrián Romero', imageUrl: 'https://placehold.co/300x300/E0E0E0/BDBDBD?text=JAR', color: '#3498DB' },
        { id: 2, name: 'Marcela Gándara', imageUrl: 'https://placehold.co/300x300/E91E63/FFFFFF?text=MG', color: '#E91E63' },
        { id: 3, name: 'Marcos Witt', imageUrl: 'https://placehold.co/300x300/2ECC71/FFFFFF?text=MW', color: '#2ECC71' },
        { id: 4, name: 'Lilly Goodman', imageUrl: 'https://placehold.co/300x300/9B59B6/FFFFFF?text=LG', color: '#9B59B6' },
        { id: 5, name: 'Alex Campos', imageUrl: 'https://placehold.co/300x300/F1C40F/000000?text=AC', color: '#F1C40F' },
        { id: 6, name: 'Rescate', imageUrl: 'https://placehold.co/300x300/34495E/FFFFFF?text=R', color: '#34495E' },
      ].slice(0, 6); // Mostrar solo algunos en el home
    });

    return {
      artistas,
      API_BASE_URL,
    };
  },
});
</script>
