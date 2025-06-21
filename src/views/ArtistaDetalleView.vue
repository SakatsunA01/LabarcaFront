<template>
  <div class="artista-detalle-view min-h-screen"
    :style="{ backgroundColor: (artista && artista.color) ? artista.color : '#E2E2E2' }">
    <div v-if="isLoading" class="fixed inset-0 bg-brand-negro bg-opacity-75 flex justify-center items-center z-50">
      <div class="w-16 h-16 border-4 border-brand-camel border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error"
      class="fixed inset-0 bg-brand-negro bg-opacity-75 flex flex-col justify-center items-center text-center p-4 z-50">
      <p class="text-2xl text-brand-gris-claro mb-4">Error al cargar el artista.</p>
      <p class="text-gray-400">{{ error }}</p>
      <router-link to="/artistas"
        class="mt-6 inline-block bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-80">
        Volver a Artistas
      </router-link>
    </div>

    <div v-else-if="artista" class="artista-content">
      <!-- Hero Section Artista -->
      <section
        class="relative h-[60vh] md:h-[75vh] bg-brand-negro flex flex-col items-center justify-center text-center p-4">
        <img
          :src="artista.heroImageUrl || artista.imageUrl || `https://placehold.co/1920x1080/171C1E/E2E2E2?text=${encodeURIComponent(artista.name)}`"
          :alt="`Imagen de ${artista.name}`" class="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div class="relative z-10">
          <h1 class="text-4xl md:text-6xl font-bold text-brand-gris-claro drop-shadow-lg">
            {{ artista.name }}
          </h1>
        </div>
      </section>

      <!-- Separador de Color -->
      <div class="h-2 md:h-3" :style="{ backgroundColor: artista.color || '#A18059' }"></div>

      <!-- Sección de Descripción con Fondo Fijo (Parallax) -->
      <section class="relative py-24 md:py-32 bg-fixed bg-cover bg-center"
        :style="{ backgroundImage: `url(${artista.secondaryImageUrl || 'https://placehold.co/1920x1080/cccccc/969696?text=Fondo+Artista'})` }">
        <div class="glass-effect-panel absolute inset-0"></div>
        <div class="container mx-auto max-w-3xl px-4 relative z-10 text-center">
          <h2 class="text-3xl md:text-4xl font-semibold text-white mb-8 drop-shadow-md">Sobre {{ artista.name }}</h2>
          <div v-if="artista.description"
            class="prose-glass max-w-none text-gray-200 leading-loose text-lg md:text-xl drop-shadow-sm mx-auto"
            v-html="artista.description">
          </div>
          <p v-else class="text-gray-300 italic text-lg">No hay descripción disponible para este artista.</p>
        </div>
      </section>

      <!-- Sección Redes y Spotify -->
      <section class="py-12 md:py-16 bg-white">
        <div class="container mx-auto max-w-5xl px-4"> <!-- Aumentado max-w- para mejor distribución -->
          <div class="flex flex-col lg:flex-row gap-10 md:gap-16 items-start">
            <div class="lg:w-3/5"> <!-- Ajustado el ancho para Spotify -->
              <h2 class="text-2xl md:text-3xl font-bold text-brand-negro mb-6">Escucha en Spotify</h2>
              <div v-if="artista.spotifyEmbedUrl" class="aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe style="border-radius:12px" :src="artista.spotifyEmbedUrl" width="100%" height="100%"
                  frameBorder="0" allowfullscreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"></iframe>
              </div>
              <p v-else class="text-gray-600 italic">Playlist de Spotify no disponible.</p>
            </div>
            <div class="lg:w-2/5 w-full"> <!-- Ajustado el ancho para Redes -->
              <h2 class="text-2xl md:text-3xl font-bold text-brand-negro mb-6">Encuentra a nuestro artista</h2>
              <div class="space-y-3">
                <a v-if="artista.social_instagram" :href="artista.social_instagram" target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <LinkIcon class="h-6 w-6 mr-3 text-pink-600" /> <span class="text-brand-negro">Instagram</span>
                </a>
                <a v-if="artista.social_facebook" :href="artista.social_facebook" target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <LinkIcon class="h-6 w-6 mr-3 text-blue-600" /> <span class="text-brand-negro">Facebook</span>
                </a>
                <a v-if="artista.social_youtubeChannel" :href="artista.social_youtubeChannel" target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <LinkIcon class="h-6 w-6 mr-3 text-red-600" /> <span class="text-brand-negro">YouTube</span>
                </a>
                <a v-if="artista.social_tiktok" :href="artista.social_tiktok" target="_blank" rel="noopener noreferrer"
                  class="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <MusicalNoteIcon class="h-6 w-6 mr-3 text-black" /> <span class="text-brand-negro">TikTok</span>
                </a>
                <a v-if="artista.social_spotifyProfile" :href="artista.social_spotifyProfile" target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <LinkIcon class="h-6 w-6 mr-3 text-green-500" /> <span class="text-brand-negro">Perfil de
                    Spotify</span>
                </a>
                <!-- Añade más redes si es necesario -->
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Video de YouTube Hero -->
      <section v-if="artista.youtubeVideoId" class="relative h-[50vh] md:h-[70vh] bg-brand-negro">
        <iframe :src="`https://www.youtube.com/embed/${artista.youtubeVideoId}`" title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
          class="absolute inset-0 w-full h-full"></iframe>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useUiStore } from '@/stores/uiStore';
import { LinkIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline';

interface ArtistaDetallado {
  id: string | number;
  name: string;
  imageUrl?: string | null;
  heroImageUrl?: string | null;
  secondaryImageUrl?: string | null;
  color?: string | null;
  description?: string | null;
  spotifyEmbedUrl?: string | null;
  youtubeVideoId?: string | null;
  social_instagram?: string | null;
  social_facebook?: string | null;
  social_youtubeChannel?: string | null;
  social_tiktok?: string | null;
  social_spotifyProfile?: string | null;
}

const route = useRoute();
const uiStore = useUiStore();
const artista = ref<ArtistaDetallado | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const artistaId = route.params.id;
  if (!artistaId) {
    error.value = "ID de artista no proporcionado.";
    isLoading.value = false;
    uiStore.setRouteLoading(false);
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8000/api/artistas/${artistaId}`);
    artista.value = response.data;
  } catch (err: any) {
    console.error("Error al cargar detalle del artista:", err);
    error.value = err.response?.data?.message || err.message || "No se pudo cargar la información del artista.";
  } finally {
    isLoading.value = false;
    uiStore.setRouteLoading(false);
  }
});
</script>

<style scoped>
.prose :where(p):not(:where([class~="not-prose"] *)) {
  margin-top: 0.8em;
  margin-bottom: 0.8em;
}

/* Para el efecto parallax del fondo fijo */
.bg-fixed {
  background-attachment: fixed;
}

.glass-effect-panel {
  background: rgba(25, 28, 30, 0.6);
  /* brand-negro con un poco más de opacidad para contraste */
  backdrop-filter: blur(10px);
  /* Ajusta el blur según preferencia */
  -webkit-backdrop-filter: blur(10px);
}

.prose-glass {
  color: #e2e2e2;
  /* brand-gris-claro para el texto principal */
  text-align: center;
}

.prose-glass :where(p):not(:where([class~="not-prose"] *)),
.prose-glass :where(ul):not(:where([class~="not-prose"] *)),
.prose-glass :where(ol):not(:where([class~="not-prose"] *)) {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
</style>
