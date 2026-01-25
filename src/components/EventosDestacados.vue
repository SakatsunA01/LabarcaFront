<template>
  <AnimatedSection>
    <section class="py-10 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div class="container mx-auto max-w-7xl">

        <div
          class="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-black/5 dark:border-white/10 pb-6 gap-4">
          <div>
            <span class="text-brand-camel uppercase tracking-[0.4em] text-[10px] font-bold mb-2 block">Calendario
              Oficial</span>
            <h2 class="font-playfair text-4xl md:text-5xl text-brand-negro dark:text-white leading-tight">
              Nuestros Eventos
            </h2>
          </div>
          <router-link to="/eventos"
            class="group flex items-center gap-2 text-brand-camel font-bold uppercase text-[10px] tracking-widest hover:text-brand-negro dark:hover:text-white transition-colors">
            Ver agenda completa
            <ArrowRightIcon class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="w-12 h-12 border-2 border-brand-camel border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-[10px] uppercase tracking-widest text-gray-400">Cargando eventos destacados</p>
        </div>

        <div v-else-if="error" class="text-center py-10 text-red-500">
          <ExclamationCircleIcon class="h-12 w-12 mx-auto text-red-400 mb-4" />
          <p class="font-playfair italic">{{ error }}</p>
        </div>

        <div v-else-if="eventosDestacados.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[600px]">

          <div v-if="eventosDestacados[0]"
            class="lg:col-span-8 h-full rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 relative group cursor-pointer border border-gray-100 dark:border-white/5">
            <img
              :src="eventosDestacados[0].imagenUrl ? `${API_BASE_URL}${eventosDestacados[0].imagenUrl}` : 'https://placehold.co/800x600'"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

            <div class="absolute top-6 left-6 z-20">
              <span
                class="bg-white/90 backdrop-blur text-brand-negro text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-sm">
                {{ eventosDestacados[0].tipo }}
              </span>
            </div>

            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-12">
              <div class="max-w-xl animate-fade-in">
                <h3 class="font-playfair text-3xl md:text-5xl text-white mb-6 leading-tight">{{
                  eventosDestacados[0].nombre }}</h3>

                <div
                  class="flex flex-wrap items-center gap-6 text-white/80 text-[10px] font-bold uppercase tracking-widest mb-8">
                  <div class="flex items-center gap-2">
                    <CalendarDaysIcon class="h-4 w-4 text-brand-camel" />
                    {{ eventosDestacados[0].fechaFormateada.split(' - ')[0] }}
                  </div>
                  <div v-if="eventosDestacados[0].lugar" class="flex items-center gap-2">
                    <MapPinIcon class="h-4 w-4 text-brand-camel" />
                    {{ eventosDestacados[0].lugar }}
                  </div>
                </div>

                <router-link :to="`/eventos/${eventosDestacados[0].id}`"
                  class="inline-flex items-center bg-brand-camel hover:bg-white hover:text-brand-negro text-white py-4 px-10 rounded-full transition-all duration-500 text-[10px] font-bold uppercase tracking-[0.3em] shadow-lg active:scale-95">
                  Más Información
                  <ArrowRightIcon class="h-3 w-3 ml-3" />
                </router-link>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 flex flex-col gap-6">
            <div v-for="(evento, idx) in eventosDestacados.slice(1, 3)" :key="evento.id"
              class="flex-1 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 relative group border border-gray-100 dark:border-white/5">
              <img :src="evento.imagenUrl ? `${API_BASE_URL}${evento.imagenUrl}` : 'https://placehold.co/400x300'"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

              <div
                class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                <span class="text-brand-camel text-[8px] font-black uppercase tracking-[0.3em] mb-2">{{ evento.tipo
                  }}</span>
                <h4
                  class="font-playfair text-xl text-white mb-4 line-clamp-2 leading-tight group-hover:text-brand-camel transition-colors">
                  {{ evento.nombre }}</h4>

                <router-link :to="`/eventos/${evento.id}`"
                  class="text-white/70 hover:text-white text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                  Detalles
                  <ArrowRightIcon class="h-3 w-3" />
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div v-else
          class="text-center py-24 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-black/10 dark:border-white/10">
          <CalendarDaysIcon class="h-10 w-10 mx-auto text-brand-camel mb-4 opacity-40" />
          <p class="text-xl font-playfair text-brand-negro dark:text-white italic">Estamos preparando nuevos encuentros.
          </p>
          <p class="text-[9px] text-gray-400 mt-2 uppercase tracking-[0.4em] font-bold">Vuelve a visitarnos pronto</p>
        </div>

      </div>
    </section>
  </AnimatedSection>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { CalendarDaysIcon, ArrowRightIcon, MapPinIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline';
import AnimatedSection from '@/components/AnimatedSection.vue';

interface Evento {
  id: number;
  nombre: string;
  fecha: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  lugar?: string;
  link_compra?: string;
  fechaFormateada?: string;
  tipo?: string;
}

export default defineComponent({
  name: 'EventosDestacados',
  components: {
    CalendarDaysIcon,
    ArrowRightIcon,
    AnimatedSection,
    MapPinIcon,
    ExclamationCircleIcon,
  },
  setup() {
    const todosLosEventos = ref<Evento[]>([]);
    const isLoading = ref(true);
    const error = ref<string | null>(null);
    const API_URL = 'https://api.labarcaministerio.com/api';
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const getTipoEvento = (nombre: string): string => {
      const lowerCaseName = nombre.toLowerCase();
      if (lowerCaseName.includes('workshop') || lowerCaseName.includes('taller')) return 'Taller';
      if (lowerCaseName.includes('concierto')) return 'Concierto';
      if (lowerCaseName.includes('conferencia')) return 'Conferencia';
      if (lowerCaseName.includes('gira')) return 'Gira';
      return 'Evento';
    };

    onMounted(async () => {
      isLoading.value = true;
      error.value = null;
      try {
        const response = await axios.get(`${API_URL}/eventos`);
        todosLosEventos.value = response.data.map((evento: Evento) => ({
          ...evento,
          tipo: getTipoEvento(evento.nombre),
        }));
      } catch (err) {
        console.error("Error al cargar eventos:", err);
        error.value = "No se pudieron cargar los eventos.";
      } finally {
        isLoading.value = false;
      }
    });

    const formatearFecha = (fechaStr: string): string => {
      const fechaObj = new Date(fechaStr.replace(/-/g, '/'));
      return fechaObj.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) +
        ' - ' + fechaObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const eventosDestacados = computed(() => {
      // First, filter for upcoming events
      const ahora = new Date();
      const proximos = todosLosEventos.value.filter(evento => new Date(evento.fecha.replace(/-/g, '/')) >= ahora);

      // Sort upcoming events by soonest first
      proximos.sort((a, b) => new Date(a.fecha.replace(/-/g, '/')).getTime() - new Date(b.fecha.replace(/-/g, '/')).getTime());

      // If there are not enough upcoming events, fill with past events (newest first)
      if (proximos.length < 3) {
        const pasados = todosLosEventos.value.filter(evento => new Date(evento.fecha.replace(/-/g, '/')) < ahora);
        pasados.sort((a, b) => new Date(b.fecha.replace(/-/g, '/')).getTime() - new Date(a.fecha.replace(/-/g, '/')).getTime());
        const needed = 3 - proximos.length;
        proximos.push(...pasados.slice(0, needed));
      }

      return proximos.slice(0, 3).map(evento => ({ ...evento, fechaFormateada: formatearFecha(evento.fecha) }));
    });

    return {
      eventosDestacados,
      isLoading,
      error,
      API_BASE_URL,
    };
  },
});
</script>
