<template>
  <router-link :to="`/artistas/${artista.id}`" @click="prepararNavegacionDetalle"
    class="block bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-lg border border-gray-200">
    <div class="md:w-1/4 lg:w-1/5 h-48 md:h-auto relative">
      <img
        :src="artista.imageUrl || `https://placehold.co/300x300/E2E2E2/171C1E?text=${encodeURIComponent(artista.name.substring(0, 2))}`"
        :alt="`Foto de ${artista.name}`" class="w-full h-full object-cover" />
    </div>
    <div class="md:w-3/4 lg:w-4/5 p-5 md:p-6 flex flex-col">
      <h3 class="text-xl lg:text-2xl font-bold text-brand-negro mb-2">
        {{ artista.name }}
      </h3>
      <p v-if="artista.description" class="text-gray-700 text-sm mb-4 flex-grow leading-relaxed">
        {{ artista.description.substring(0, 180) }}{{ artista.description.length > 180 ? '...' : '' }}
      </p>
      <div v-else class="flex-grow"></div>

      <div class="mt-auto pt-3 border-t border-gray-200">
        <p class="text-xs text-gray-500 mb-2">Redes Sociales:</p>
        <div class="flex flex-wrap gap-3">
          <a v-if="artista.social_instagram" :href="artista.social_instagram" target="_blank" rel="noopener noreferrer"
            class="text-brand-camel hover:text-brand-borgona transition-colors" aria-label="Instagram" @click.stop>
            <LinkIcon class="h-6 w-6" /> <!-- Heroicons no tiene Instagram -->
          </a>
          <a v-if="artista.social_facebook" :href="artista.social_facebook" target="_blank" rel="noopener noreferrer"
            class="text-brand-camel hover:text-brand-borgona transition-colors" aria-label="Facebook" @click.stop>
            <LinkIcon class="h-6 w-6" /> <!-- Heroicons no tiene Facebook -->
          </a>
          <a v-if="artista.social_youtubeChannel" :href="artista.social_youtubeChannel" target="_blank"
            rel="noopener noreferrer" class="text-brand-camel hover:text-brand-borgona transition-colors"
            aria-label="YouTube" @click.stop>
            <LinkIcon class="h-6 w-6" /> <!-- Heroicons no tiene YouTube -->
          </a>
          <a v-if="artista.social_tiktok" :href="artista.social_tiktok" target="_blank" rel="noopener noreferrer"
            class="text-brand-camel hover:text-brand-borgona transition-colors" aria-label="TikTok" @click.stop>
            <MusicalNoteIcon class="h-6 w-6" />
          </a>
          <a v-if="artista.social_spotifyProfile" :href="artista.social_spotifyProfile" target="_blank"
            rel="noopener noreferrer" class="text-brand-camel hover:text-brand-borgona transition-colors"
            aria-label="Spotify" @click.stop>
            <LinkIcon class="h-6 w-6" /> <!-- Heroicons no tiene Spotify -->
          </a>
          <!-- Añade más redes si es necesario -->
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore';
import { LinkIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline';

defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  artista: any; // Deberías usar la interfaz Artista importada aquí también
}>();

const uiStore = useUiStore();

const prepararNavegacionDetalle = async () => {
  await uiStore.showLoadingOverlay();
};
</script>
