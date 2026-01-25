<template>
  <div
    class="group relative overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1 border border-gray-100 cursor-pointer h-full flex flex-col">
    <div class="relative aspect-square overflow-hidden shrink-0">
      <img :src="album.cover" :alt="album.title"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110">

      <div
        class="absolute inset-0 bg-brand-negro/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
        <div
          class="w-14 h-14 bg-brand-camel text-white rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-500 active:scale-90">
          <PlayIcon class="w-6 h-6 fill-current ml-1" />
        </div>
      </div>
    </div>

    <div class="p-6 flex flex-col flex-grow">
      <div class="mb-4 flex-grow">
        <h3
          class="font-playfair text-xl lg:text-2xl font-bold text-brand-negro leading-tight line-clamp-1 group-hover:text-brand-camel transition-colors duration-300">
          {{ album.title }}
        </h3>
        <p class="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-camel mt-2">
          {{ album.artist }}
        </p>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-gray-50">
        <span class="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Escuchar en</span>
        <div class="flex items-center gap-4">
          <a v-if="album.spotifyUrl" :href="album.spotifyUrl" target="_blank"
            class="text-gray-400 hover:text-brand-borgona transition-all duration-300 transform hover:scale-110"
            @click.stop>
            <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path
                d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.194 14.054c-.19.31-.57.413-.88.223-2.5-1.52-5.653-1.86-9.354-1.02-.34.08-.68-.14-.76-.48-.08-.34.14-.68.48-.76 4.02-0.913 7.48-0.533 10.28 1.14.31.19.413.57.223.88zm.87-2.31c-.23.37-.7.49-1.07.26-2.79-1.72-7.03-2.23-10.28-1.22-.41.12-.85-.12-.97-.53s.12-.85.53-.97c3.65-1.1 8.28-.55 11.47 1.38.37.23.49.7.26 1.07zm.1-2.58c-3.3-1.98-8.7-2.15-12.05-1.18-.48.14-.99-.16-1.13-.64s.16-.99.64-1.13c3.8-.97 9.7-.73 13.5 1.5.45.27.6.85.33 1.3-.27.45-.85.6-1.3.33z" />
            </svg>
          </a>
          <a v-if="album.youtubeUrl" :href="album.youtubeUrl" target="_blank"
            class="text-gray-400 hover:text-brand-borgona transition-all duration-300 transform hover:scale-110"
            @click.stop>
            <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path
                d="M21.582 7.333c-.246-1.418-1.356-2.528-2.774-2.774C17.068 4 12 4 12 4s-5.068 0-6.808.559c-1.418.246-2.528 1.356-2.774 2.774C2 9.071 2 12 2 12s0 2.929.42 4.667c.246 1.418 1.356 2.528 2.774 2.774C7.071 20 12 20 12 20s4.932 0 6.808-.559c1.418-.246 2.528-1.356 2.774-2.774C22 14.929 22 12 22 12s0-2.929-.418-4.667zM9.75 15.5V8.5l6.5 3.5-6.5 3.5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlayIcon } from '@heroicons/vue/24/solid';

defineProps({
  album: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.05);
}

.shadow-card-hover {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.07);
}
</style>