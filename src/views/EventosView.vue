<template>
  <div class="eventos-view bg-brand-gris-claro min-h-screen py-6 md:py-10">
    <div class="container mx-auto px-4 max-w-5xl">
      <header class="mb-6 md:mb-10 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-brand-negro">Nuestros Eventos</h1>
      </header>

      <!-- Filtros -->
      <section class="mb-6 md:mb-8 p-3 md:p-4 bg-white rounded-xl shadow-lg">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4">
          <div class="flex space-x-2 sm:space-x-3">
            <button @click="setFiltroActivo('todos')"
              :class="['px-4 py-2 rounded-md text-sm font-medium transition-colors', filtroActivo === 'todos' ? 'bg-brand-camel text-white' : 'bg-gray-200 text-brand-negro hover:bg-gray-300']">
              Todos
            </button>
            <button @click="setFiltroActivo('proximos')"
              :class="['px-4 py-2 rounded-md text-sm font-medium transition-colors', filtroActivo === 'proximos' ? 'bg-brand-camel text-white' : 'bg-gray-200 text-brand-negro hover:bg-gray-300']">
              Próximos
            </button>
            <button @click="setFiltroActivo('pasados')"
              :class="['px-4 py-2 rounded-md text-sm font-medium transition-colors', filtroActivo === 'pasados' ? 'bg-brand-camel text-white' : 'bg-gray-200 text-brand-negro hover:bg-gray-300']">
              Pasados
            </button>
          </div>
          <!-- Placeholder para el calendario -->
          <div class="text-sm text-gray-500 mt-4 sm:mt-0">
            <!-- Calendario (Implementación futura) -->
            <!-- <button class="p-2 border rounded-md hover:bg-gray-100">📅 Seleccionar Fecha</button> -->
          </div>
        </div>
      </section>

      <!-- Lista de Eventos -->
      <transition name="fade" mode="out-in">
        <div v-if="isLoading" class="text-center py-10">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-camel"></div>
          <p class="mt-4 text-brand-negro">Cargando eventos...</p>
        </div>
        <div v-else-if="Object.keys(eventosAgrupados).length > 0" class="space-y-10">
          <div v-for="(eventosDelMes, mesAno) in eventosAgrupados" :key="mesAno" class="month-group">
            <h2
              class="text-xl md:text-2xl font-semibold text-brand-verde-oscuro mb-4 md:mb-6 border-b-2 border-brand-camel pb-2">
              {{ mesAno }}
            </h2>
            <transition-group tag="div" name="list-anim" class="space-y-6">
              <EventoCardHorizontal v-for="evento in eventosDelMes" :key="evento.id" :evento="evento" />
            </transition-group>
          </div>
        </div>
        <div v-else :key="`no-eventos-${filtroActivo}`" class="text-center py-10 bg-white rounded-xl shadow-md">
          <p class="text-xl text-brand-negro">No hay eventos que coincidan con tu búsqueda.</p>
          <p class="text-gray-600 mt-2">Intenta con otros filtros o revisa más tarde.</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import EventoCardHorizontal from '@/components/EventoCardHorizontal.vue';
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
const filtroActivo = ref<'todos' | 'proximos' | 'pasados'>('proximos');
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
    // Si tu backend corre en http://localhost:8000, la URL sería:
    const response = await axios.get('http://localhost:8000/api/eventos');
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
    // Ordenar por fecha, los más recientes primero si son pasados, los más próximos primero si son futuros/todos
    return filtroActivo.value === 'pasados'
      ? new Date(b.fecha.replace(/-/g, '/')).getTime() - new Date(a.fecha.replace(/-/g, '/')).getTime()
      : new Date(a.fecha.replace(/-/g, '/')).getTime() - new Date(b.fecha.replace(/-/g, '/')).getTime();
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
