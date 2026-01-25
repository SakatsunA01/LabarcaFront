<template>
  <AnimatedSection>
    <section class="py-12 md:py-12 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden">
      <div class="container mx-auto max-w-7xl">

        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-black/5 pb-6">
          <div class="space-y-1">
            <span class="text-brand-camel uppercase tracking-[0.4em] text-[9px] font-bold block font-sans">
              Discografía Exclusiva
            </span>
            <h2 class="font-playfair text-4xl md:text-5xl text-brand-negro italic">
              Nuestra Música <span class="text-brand-camel">&</span> Arte
            </h2>
            <p class="font-sans text-gray-500 text-sm tracking-wide italic">
              El sonido que nace de corazones rendidos.
            </p>
          </div>

          <router-link to="/lanzamientos"
            class="group mt-6 md:mt-0 flex items-center gap-2 text-brand-camel font-bold uppercase text-[9px] tracking-widest hover:text-brand-negro transition-colors font-sans">
            Explorar catálogo completo
            <ArrowRightIcon class="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>

        <div v-if="isLoading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-camel mb-4">
          </div>
          <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Sincronizando lanzamientos</p>
        </div>

        <div v-else-if="lanzamientos.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div class="md:col-span-2">
              <router-link :to="`/lanzamientos/${lanzamientos[0].id}`"
                class="group block relative h-[400px] md:h-full rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500 bg-white border border-gray-100">
                <img
                  :src="lanzamientos[0].cover_image_url ? `${API_BASE_URL}${lanzamientos[0].cover_image_url}` : `https://placehold.co/800x800`"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-brand-negro/80 via-brand-negro/20 to-transparent">
                </div>

                <div class="absolute bottom-0 left-0 p-8 text-white">
                  <span
                    class="bg-brand-camel text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded mb-3 inline-block">Último
                    Lanzamiento</span>
                  <h3 class="font-playfair text-3xl md:text-4xl italic mb-2">{{ lanzamientos[0].titulo }}</h3>
                  <p class="font-sans text-xs uppercase tracking-widest text-white/70">{{ lanzamientos[0].artista.name
                    }}</p>
                </div>

                <div
                  class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    class="w-16 h-16 bg-brand-camel rounded-full flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform">
                    <PlayIcon class="h-8 w-8 text-white ml-1" />
                  </div>
                </div>
              </router-link>
            </div>

            <div class="space-y-8 flex flex-col justify-between">
              <router-link v-for="lanzamiento in lanzamientos.slice(1, 3)" :key="lanzamiento.id"
                :to="`/lanzamientos/${lanzamiento.id}`"
                class="group block bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500 border border-gray-100 overflow-hidden flex-1">
                <div class="h-48 overflow-hidden relative">
                  <img
                    :src="lanzamiento.cover_image_url ? `${API_BASE_URL}${lanzamiento.cover_image_url}` : `https://placehold.co/400x400`"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div
                    class="absolute inset-0 bg-brand-negro/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayIcon class="h-10 w-10 text-white" />
                  </div>
                </div>
                <div class="p-5">
                  <h3
                    class="font-playfair text-xl text-brand-negro mb-1 line-clamp-1 group-hover:text-brand-camel transition-colors">
                    {{ lanzamiento.titulo }}</h3>
                  <p class="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-camel">{{
                    lanzamiento.artista.name }}</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-20 bg-white rounded-3xl shadow-card border border-gray-50 max-w-2xl mx-auto">
          <MusicalNoteIcon class="h-12 w-12 mx-auto text-gray-200 mb-4" />
          <p class="text-xl font-playfair text-brand-negro italic">La barca se prepara para nuevos sonidos.</p>
          <p class="text-[9px] uppercase tracking-widest text-gray-400 mt-1">Próximamente más música</p>
        </div>
      </div>
    </section>
  </AnimatedSection>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { PlayIcon } from '@heroicons/vue/24/solid';
import { ArrowRightIcon, MusicalNoteIcon, CalendarIcon } from '@heroicons/vue/24/outline';
import AnimatedSection from '@/components/AnimatedSection.vue';

interface Lanzamiento {
  id: number;
  titulo: string;
  artista_id: number;
  fecha_lanzamiento: string;
  cover_image_url?: string | null;
  artista: {
    id: number;
    name: string;
  };
}

const lanzamientos = ref<Lanzamiento[]>([]);
const isLoading = ref(true);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api`;

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/lanzamientos/latest`);
    lanzamientos.value = response.data;
  } catch (error) {
    console.error('Error al cargar lanzamientos:', error);
    lanzamientos.value = [];
  } finally {
    isLoading.value = false;
  }
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
