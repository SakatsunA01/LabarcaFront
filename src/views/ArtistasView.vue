<template>
  <div class="artistas-view bg-brand-gris-claro min-h-screen py-12 md:py-16">
    <div class="container mx-auto px-6 max-w-5xl">

      <header class="mb-10 text-center space-y-2">
        <span class="text-brand-camel uppercase tracking-[0.4em] text-[9px] font-bold">Talento que Inspira</span>
        <h1 class="text-4xl md:text-5xl font-playfair text-brand-negro italic">Nuestros Artistas</h1>
      </header>

      <section class="mb-10 max-w-xl mx-auto">
        <div class="relative group">
          <input v-model="terminoBusqueda" type="text" placeholder="Buscar artista por nombre..."
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

        <div v-else-if="Object.keys(artistasAgrupados).length > 0" class="space-y-12">
          <div v-for="(artistasPorLetra, letra) in artistasAgrupados" :key="letra">

            <div class="flex items-center gap-4 mb-4">
              <h2 class="text-3xl font-playfair text-brand-camel italic opacity-40">{{ letra }}</h2>
              <div class="h-[1px] flex-1 bg-brand-camel/10"></div>
            </div>

            <div class="space-y-6">
              <ArtistaCardHorizontal v-for="artista in artistasPorLetra" :key="artista.id" :artista="artista" />
            </div>
          </div>
        </div>

        <div v-else class="text-center py-16 bg-white rounded-3xl shadow-card border border-gray-50 max-w-2xl mx-auto">
          <p class="text-lg font-playfair text-brand-negro italic">No se encontraron artistas</p>
          <p class="text-[9px] uppercase tracking-widest text-gray-400 mt-1">Refina tu búsqueda</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ArtistaCardHorizontal from '@/components/ArtistaCardHorizontal.vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';
import { useUiStore } from '@/stores/uiStore';

const letraActiva = ref('');
const scrollProgress = ref(0);
const isLoading = ref(true);
const todosLosArtistas = ref<any[]>([]);
const terminoBusqueda = ref('');
const uiStore = useUiStore();

// Calibración precisa del scroll
const handleScroll = () => {
  const sections = document.querySelectorAll('.letra-section');
  const scrollPosition = window.scrollY + (window.innerHeight / 3); // Detección anticipada

  sections.forEach((section) => {
    const sectionTop = (section as HTMLElement).offsetTop;
    if (scrollPosition >= sectionTop) {
      letraActiva.value = section.id.replace('letra-', '');
    }
  });

  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgress.value = (winScroll / height) * 100;
};

const irALetra = (letra: string) => {
  const el = document.getElementById(`letra-${letra}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  isLoading.value = true;
  try {
    const response = await axios.get('https://api.labarcaministerio.com/api/artistas');
    todosLosArtistas.value = response.data;
    // Inicializar la primera letra como activa
    if (todosLosArtistas.value.length > 0) {
      const primeraLetra = todosLosArtistas.value[0].name.charAt(0).toUpperCase();
      letraActiva.value = primeraLetra;
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
    uiStore.setRouteLoading(false);
  }
});

onUnmounted(() => window.removeEventListener('scroll', handleScroll));

// Agrupación y filtrado (se mantienen según tu lógica anterior)
const artistasFiltrados = computed(() => {
  if (!terminoBusqueda.value) return todosLosArtistas.value;
  return todosLosArtistas.value.filter(a => a.name.toLowerCase().includes(terminoBusqueda.value.toLowerCase()));
});

const artistasAgrupados = computed(() => {
  const agrupados: any = {};
  const ordenados = [...artistasFiltrados.value].sort((a, b) => a.name.localeCompare(b.name));
  ordenados.forEach(a => {
    const letra = a.name.charAt(0).toUpperCase();
    if (!agrupados[letra]) agrupados[letra] = [];
    agrupados[letra].push(a);
  });
  return agrupados;
});

const todasLasLetras = computed(() => Object.keys(artistasAgrupados.value));
</script>