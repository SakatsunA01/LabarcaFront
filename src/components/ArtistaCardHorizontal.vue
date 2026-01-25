<template>
  <router-link :to="`/artistas/${artista.id}`"
    class="block bg-white rounded-2xl shadow-card overflow-hidden flex flex-col md:flex-row transition-all duration-500 hover:shadow-card-hover group border border-gray-100"
    @click="prepararNavegacionDetalle">
    <div class="md:w-1/4 lg:w-1/5 h-64 md:h-auto relative overflow-hidden shrink-0">
      <img :src="artista.imageUrl ? `${API_BASE_URL}${artista.imageUrl}`
        : `https://placehold.co/400x400/F5EFE6/171C1E?text=${encodeURIComponent(artista.name.substring(0, 2))}`"
        :alt="`Foto de ${artista.name}`"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    </div>

    <div class="md:w-3/4 lg:w-4/5 p-6 md:p-10 flex flex-col min-w-0">
      <div class="flex-grow">
        <h3
          class="font-playfair text-2xl lg:text-3xl text-brand-negro mb-3 group-hover:text-brand-camel transition-colors duration-300 italic">
          {{ artista.name }}
        </h3>

        <div v-if="artista.description"
          class="description-container text-gray-500 text-sm md:text-base leading-relaxed font-sans line-clamp-3 md:line-clamp-4 overflow-hidden"
          v-html="artista.description"></div>
        <p v-else class="text-gray-400 italic text-sm">Biografía en proceso...</p>
      </div>

      <div class="mt-8 pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-[9px] uppercase tracking-[0.3em] text-brand-camel font-bold block mb-3 sm:mb-0">
            Conexiones Digitales
          </span>
        </div>

        <div class="flex flex-wrap gap-5">
          <a v-for="social in socialLinks" :key="social.label" :href="social.url" target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-brand-borgona transition-all duration-300 transform hover:scale-110"
            :aria-label="social.label" @click.stop>
            <component :is="social.icon" class="h-5 w-5 fill-current" />
          </a>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUiStore } from '@/stores/uiStore';
import { LinkIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  artista: any; // Deber??as usar la interfaz Artista importada aqu?? tambi??n
}>();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const uiStore = useUiStore();

const prepararNavegacionDetalle = async () => {
  await uiStore.showLoadingOverlay();
};

const socialLinks = computed(() => {
  const artista = props.artista ?? {};
  const links: { label: string; url: string; icon: typeof LinkIcon }[] = [];

  if (artista.social_instagram) {
    links.push({ label: 'Instagram', url: artista.social_instagram, icon: LinkIcon });
  }
  if (artista.social_facebook) {
    links.push({ label: 'Facebook', url: artista.social_facebook, icon: LinkIcon });
  }
  if (artista.social_youtubeChannel) {
    links.push({ label: 'YouTube', url: artista.social_youtubeChannel, icon: LinkIcon });
  }
  if (artista.social_tiktok) {
    links.push({ label: 'TikTok', url: artista.social_tiktok, icon: MusicalNoteIcon });
  }
  if (artista.social_spotifyProfile) {
    links.push({ label: 'Spotify', url: artista.social_spotifyProfile, icon: LinkIcon });
  }

  return links;
});
</script>
<style scoped>
/* Consistencia con el estilo de eventos para renderizado de HTML */
.description-container :deep(p) {
  display: inline;
  margin: 0;
}

.description-container :deep(p + p)::before {
  content: " ";
  display: inline;
}

/* Forzado de line-clamp para evitar el error de texto encimado */
.description-container {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shadow-card {
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.05);
}

.shadow-card-hover {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.07);
}
</style>