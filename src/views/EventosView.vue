<template>
  <div class="eventos-view bg-brand-gris-claro min-h-screen py-16">
    <AnimatedSection>
      <div class="container mx-auto px-4 max-w-5xl">
        <header class="mb-12 text-center space-y-3">
          <span class="text-brand-camel uppercase tracking-[0.4em] text-[10px] font-bold">Experiencias La Barca</span>
          <h1 class="text-5xl md:text-6xl font-playfair text-brand-negro italic">Nuestros Eventos</h1>
          <div class="w-20 h-1 bg-brand-camel/20 mx-auto rounded-full mt-4"></div>
        </header>

        <section class="mb-12 flex justify-center">
          <div class="inline-flex p-1.5 bg-white rounded-full shadow-card border border-gray-100">
            <button v-for="filtro in (['todos', 'proximos', 'pasados'] as const)" :key="filtro" :class="[
              'px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300',
              filtroActivo === filtro
                ? 'bg-brand-camel text-white shadow-md'
                : 'text-gray-400 hover:text-brand-negro'
            ]" @click="setFiltroActivo(filtro)">
              {{ filtro === 'todos' ? 'Todos' : filtro === 'proximos' ? 'Próximos' : 'Pasados' }}
            </button>
          </div>
        </section>

        <transition name="fade" mode="out-in">
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
            <div class="w-12 h-12 border-2 border-brand-camel border-t-transparent rounded-full animate-spin"></div>
            <p class="mt-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Cargando agenda</p>
          </div>

          <div v-else-if="Object.keys(eventosAgrupados).length > 0" class="space-y-16">
            <div v-for="(eventosDelMes, mesAno) in eventosAgrupados" :key="mesAno" class="month-group">
              <div class="flex items-center gap-6 mb-8">
                <h2 class="font-playfair text-3xl text-brand-negro shrink-0">
                  {{ mesAno }}
                </h2>
                <div class="h-[1px] w-full bg-brand-camel/20"></div>
              </div>

              <transition-group tag="div" name="list-anim" class="space-y-6">
                <EventoCardHorizontal v-for="evento in eventosDelMes" :key="evento.id" :evento="evento"
                  class="transform transition-all hover:shadow-card-hover hover:-translate-y-1" />
              </transition-group>
            </div>
          </div>

          <div v-else :key="`no-eventos-${filtroActivo}`"
            class="text-center py-20 bg-white rounded-3xl shadow-card border-2 border-dashed border-gray-100 max-w-3xl mx-auto">
            <div class="mb-4 opacity-20">
              <CalendarIcon class="w-12 h-12 mx-auto text-brand-negro" />
            </div>
            <p class="text-xl font-playfair text-brand-negro">No se encontraron eventos</p>
            <p class="text-xs text-gray-400 mt-2 uppercase tracking-widest">Intenta con otros filtros o vuelve pronto.
            </p>
          </div>
        </transition>
      </div>
    </AnimatedSection>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import EventoCardHorizontal from '@/components/EventoCardHorizontal.vue';
import AnimatedSection from '@/components/AnimatedSection.vue';
import axios from 'axios'; // Descomenta esto
import { useUiStore } from '@/stores/uiStore';

interface Evento {
  id: string | number;
  nombre: string;
  fecha: string; // 'YYYY-MM-DD HH:mm:ss'
  link_compra?: string | null;
  descripcion?: string | null;
  lugar?: string | null;
  imagenUrl?: string | null;
  // Para la UI
  fechaFormateada?: string;
  horaFormateada?: string;
}

interface EventosAgrupados {
  [mesAno: string]: Evento[];
}

const todosLosEventos = ref<Evento[]>([]);
const filtroActivo = ref<'todos' | 'proximos' | 'pasados'>('todos');
const isLoading = ref(true);
const uiStore = useUiStore();

const getFutureDate = (daysToAdd: number, hour: number = 20, minute: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(hour, minute, 0, 0);
  // Formato YYYY-MM-DD HH:MM:SS
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
};

const getPastDate = (daysToSubtract: number, hour: number = 20, minute: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysToSubtract);
  date.setHours(hour, minute, 0, 0);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
};


onMounted(async () => {
  isLoading.value = true;
  try {
    // Asegúrate de que la URL base de tu API sea correcta.
    // Si tu backend corre en https://api.labarcaministerio.com, la URL sería:
    const response = await axios.get('https://api.labarcaministerio.com/api/eventos');
    todosLosEventos.value = response.data;
  } catch (error) {
    console.error("Error al cargar eventos:", error);
    // Aquí podrías mostrar un mensaje de error al usuario o cargar datos de ejemplo como fallback
  }
  isLoading.value = false;
  uiStore.setRouteLoading(false); // Oculta el overlay global

});

const setFiltroActivo = (filtro: 'todos' | 'proximos' | 'pasados') => {
  filtroActivo.value = filtro;
};

const eventosFiltrados = computed(() => {
  const ahora = new Date();
  if (filtroActivo.value === 'proximos') {
    return todosLosEventos.value.filter(e => new Date(e.fecha.replace(/-/g, '/')) >= ahora); // replace para compatibilidad de formato de fecha
  }
  if (filtroActivo.value === 'pasados') {
    return todosLosEventos.value.filter(e => new Date(e.fecha.replace(/-/g, '/')) < ahora);
  }
  return todosLosEventos.value;
});

const eventosAgrupados = computed(() => {
  const agrupados: EventosAgrupados = {};
  const eventosOrdenados = [...eventosFiltrados.value].sort((a, b) => {
    const ahora = new Date();
    const fechaA = new Date(a.fecha.replace(/-/g, '/'));
    const fechaB = new Date(b.fecha.replace(/-/g, '/'));

    if (filtroActivo.value === 'todos') {
      const aEsFuturo = fechaA >= ahora;
      const bEsFuturo = fechaB >= ahora;

      if (aEsFuturo && !bEsFuturo) return -1; // a (futuro) va antes que b (pasado)
      if (!aEsFuturo && bEsFuturo) return 1;  // b (futuro) va antes que a (pasado)

      // Si ambos son futuros, ordenar por el más cercano
      if (aEsFuturo && bEsFuturo) {
        return fechaA.getTime() - fechaB.getTime();
      }

      // Si ambos son pasados, ordenar por el más reciente
      if (!aEsFuturo && !bEsFuturo) {
        return fechaB.getTime() - fechaA.getTime();
      }
    }

    // Lógica original para 'proximos' y 'pasados'
    return filtroActivo.value === 'pasados'
      ? fechaB.getTime() - fechaA.getTime()
      : fechaA.getTime() - fechaB.getTime();
  });

  eventosOrdenados.forEach(evento => {
    const fechaEvento = new Date(evento.fecha.replace(/-/g, '/'));
    const mes = fechaEvento.toLocaleString('es-ES', { month: 'long' });
    const ano = fechaEvento.getFullYear();
    const claveMesAno = `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${ano}`;

    if (!agrupados[claveMesAno]) {
      agrupados[claveMesAno] = [];
    }
    agrupados[claveMesAno].push({
      ...evento,
      fechaFormateada: fechaEvento.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      horaFormateada: fechaEvento.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })
    });
  });
  return agrupados;
});

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.list-anim-enter-active,
.list-anim-leave-active {
  transition: all 0.5s ease;
}

.list-anim-leave-active {
  /* Para evitar que los elementos que salen ocupen espacio durante la transición */
  position: absolute;
}

.list-anim-enter-from,
.list-anim-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
