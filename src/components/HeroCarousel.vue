<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// --- State Management ---
const currentSlide = ref(0);
let intervalId: number | undefined = undefined;

// --- Slide Content ---
// Note: Vite handles asset imports like this to get the correct public path.
const slides = [
  {
    videoUrl: new URL('../assets/videos/enzo.MP4', import.meta.url).href,
    title: "Noche de Comunidad",
    subtitle: "Únete a nosotros para una experiencia de adoración inolvidable. 28 de Septiembre - Buenos Aires.",
    ctaText: "Conseguir Entradas",
    ctaLink: "/eventos/noche-de-comunidad"
  },
  {
    videoUrl: new URL('../assets/videos/tomi.MP4', import.meta.url).href,
    title: "Conoce a Tomás",
    subtitle: "Descubre la historia y la música detrás de su ministerio.",
    ctaText: "Ver su Perfil",
    ctaLink: "/artistas/tomas"
  },
  {
    videoUrl: new URL('../assets/videos/enzo.MP4', import.meta.url).href, // Re-using video for example
    title: "Nuevo Sencillo: 'Tu Paz'",
    subtitle: "Ya disponible en todas las plataformas digitales.",
    ctaText: "Escuchar Ahora",
    ctaLink: "/musica/tu-paz"
  }
];

// --- Carousel Logic ---
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const startAutoplay = () => {
  intervalId = window.setInterval(nextSlide, 7000); // Change slide every 7 seconds
};

const stopAutoplay = () => {
  clearInterval(intervalId);
};

// --- Lifecycle Hooks ---
onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<template>
  <div class="relative h-screen w-full overflow-hidden group" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
    <!-- Slides Container -->
    <div class="w-full h-full">
      <transition-group name="fade" tag="div" class="relative w-full h-full">
        <div v-for="(slide, index) in slides" :key="index" v-show="currentSlide === index"
          class="absolute w-full h-full">
          <!-- Background Video -->
          <video :src="slide.videoUrl" class="absolute top-0 left-0 w-full h-full object-cover" autoplay loop muted
            playsinline></video>
          <!-- Overlay -->
          <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>

          <!-- Text Content -->
          <div class="relative z-10 flex flex-col items-start justify-end w-full h-full text-white text-left p-8 md:p-12 lg:p-16">
            <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
              {{ slide.title }}
            </h1>
            <a :href="slide.ctaLink"
              class="border-2 border-white text-white font-bold py-3 px-8 rounded-full uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300">
              {{ slide.ctaText }}
            </a>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Navigation Arrows -->
    <button @click="prevSlide"
      class="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 text-white text-4xl opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity duration-300">
      &#10094;
    </button>
    <button @click="nextSlide"
      class="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 text-white text-4xl opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity duration-300">
      &#10095;
    </button>

    <!-- Navigation Dots -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
      <button v-for="(_, index) in slides" :key="`dot-${index}`" @click="goToSlide(index)" :class="[
        'w-3 h-3 rounded-full transition-all duration-300',
        currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
      ]"></button>
    </div>
  </div>
</template>

<style scoped>
/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
