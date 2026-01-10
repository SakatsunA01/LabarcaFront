<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, type VNodeRef } from 'vue';
import axios from 'axios';
import {
  PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon,
  ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/vue/24/outline';

// --- (Interfaces y Lógica de script se mantienen igual que la versión anterior) ---
interface HeroSlide {
  id: number;
  title: string;
  video_path: string;
  button_text: string;
  button_url: string;
  order: number;
  is_active: boolean;
}

const currentSlide = ref(0);
let intervalId: number | undefined = undefined;
const slides = ref<HeroSlide[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const isPaused = ref(false);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api`;

const videoElement = ref<HTMLVideoElement | null>(null);
const volume = ref<number>(30);
const hasInteractedWithVolume = ref(false);
const carouselRef = ref<HTMLElement | null>(null);

const isMuted = computed(() => volume.value === 0 || !hasInteractedWithVolume.value);

const applyVolume = () => {
  if (!videoElement.value) return;
  videoElement.value.volume = volume.value / 100;
  videoElement.value.muted = isMuted.value;
};

const pauseNonCurrentVideos = (keep?: HTMLVideoElement | null) => {
  if (!carouselRef.value) return;
  carouselRef.value.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
    if (video !== keep) {
      video.pause();
    }
  });
};

const playCurrentVideo = () => {
  if (isPaused.value || !videoElement.value) return;
  videoElement.value.play().catch(() => {});
};

const setCurrentVideoRef = (index: number): VNodeRef => {
  return (el) => {
    if (index !== currentSlide.value || !el || !(el instanceof HTMLVideoElement)) return;
    videoElement.value = el;
    applyVolume();
    pauseNonCurrentVideos(el);
    if (!isPaused.value) {
      playCurrentVideo();
    }
  };
};

const handleVolumeChange = () => {
  hasInteractedWithVolume.value = true;
  applyVolume();
};

const toggleMute = () => {
  hasInteractedWithVolume.value = true;
  volume.value = volume.value === 0 ? 30 : 0;
  applyVolume();
};

const nextSlide = () => {
  if (slides.value.length === 0) return;
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  if (slides.value.length === 0) return;
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

const startAutoplay = () => {
  stopAutoplay();
  if (slides.value.length > 1 && !isPaused.value) {
    intervalId = window.setInterval(nextSlide, 8000);
  }
};

const stopAutoplay = () => clearInterval(intervalId);

const togglePause = () => {
  isPaused.value = !isPaused.value;
  if (isPaused.value) {
    stopAutoplay();
    videoElement.value?.pause();
  } else {
    playCurrentVideo();
    startAutoplay();
  }
};

onMounted(async () => {
  try {
    const { data } = await axios.get(`${API_URL}/hero-slides`);
    slides.value = data
      .filter((s: HeroSlide) => s.is_active)
      .sort((a: HeroSlide, b: HeroSlide) => a.order - b.order);
    if (slides.value.length > 0) startAutoplay();
  } catch (err) {
    error.value = 'Error de conexión.';
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(stopAutoplay);
</script>

<template>
  <section
    ref="carouselRef"
    class="relative h-screen w-full overflow-hidden bg-brand-carbon"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <div v-if="isLoading" class="flex items-center justify-center h-full bg-brand-carbon">
      <div class="w-10 h-10 border-2 border-brand-camel border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="slides.length > 0" class="w-full h-full">
      <transition-group name="hero-fade">
        <div v-for="(slide, index) in slides" v-show="currentSlide === index" :key="slide.id" class="absolute inset-0">
          <video :ref="setCurrentVideoRef(index)" :src="`${API_BASE_URL}${slide.video_path}`"
            class="absolute inset-0 w-full h-full object-cover" loop playsinline muted></video>

          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-brand-carbon/80 via-transparent to-transparent"></div>

          <div class="relative z-10 container mx-auto h-full flex items-center px-8 lg:px-16">
            <div class="max-w-2xl mt-12">
              <transition name="text-slide" appear>
                <div v-if="currentSlide === index" class="space-y-6">
                  <h1 class="text-6xl md:text-8xl font-playfair text-white leading-[1.1]">
                    {{ slide.title }}
                  </h1>
                  <p class="text-brand-cream/60 text-lg uppercase tracking-[0.2em] font-sans">Artista Exclusivo</p>
                  <div class="pt-4">
                    <a :href="slide.button_url"
                      class="inline-block bg-brand-camel hover:bg-white hover:text-brand-negro text-white font-bold py-4 px-12 rounded-full uppercase text-[10px] tracking-[0.3em] transition-all duration-500 shadow-xl">
                      {{ slide.button_text }}
                    </a>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <div class="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-8 lg:p-12">

      <div></div>

      <div class="flex items-end justify-between pointer-events-auto">

        <div class="flex items-center gap-4">
          <div v-for="(_, index) in slides" :key="index" @click="currentSlide = index"
            class="group cursor-pointer flex flex-col items-center gap-2">
            <div class="w-[2px] transition-all duration-700 rounded-full"
              :class="currentSlide === index ? 'h-10 bg-brand-camel' : 'h-4 bg-white/20 group-hover:bg-white/50'">
            </div>
          </div>
          <button @click="togglePause" class="ml-4 text-white/30 hover:text-white transition-colors">
            <component :is="isPaused ? PlayIcon : PauseIcon" class="w-4 h-4" />
          </button>
        </div>

        <div class="flex gap-4">
          <button @click="prevSlide"
            class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-brand-negro transition-all duration-300">
            <ChevronLeftIcon class="w-5 h-5" />
          </button>
          <button @click="nextSlide"
            class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-brand-negro transition-all duration-300">
            <ChevronRightIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="flex items-center gap-6 pointer-events-auto">
          <div class="hidden md:flex flex-col items-end gap-1.5">
            <span class="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold font-sans">
              Audio Control
            </span>
            <div class="group relative w-28 h-[2px] bg-white/10 rounded-full overflow-hidden transition-all hover:h-[4px]">
              <div 
                class="absolute inset-y-0 left-0 bg-brand-camel transition-all duration-300" 
                :style="{ width: volume + '%' }"
              ></div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                v-model.number="volume"
                @input="handleVolumeChange"
                class="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>

          <button 
            @click="toggleMute" 
            class="bg-white/5 backdrop-blur-md p-3 rounded-full text-white border border-white/10 hover:bg-brand-camel hover:border-brand-camel transition-all duration-500"
            title="Silenciar/Activar Audio"
          >
            <component 
              :is="isMuted ? SpeakerXMarkIcon : SpeakerWaveIcon" 
              class="w-5 h-5 shadow-sm" 
            />
          </button>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 1.5s ease-in-out;
}

.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}

.text-slide-enter-active {
  transition: all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.4s;
}

.text-slide-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

/* Estilo para los inputs range */
/* Reseteo para el input range en navegadores */
input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}

input[type=range]::-webkit-slider-thumb {
  appearance: none;
}

input[type=range]:focus {
  outline: none;
}

/* Mejora la interacción táctil en móviles */
button {
  -webkit-tap-highlight-color: transparent;
}

/* El brand-camel debe coincidir con tu config de Tailwind (#A18059) */
.bg-brand-camel {
  background-color: #A18059;
}
</style>
