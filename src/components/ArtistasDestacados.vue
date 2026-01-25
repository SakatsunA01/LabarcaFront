<template>
  <AnimatedSection>
    <section class="py-12 md:py-16 px-6 bg-transparent overflow-hidden font-sans">
      <div class="container mx-auto max-w-7xl">

        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-black/5 pb-6">
          <div class="space-y-1">
            <span class="text-brand-camel uppercase tracking-[0.4em] text-[9px] font-bold block font-sans">
              Talento que Inspira
            </span>
            <h2 class="font-playfair text-4xl md:text-5xl text-brand-negro italic">
              Nuestros Artistas
            </h2>
          </div>

          <router-link to="/artistas"
            class="group mt-6 md:mt-0 flex items-center gap-2 text-brand-camel font-bold uppercase text-[9px] tracking-widest hover:text-brand-negro transition-colors font-sans">
            Ver toda la galería
            <ArrowRightIcon class="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="w-10 h-10 border-2 border-brand-camel border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="artistas.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">

          <div v-for="artista in artistas" :key="artista.id"
            class="group relative aspect-square overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 bg-white border border-gray-100">

            <img :src="artista.imageUrl ? `${API_BASE_URL}${artista.imageUrl}` : `https://placehold.co/600x600`"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              :alt="artista.name" />

            <div
              class="absolute inset-0 bg-gradient-to-t from-brand-negro/80 via-brand-negro/10 to-transparent opacity-60 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>

            <div
              class="absolute bottom-0 left-0 p-5 w-full transform translate-y-2 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 class="font-playfair text-lg md:text-xl text-white italic leading-tight">
                {{ artista.name }}
              </h3>
              <div
                class="w-8 h-[1px] bg-brand-camel mt-2 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500">
              </div>
            </div>

            <router-link :to="`/artistas/${artista.id}`" class="absolute inset-0"></router-link>
          </div>
        </div>

        <div v-else
          class="text-center py-20 bg-white rounded-3xl shadow-card border border-gray-50 max-w-2xl mx-auto font-playfair italic text-gray-400">
          No hay artistas disponibles en este momento.
        </div>
      </div>
    </section>
  </AnimatedSection>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import AnimatedSection from '@/components/AnimatedSection.vue';

interface Artista {
  id: string | number;
  name: string;
  imageUrl?: string | null;
}

const artistas = ref<Artista[]>([]);
const isLoading = ref(true);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('https://api.labarcaministerio.com/api/artistas');

    // ORDEN ALFABÉTICO ESTRICTO (A-Z)
    const ordenados = response.data.sort((a: Artista, b: Artista) =>
      a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    // Tomamos los primeros 8 para que el grid sea simétrico (4x2)
    artistas.value = ordenados.slice(0, 8);
  } catch (error) {
    console.error("Error:", error);
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
