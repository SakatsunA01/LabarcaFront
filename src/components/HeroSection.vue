<template>
  <section class="relative h-screen flex items-center justify-center text-white">
    <!-- Video de fondo y overlay -->
    <div class="absolute inset-0 overflow-hidden">
      <video
        ref="videoRef"
        autoplay
        loop
        playsinline
        class="w-full h-full object-cover"
        poster="#"
      >
        <source src="#" type="video/mp4" />
        Tu navegador no soporta videos.
      </video>
    </div>
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Contenido centrado -->
    <div class="relative z-10 text-center px-4">
      <h1
        class="text-4xl md:text-6xl font-bold text-white tracking-tight"
        style="font-family: 'Montserrat', sans-serif;"
      >
        Donde la Fe se Hace Canción.
      </h1>
      <p
        class="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200"
        style="font-family: 'Lato', sans-serif;"
      >
        Producimos eventos y música que inspiran, unen a la comunidad y te acercan a
        una experiencia de adoración auténtica.
      </p>

      <div class="mt-8 flex flex-col items-center gap-4 md:flex-row md:justify-center">
        <a
          href="/eventos"
          class="px-8 py-3 bg-[#D4AF37] text-black font-semibold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
        >
          Ver Próximos Eventos
        </a>
        <a
          href="/artistas"
          class="px-8 py-3 border border-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors"
        >
          Conoce a los Artistas
        </a>
      </div>

      <div class="mt-10 flex flex-col items-center gap-2 text-sm text-gray-200">
        <div class="flex items-center gap-3">
          <span class="text-xs uppercase tracking-[0.4em] text-brand-camel font-semibold">Volumen</span>
          <span class="text-xs font-medium">{{ volume }}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          class="w-64 accent-brand-camel"
          v-model.number="volume"
          @input="handleVolumeChange"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const DEFAULT_VOLUME = 30;
const videoRef = ref<HTMLVideoElement | null>(null);
const volume = ref<number>(DEFAULT_VOLUME);

const updateVideoVolume = () => {
  if (videoRef.value) {
    videoRef.value.volume = volume.value / 100;
    videoRef.value.muted = volume.value === 0;
  }
};

const handleVolumeChange = () => {
  updateVideoVolume();
};

watch(volume, () => {
  updateVideoVolume();
});

onMounted(() => {
  updateVideoVolume();
});
</script>

<style scoped>
h1 {
  text-shadow: 0px 2px 15px rgba(0, 0, 0, 0.5);
}
</style>
