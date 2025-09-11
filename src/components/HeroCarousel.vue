<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import apiClient from '@/services/api'; // Use apiClient

interface HeroSlide {
  id: number;
  title: string;
  video_path: string;
  button_text: string;
  button_url: string;
  order: number;
  is_active: boolean;
}

// --- State Management ---
const currentSlide = ref(0);
let intervalId: number | undefined = undefined;
const slides = ref<HeroSlide[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// --- Carousel Logic ---
const nextSlide = () => {
  if (slides.value.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length;
  }
};

const prevSlide = () => {
  if (slides.value.length > 0) {
    currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
  }
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const startAutoplay = () => {
  stopAutoplay(); // Clear any existing interval
  if (slides.value.length > 1) { // Only autoplay if there's more than one slide
    intervalId = window.setInterval(nextSlide, 7000); // Change slide every 7 seconds
  }
};

const stopAutoplay = () => {
  clearInterval(intervalId);
};

// --- Lifecycle Hooks ---
onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.get(`/hero-slides`); // Use apiClient
    // Filter for active slides and sort by order
    slides.value = response.data
      .filter((slide: HeroSlide) => slide.is_active)
      .sort((a: HeroSlide, b: HeroSlide) => a.order - b.order);
    
    console.log('Slides cargados y filtrados:', slides.value); // Debugging line

    if (slides.value.length > 0) {
      startAutoplay();
    }
  } catch (err) {
    console.error('Error al cargar slides del carrusel:', err);
    error.value = 'No se pudieron cargar los slides del carrusel.';
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<template>
  <div class="relative h-screen w-full overflow-hidden group" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
    <div v-if="isLoading" class="flex items-center justify-center h-full bg-brand-negro text-white">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      <p class="ml-4">Cargando carrusel...</p>
    </div>
    <div v-else-if="error" class="flex items-center justify-center h-full bg-red-800 text-white">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="slides.length > 0" class="w-full h-full">
      <transition-group name="fade" tag="div" class="relative w-full h-full">
        <div
v-for="(slide, index) in slides" v-show="currentSlide === index" :key="slide.id"
          class="absolute w-full h-full">
          <!-- Background Video -->
          <video
:src="slide.video_path" class="absolute top-0 left-0 w-full h-full object-cover" autoplay loop muted
            playsinline></video>
          <!-- Overlay -->
          <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>

          <!-- Text Content -->
          <div class="relative z-10 flex flex-col items-start justify-end w-full h-full text-white text-left p-8 md:p-12 lg:p-16">
            <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
              {{ slide.title }}
            </h1>
            <a
:href="slide.button_url"
              class="border-2 border-white text-white font-bold py-3 px-8 rounded-full uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300">
              {{ slide.button_text }}
            </a>
          </div>
        </div>
      </transition-group>
    </div>
    <div v-else class="flex items-center justify-center h-full bg-brand-negro text-white">
      <p>No hay slides activos para mostrar.</p>
    </div>

    <!-- Navigation Arrows -->
    <button
v-if="slides.length > 1" class="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 text-white text-4xl opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity duration-300"
      @click="prevSlide">
      &#10094;
    </button>
    <button
v-if="slides.length > 1" class="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 text-white text-4xl opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity duration-300"
      @click="nextSlide">
      &#10095;
    </button>

    <!-- Navigation Dots -->
    <div v-if="slides.length > 1" class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
      <button
v-for="(_, index) in slides" :key="`dot-${index}`" :class="[
        'w-3 h-3 rounded-full transition-all duration-300',
        currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
      ]" @click="goToSlide(index)"></button>
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
