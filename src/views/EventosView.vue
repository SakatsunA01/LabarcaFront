<template>
  <div class="eventos-view bg-brand-gris-claro min-h-screen py-12 md:py-16 font-sans">
    <div class="container mx-auto px-6 max-w-5xl">

      <header class="mb-10 text-center space-y-2">
        <span class="text-brand-camel uppercase tracking-[0.4em] text-[9px] font-bold">Agenda Oficial</span>
        <h1 class="text-4xl md:text-5xl font-playfair text-brand-negro italic">Nuestros Eventos</h1>
      </header>

      <section class="mb-12 flex justify-center">
        <div class="inline-flex p-1.5 bg-white rounded-full shadow-card border border-gray-100">
          <button v-for="filtro in (['todos', 'proximos', 'pasados'] as const)" :key="filtro" :class="[
            'px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-500',
            filtroActivo === filtro ? 'bg-brand-camel text-white shadow-md' : 'text-gray-400 hover:text-brand-negro'
          ]" @click="setFiltroActivo(filtro)">
            {{ filtro === 'todos' ? 'Todos' : filtro === 'proximos' ? 'Próximos' : 'Pasados' }}
          </button>
        </div>
      </section>

      <transition name="fade" mode="out-in">
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="w-10 h-10 border-2 border-brand-camel border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="Object.keys(eventosAgrupados).length > 0" class="space-y-16">
          <div v-for="(eventosDelMes, mesAno, index) in eventosAgrupados" :key="mesAno">

            <div class="flex items-center gap-4 mb-6">
              <h2 class="text-3xl font-playfair text-brand-camel italic opacity-40">{{ mesAno }}</h2>
              <div class="h-[1px] flex-1 bg-brand-camel/10"></div>
            </div>

            <div class="space-y-8">
              <template v-for="(evento, eIdx) in eventosDelMes" :key="evento.id">

                <div v-if="index === 0 && eIdx === 0 && filtroActivo !== 'pasados'" class="mb-12">
                  <router-link :to="`/eventos/${evento.id}`"
                    class="group block relative w-full h-[400px] md:h-[520px] rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-700">

                    <img
                      :src="evento.imagenUrl ? `${API_BASE_URL}${evento.imagenUrl}` : 'https://placehold.co/1200x600'"
                      class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />

                    <div class="absolute inset-0 bg-gradient-to-t from-brand-negro via-brand-negro/20 to-transparent">
                    </div>

                    <div class="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-2xl">
                      <span
                        class="bg-brand-camel text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block shadow-lg">
                        Próximo Evento
                      </span>
                      <h3 class="text-4xl md:text-5xl font-playfair italic mb-4 leading-tight">
                        {{ evento.nombre }}
                      </h3>
                      <div
                        class="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold text-white/70">
                        <span class="flex items-center gap-2">
                          <CalendarDaysIcon class="w-4 h-4 text-brand-camel" /> {{ evento.fechaFormateada }}
                        </span>
                        <span v-if="evento.lugar" class="flex items-center gap-2">
                          <MapPinIcon class="w-4 h-4 text-brand-camel" /> {{ evento.lugar }}
                        </span>
                      </div>
                    </div>
                  </router-link>
                </div>

                <EventoCardHorizontal v-else :evento="evento"
                  class="transform transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1" />
              </template>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-20 bg-white rounded-3xl shadow-card border border-gray-50 max-w-2xl mx-auto">
          <CalendarDaysIcon class="w-12 h-12 mx-auto text-gray-200 mb-4" />
          <p class="text-xl font-playfair text-brand-negro italic">No hay eventos para mostrar</p>
          <p class="text-[9px] uppercase tracking-widest text-gray-400 mt-1">Vuelve pronto para nuevas fechas</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import EventoCardHorizontal from '@/components/EventoCardHorizontal.vue';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';
import { useUiStore } from '@/stores/uiStore';

// Interfaces y tipos se mantienen...
interface Evento {
  id: string | number;
  nombre: string;
  fecha: string;
  link_compra?: string | null;
  descripcion?: string | null;
  lugar?: string | null;
  imagenUrl?: string | null;
  fechaFormateada?: string;
}

const todosLosEventos = ref<Evento[]>([]);
const filtroActivo = ref<'todos' | 'proximos' | 'pasados'>('todos');
const isLoading = ref(true);
const uiStore = useUiStore();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('https://api.labarcaministerio.com/api/eventos');
    todosLosEventos.value = response.data;
  } catch (error) {
    console.error("Error al cargar eventos:", error);
  } finally {
    isLoading.value = false;
    uiStore.setRouteLoading(false);
  }
});

const setFiltroActivo = (filtro: 'todos' | 'proximos' | 'pasados') => {
  filtroActivo.value = filtro;
};

const eventosFiltrados = computed(() => {
  const ahora = new Date();
  const eventos = [...todosLosEventos.value];

  if (filtroActivo.value === 'proximos') {
    return eventos.filter(e => new Date(e.fecha.replace(/-/g, '/')) >= ahora);
  }
  if (filtroActivo.value === 'pasados') {
    return eventos.filter(e => new Date(e.fecha.replace(/-/g, '/')) < ahora);
  }
  return eventos;
});

const eventosAgrupados = computed(() => {
  const agrupados: Record<string, Evento[]> = {};
  const ahora = new Date();

  // Ordenar: Futuros (más cercano primero), Pasados (más reciente primero)
  const ordenados = [...eventosFiltrados.value].sort((a, b) => {
    const fA = new Date(a.fecha.replace(/-/g, '/')).getTime();
    const fB = new Date(b.fecha.replace(/-/g, '/')).getTime();

    if (filtroActivo.value === 'pasados') return fB - fA;
    if (filtroActivo.value === 'todos') {
      const aFuturo = fA >= ahora.getTime();
      const bFuturo = fB >= ahora.getTime();
      if (aFuturo && !bFuturo) return -1;
      if (!aFuturo && bFuturo) return 1;
      return aFuturo ? fA - fB : fB - fA;
    }
    return fA - fB;
  });

  ordenados.forEach(evento => {
    const fecha = new Date(evento.fecha.replace(/-/g, '/'));
    const mes = fecha.toLocaleString('es-ES', { month: 'long' });
    const ano = fecha.getFullYear();
    const clave = `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${ano}`;

    if (!agrupados[clave]) agrupados[clave] = [];
    agrupados[clave].push({
      ...evento,
      fechaFormateada: fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    });
  });
  return agrupados;
});
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
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>