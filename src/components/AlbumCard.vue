<template>
  <div class="group relative overflow-hidden rounded-lg shadow-md bg-white cursor-pointer">
    <img :src="album.cover" :alt="album.title" class="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-110">
    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
      <div class="w-16 h-16 bg-brand-borgona rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
        <!-- Play Icon SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    <div class="p-4">
      <h3 class="font-playfair text-xl font-bold text-brand-negro truncate">{{ album.title }}</h3>
      <p class="font-inter text-brand-camel mt-1">{{ album.artist }}</p>
      <div class="flex items-center space-x-4 mt-4">
        <a :href="album.spotifyUrl" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-brand-borgona transition-colors">
          <!-- Spotify Icon SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.194 14.054c-.19.31-.57.413-.88.223-2.5-1.52-5.653-1.86-9.354-1.02-.34.08-.68-.14-.76-.48-.08-.34.14-.68.48-.76 4.02-0.913 7.48-0.533 10.28 1.14.31.19.413.57.223.88zm.87-2.31c-.23.37-.7.49-1.07.26-2.79-1.72-7.03-2.23-10.28-1.22-.41.12-.85-.12-.97-.53s.12-.85.53-.97c3.65-1.1 8.28-.55 11.47 1.38.37.23.49.7.26 1.07zm.1-2.58c-3.3-1.98-8.7-2.15-12.05-1.18-.48.14-.99-.16-1.13-.64s.16-.99.64-1.13c3.8-.97 9.7-.73 13.5 1.5.45.27.6.85.33 1.3-.27.45-.85.6-1.3.33z"/></svg>
        </a>
        <a :href="album.youtubeUrl" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-brand-borgona transition-colors">
          <!-- YouTube Icon SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 7.333c-.246-1.418-1.356-2.528-2.774-2.774C17.068 4 12 4 12 4s-5.068 0-6.808.559c-1.418.246-2.528 1.356-2.774 2.774C2 9.071 2 12 2 12s0 2.929.42 4.667c.246 1.418 1.356 2.528 2.774 2.774C7.071 20 12 20 12 20s4.932 0 6.808-.559c1.418-.246 2.528-1.356 2.774-2.774C22 14.929 22 12 22 12s0-2.929-.418-4.667zM9.75 15.5V8.5l6.5 3.5-6.5 3.5z"/></svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  album: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
</style>
