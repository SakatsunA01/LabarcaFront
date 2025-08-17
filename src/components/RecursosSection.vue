<template>
  <section ref="sectionRef" class="bg-brand-verde-oscuro py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div 
      class="max-w-5xl mx-auto text-center transition-all duration-1000 ease-out"
      :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
    >
      <h2 class="font-playfair text-4xl md:text-5xl font-bold text-white">
        Recursos para tu Iglesia
      </h2>
      <p class="mt-4 font-inter text-lg text-brand-gris-claro max-w-3xl mx-auto">
        Ponemos a tu disposición estas herramientas, creadas con excelencia y oración, para bendecir y equipar a los equipos de alabanza de la iglesia local.
      </p>
    </div>

    <div class="mt-16 max-w-5xl mx-auto">
      <div class="flex flex-col space-y-4">
        <div 
          v-for="(song, index) in resources" 
          :key="song.id" 
          class="bg-white/10 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between transition-all duration-700 ease-out"
          :style="{ transitionDelay: `${index * 150}ms` }"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
        >
          <div class="mb-4 md:mb-0 text-center md:text-left">
            <h3 class="font-inter font-bold text-xl text-white">{{ song.title }}</h3>
            <p class="font-inter text-brand-gris-claro">{{ song.artist }}</p>
          </div>
          <div class="flex items-center space-x-2 md:space-x-4">
            <a :href="song.lyricsUrl" target="_blank" class="btn btn-primary">
              <!-- PDF Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-4V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" /></svg>
              Letras y Acordes
            </a>
            <a :href="song.sheetMusicUrl" target="_blank" class="btn btn-secondary">
              <!-- Music Note Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3z" /></svg>
              Partitura
            </a>
            <a :href="song.tracksUrl" target="_blank" class="btn btn-secondary">
              <!-- Zip Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-4V4zm2 2v2a1 1 0 001 1h2a1 1 0 001-1V6h2v2a1 1 0 001 1h2a1 1 0 001-1V6h-2V4H6zm-2 8v2a1 1 0 001 1h2a1 1 0 001-1v-2h2v2a1 1 0 001 1h2a1 1 0 001-1v-2h-2v-2H6v2H4z" clip-rule="evenodd" /></svg>
              Secuencias
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const sectionRef = ref(null);
const isVisible = ref(false);

const resources = ref([
  { id: 1, title: 'Gracia Sublime', artist: 'Adoradores del Rey', lyricsUrl: '#', sheetMusicUrl: '#', tracksUrl: '#' },
  { id: 2, title: 'En Tu Presencia', artist: 'Monte Santo', lyricsUrl: '#', sheetMusicUrl: '#', tracksUrl: '#' },
  { id: 3, title: 'Fuego consumidor', artist: 'La Barca Collective', lyricsUrl: '#', sheetMusicUrl: '#', tracksUrl: '#' },
]);

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});
</script>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center font-inter font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105;
}

.btn-primary {
  @apply bg-brand-camel text-brand-negro hover:bg-opacity-90;
}

.btn-secondary {
  @apply bg-transparent border-2 border-brand-camel text-brand-camel hover:bg-brand-camel hover:text-brand-negro;
}
</style>
