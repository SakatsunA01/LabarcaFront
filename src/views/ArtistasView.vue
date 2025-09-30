<template>
  <div class="artistas-view bg-brand-gris-claro min-h-screen py-section-md">
    <div class="container mx-auto px-4 max-w-5xl">
      <header class="mb-6 md:mb-10 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-brand-negro">Nuestros Artistas</h1>
      </header>

      <!-- Filtro de Búsqueda -->
      <section class="mb-6 md:mb-8 p-3 md:p-4 bg-white rounded-xl shadow-lg">
        <input
v-model="terminoBusqueda" type="text" placeholder="Buscar artista por nombre..."
          class="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-brand-camel focus:border-brand-camel transition-colors" />
      </section>

      <!-- Lista de Artistas -->
      <transition name="fade" mode="out-in">
        <div v-if="isLoading" class="text-center py-10">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-camel">
          </div>
          <p class="mt-4 text-brand-negro">Cargando artistas...</p>
        </div>
        <div v-else-if="Object.keys(artistasAgrupados).length > 0" class="space-y-10">
          <div v-for="(artistasPorLetra, letra) in artistasAgrupados" :key="letra">
            <h2
              class="text-2xl md:text-3xl font-semibold text-brand-verde-oscuro mb-4 md:mb-6 border-b-2 border-brand-camel pb-2 sticky top-0 bg-brand-gris-claro py-2 z-10">
              {{ letra }}
            </h2>
            <div class="space-y-6">
              <ArtistaCardHorizontal v-for="artista in artistasPorLetra" :key="artista.id" :artista="artista" />
            </div>
          </div>
        </div>
        <div v-else class="text-center py-10 bg-white rounded-xl shadow-md">
          <p class="text-xl text-brand-negro">No se encontraron artistas.</p>
          <p v-if="terminoBusqueda" class="text-gray-600 mt-2">Intenta con otro término de búsqueda.</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ArtistaCardHorizontal from '@/components/ArtistaCardHorizontal.vue';
import axios from 'axios';
import { useUiStore } from '@/stores/uiStore';

interface Artista {
  id: string | number;
  name: string;
  imageUrl?: string | null;
  description?: string | null;
  social_instagram?: string | null;
  social_facebook?: string | null;
  social_youtubeChannel?: string | null;
  social_tiktok?: string | null;
  social_spotifyProfile?: string | null;
  // Añade más campos si es necesario
}

interface ArtistasAgrupados {
  [letra: string]: Artista[];
}

const todosLosArtistas = ref<Artista[]>([]);
const terminoBusqueda = ref('');
const isLoading = ref(true);
const uiStore = useUiStore();

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('https://api.labarcaministerio.com/api/artistas');
    todosLosArtistas.value = response.data;
  } catch (error) {
    console.error("Error al cargar artistas:", error);
  }
  isLoading.value = false;
  uiStore.setRouteLoading(false);
});

const artistasFiltrados = computed(() => {
  if (!terminoBusqueda.value) {
    return todosLosArtistas.value;
  }
  return todosLosArtistas.value.filter(artista =>
    artista.name.toLowerCase().includes(terminoBusqueda.value.toLowerCase())
  );
});

const artistasAgrupados = computed(() => {
  const agrupados: ArtistasAgrupados = {};
  const artistasOrdenados = [...artistasFiltrados.value].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  artistasOrdenados.forEach(artista => {
    const primeraLetra = artista.name.charAt(0).toUpperCase();
    if (!agrupados[primeraLetra]) {
      agrupados[primeraLetra] = [];
    }
    agrupados[primeraLetra].push(artista);
  });
  return agrupados;
});

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

/* Estilo para que el encabezado de la letra sea pegajoso */
.sticky {
  /* Tailwind ya provee 'sticky top-0', pero puedes añadir más estilos si es necesario */
}
</style>
