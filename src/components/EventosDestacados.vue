<template>
  <AnimatedSection>
    <section class="py-section-md px-2 sm:px-4 lg:px-6 bg-white">
      <div class="container mx-auto max-w-7xl">
        <h2 class="font-playfair text-3xl md:text-4xl font-bold text-brand-negro text-center mb-10 md:mb-12 relative">
          Nuestros Eventos
        </h2>
        <div v-if="isLoading" class="text-center py-10">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-camel"></div>
          <p class="mt-4 text-brand-negro">Cargando eventos...</p>
        </div>
        <div v-else-if="error" class="text-center py-10 text-red-500">
          <ExclamationCircleIcon class="h-12 w-12 mx-auto text-red-400 mb-4" />
          <p>{{ error }}</p>
        </div>
        <div v-else-if="eventosDestacados.length > 0"
          class="grid grid-cols-1 lg:grid-cols-5 lg:grid-rows-5 gap-4 lg:h-[550px]">

          <!-- Evento Principal -->
          <div v-if="eventosDestacados[0]"
            class="lg:col-span-3 lg:row-span-5 rounded-lg overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 relative min-h-[400px] lg:min-h-0 group">
            <img
              :src="eventosDestacados[0].imagenUrl ? `${API_BASE_URL}${eventosDestacados[0].imagenUrl}` : 'https://placehold.co/800x600/3498DB/FFFFFF?text=Evento'"
              :alt="eventosDestacados[0].nombre" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <span v-if="eventosDestacados[0].tipo"
              class="absolute top-4 left-4 bg-brand-verde-oscuro text-white text-xs font-semibold px-3 py-1 rounded-full z-10 backdrop-blur-sm">
              {{ eventosDestacados[0].tipo }}
            </span>
            <div
              class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white flex flex-col justify-end h-1/2">
              <h3 class="font-playfair text-2xl xl:text-3xl font-semibold mb-2">{{ eventosDestacados[0].nombre }}</h3>
              <p v-if="eventosDestacados[0].descripcion" class="text-sm md:text-base text-gray-200 mb-2 line-clamp-2">
                {{ eventosDestacados[0].descripcion }}
              </p>
              <div class="flex items-center text-sm md:text-base mb-4">
                <CalendarDaysIcon class="h-5 w-5 mr-2 text-brand-camel" />
                <span>{{ eventosDestacados[0].fechaFormateada }}</span>
                <span v-if="eventosDestacados[0].lugar" class="ml-4 flex items-center">
                  <MapPinIcon class="h-5 w-5 mr-2 text-brand-camel" />
                  {{ eventosDestacados[0].lugar }}
                </span>
              </div>
              <router-link :to="`/eventos/${eventosDestacados[0].id}`"
                class="self-start bg-brand-borgona text-white py-2 px-6 rounded-md hover:bg-brand-verde-oscuro transition-colors text-base font-medium flex items-center">
                Más Información <ArrowRightIcon class="h-4 w-4 ml-2" />
              </router-link>
            </div>
          </div>

          <!-- Evento Secundario 1 -->
          <div v-if="eventosDestacados[1]"
            class="lg:col-span-2 lg:row-span-2 lg:col-start-4 rounded-lg overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 flex flex-col min-h-[250px] lg:min-h-0 relative group">
            <img
              :src="eventosDestacados[1].imagenUrl ? `${API_BASE_URL}${eventosDestacados[1].imagenUrl}` : 'https://placehold.co/400x200/E91E63/FFFFFF?text=Evento'"
              :alt="eventosDestacados[1].nombre" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <span v-if="eventosDestacados[1].tipo"
              class="absolute top-2 left-2 bg-brand-verde-oscuro/80 text-white text-xs px-2 py-0.5 rounded-full z-10 backdrop-blur-sm">
              {{ eventosDestacados[1].tipo }}
            </span>
            <div class="p-4 flex flex-col flex-grow">
              <h4 class="font-playfair text-lg font-semibold text-brand-negro mb-1">{{ eventosDestacados[1].nombre }}
              </h4>
              <p class="text-brand-camel text-xs mb-1 flex items-center">
                <CalendarDaysIcon class="h-4 w-4 mr-1" /> {{ eventosDestacados[1].fechaFormateada }}
              </p>
              <p v-if="eventosDestacados[1].lugar" class="text-gray-500 text-xs mb-2 flex items-center">
                <MapPinIcon class="h-4 w-4 mr-1" /> {{ eventosDestacados[1].lugar }}
              </p>
              <p v-if="eventosDestacados[1].descripcion" class="text-gray-700 text-sm mb-3 line-clamp-2">
                {{ eventosDestacados[1].descripcion }}
              </p>
              <router-link :to="`/eventos/${eventosDestacados[1].id}`"
                class="mt-auto self-start text-brand-verde-oscuro bg-brand-verde-oscuro/10 hover:bg-brand-verde-oscuro/20 font-medium transition-all duration-300 text-sm flex items-center py-1.5 px-3 rounded-md hover:translate-x-1">
                Ver Detalles <ArrowRightIcon class="h-4 w-4 ml-2" />
              </router-link>
            </div>
          </div>

          <!-- Evento Secundario 2 -->
          <div v-if="eventosDestacados[2]"
            class="lg:col-span-2 lg:row-span-2 lg:col-start-4 lg:row-start-3 rounded-lg overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 flex flex-col min-h-[250px] lg:min-h-0 relative group">
            <img
              :src="eventosDestacados[2].imagenUrl ? `${API_BASE_URL}${eventosDestacados[2].imagenUrl}` : 'https://placehold.co/400x200/9C27B0/FFFFFF?text=Evento'"
              :alt="eventosDestacados[2].nombre" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <span v-if="eventosDestacados[2].tipo"
              class="absolute top-2 left-2 bg-brand-verde-oscuro/80 text-white text-xs px-2 py-0.5 rounded-full z-10 backdrop-blur-sm">
              {{ eventosDestacados[2].tipo }}
            </span>
            <div class="p-4 flex flex-col flex-grow">
              <h4 class="font-playfair text-lg font-semibold text-brand-negro mb-1">{{ eventosDestacados[2].nombre }}
              </h4>
              <p class="text-brand-camel text-xs mb-1 flex items-center">
                <CalendarDaysIcon class="h-4 w-4 mr-1" /> {{ eventosDestacados[2].fechaFormateada }}
              </p>
              <p v-if="eventosDestacados[2].lugar" class="text-gray-500 text-xs mb-2 flex items-center">
                <MapPinIcon class="h-4 w-4 mr-1" /> {{ eventosDestacados[2].lugar }}
              </p>
              <p v-if="eventosDestacados[2].descripcion" class="text-gray-700 text-sm mb-3 line-clamp-2">
                {{ eventosDestacados[2].descripcion }}
              </p>
              <router-link :to="`/eventos/${eventosDestacados[2].id}`"
                class="mt-auto self-start text-brand-verde-oscuro bg-brand-verde-oscuro/10 hover:bg-brand-verde-oscuro/20 font-medium transition-all duration-300 text-sm flex items-center py-1.5 px-3 rounded-md hover:translate-x-1">
                Ver Detalles <ArrowRightIcon class="h-4 w-4 ml-2" />
              </router-link>
            </div>
          </div>

          <!-- Botón Todos los Eventos -->
          <div class="lg:col-span-2 lg:col-start-4 lg:row-start-5 flex items-center justify-center p-4">
            <router-link to="/eventos"
              class="bg-brand-camel text-white py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-300 text-lg font-medium flex items-center shadow-lg hover:scale-105">
              Ver Todos los Eventos <ArrowRightIcon class="h-5 w-5 ml-3" />
            </router-link>
          </div>

        </div>
        <div v-else class="text-center text-brand-negro py-10">
          <CalendarDaysIcon class="h-12 w-12 mx-auto text-brand-camel mb-4" />
          <p class="text-xl font-playfair">No hay eventos disponibles en este momento</p>
          <p class="text-base text-gray-600">¡Vuelve pronto!</p>
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