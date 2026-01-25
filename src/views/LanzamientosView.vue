<template>
  <div class="lanzamientos-view bg-brand-gris-claro min-h-screen py-12 md:py-16">
    <div class="container mx-auto px-6 max-w-5xl">

      <header class="mb-10 text-center space-y-2">
        <span class="text-brand-camel uppercase tracking-[0.4em] text-[9px] font-bold">Discografía Completa</span>
        <h1 class="text-4xl md:text-5xl font-playfair text-brand-negro italic">Todos los Lanzamientos</h1>
      </header>

      <section class="mb-10 max-w-xl mx-auto">
        <div class="relative group">
          <input v-model="terminoBusqueda" type="text" placeholder="Buscar lanzamiento por título o artista..."
            class="w-full px-6 py-3 bg-white rounded-full shadow-card border border-gray-100 focus:ring-1 focus:ring-brand-camel outline-none transition-all placeholder:text-gray-300 font-sans text-sm" />
          <div
            class="absolute right-5 top-1/2 -translate-y-1/2 text-brand-camel opacity-30 group-focus-within:opacity-100 transition-opacity">
            <MagnifyingGlassIcon class="w-4 h-4" />
          </div>
        </div>
      </section>

      <transition name="fade" mode="out-in">
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-10">
          <div class="w-10 h-10 border-2 border-brand-camel border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="lanzamientosFiltrados.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="lanzamiento in lanzamientosFiltrados" :key="lanzamiento.id"
            class="group bg-white rounded-2xl shadow-card overflow-hidden flex flex-col transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1 border border-gray-100">
            <router-link :to="`/lanzamientos/${lanzamiento.id}`" class="block relative aspect-square overflow-hidden">
              <img
                :src="lanzamiento.cover_image_url ? `${API_BASE_URL}${lanzamiento.cover_image_url}` : `https://placehold.co/600x600/F5EFE6/171C1E?text=${encodeURIComponent(lanzamiento.titulo.substring(0, 1))}`"
                :alt="`Portada de ${lanzamiento.titulo}`"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div
                class="absolute inset-0 bg-brand-negro/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <div
                  class="w-14 h-14 bg-brand-camel text-white rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                  <PlayIcon class="h-7 w-7 fill-current ml-1" />
                </div>
              </div>
            </router-link>

            <div class="p-6 flex flex-col flex-grow text-left">
              <h3
                class="font-playfair text-xl md:text-2xl text-brand-negro mb-1 leading-tight group-hover:text-brand-camel transition-colors">
                {{ lanzamiento.titulo }}
              </h3>
              <p class="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-brand-camel mb-4">
                {{ lanzamiento.artista.name }}
              </p>

              <div class="mt-auto pt-4 border-t border-gray-50">
                <p class="text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                  Lanzado el <span class="text-gray-600">{{ formatDate(lanzamiento.fecha_lanzamiento) }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-16 bg-white rounded-3xl shadow-card border border-gray-50 max-w-2xl mx-auto">
          <p class="text-lg font-playfair text-brand-negro italic">No se encontraron lanzamientos</p>
          <p class="text-[9px] uppercase tracking-widest text-gray-400 mt-1">Intenta con otro término</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { PlayIcon } from '@heroicons/vue/24/solid';

interface Lanzamiento {
  id: number;
  titulo: string;
  fecha_lanzamiento: string;
  cover_image_url?: string | null;
  artista: { name: string };
}

const todosLosLanzamientos = ref<Lanzamiento[]>([]);
const terminoBusqueda = ref('');
const isLoading = ref(true);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_BASE_URL}/api/lanzamientos`);
    todosLosLanzamientos.value = response.data.sort((a: any, b: any) =>
      new Date(b.fecha_lanzamiento).getTime() - new Date(a.fecha_lanzamiento).getTime()
    );
  } catch (error) {
    console.error('Error:', error);
  } finally {
    isLoading.value = false;
  }
});

const lanzamientosFiltrados = computed(() => {
  if (!terminoBusqueda.value) return todosLosLanzamientos.value;
  const s = terminoBusqueda.value.toLowerCase();
  return todosLosLanzamientos.value.filter(l =>
    l.titulo.toLowerCase().includes(s) || l.artista.name.toLowerCase().includes(s)
  );
});

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.05);
}

.shadow-card-hover {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.07);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>