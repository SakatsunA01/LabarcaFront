<template>
  <section class="py-8 md:py-12 px-2 sm:px-4 lg:px-6">
    <div class="container mx-auto max-w-7xl">
      <h2 class="text-3xl md:text-4xl font-bold text-brand-negro text-center mb-8 md:mb-10 relative">
        Nuestros Próximos Eventos
      </h2>
      <div v-if="proximosEventos.length > 0" class="flex flex-col lg:flex-row gap-8 items-stretch">
        <!-- Evento Principal -->
        <div
          class="lg:w-7/12 bg-white shadow-xl rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl">
          <img :src="proximosEventos[0].imagen" :alt="proximosEventos[0].titulo"
            class="w-full h-64 md:h-80 lg:h-96 object-cover" />
          <div class="p-4 md:p-6 flex flex-col flex-grow">
            <h3 class="text-2xl xl:text-3xl font-semibold text-brand-negro mb-2">
              {{ proximosEventos[0].titulo }}
            </h3>
            <p class="text-brand-camel text-sm md:text-base mb-3">{{ proximosEventos[0].fechaFormateada }}</p>
            <p class="text-gray-700 text-base md:text-lg mb-6 flex-grow">
              {{ proximosEventos[0].descripcionCorta }}
            </p>
            <router-link :to="`/eventos/${proximosEventos[0].id}`"
              class="mt-auto self-start bg-brand-borgona text-white py-2.5 px-7 rounded-md hover:bg-opacity-80 transition-colors text-base md:text-lg font-medium">
              Más Información
            </router-link>
          </div>
        </div>

        <!-- Evento Secundario y Botón Todos los Eventos -->
        <div class="lg:w-5/12 flex flex-col gap-8">
          <div v-if="proximosEventos.length > 1"
            class="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col flex-grow transition-all duration-300 hover:shadow-2xl">
            <img :src="proximosEventos[1].imagen" :alt="proximosEventos[1].titulo"
              class="w-full h-40 md:h-48 object-cover" />
            <div class="p-4 md:p-5 flex flex-col flex-grow">
              <h4 class="text-xl font-semibold text-brand-negro mb-1">
                {{ proximosEventos[1].titulo }}
              </h4>
              <p class="text-brand-camel text-sm mb-3">{{ proximosEventos[1].fechaFormateada }}</p>
              <p class="text-gray-600 text-sm mb-4 flex-grow">
                {{ proximosEventos[1].descripcionCorta.substring(0, 80) + (proximosEventos[1].descripcionCorta.length >
                  80 ? '...' : '') }}
              </p>
              <router-link :to="`/eventos/${proximosEventos[1].id}`"
                class="mt-auto self-start text-brand-verde-oscuro hover:text-brand-borgona font-medium transition-colors">
                Ver Detalles
              </router-link>
            </div>
          </div>
          <button @click="navegarATodosEventos" type="button"
            class="w-full bg-brand-camel text-center text-white py-3 px-6 rounded-md hover:bg-opacity-80 transition-colors text-lg font-medium shadow-lg hover:shadow-xl mt-auto">
            Todos los Eventos
          </button>
        </div>
      </div>
      <div v-else class="text-center text-brand-negro py-10">
        <p class="text-xl">Próximamente anunciaremos nuevos eventos. ¡Mantente atento!</p>
        <!-- Icono de calendario o similar podría ir aquí -->
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { useUiStore } from '@/stores/uiStore';
import { defineComponent, ref, onMounted, computed } from 'vue';

interface Evento {
  id: string;
  // o number si tu API devuelve number
  titulo: string;
  fecha: string; // Formato 'YYYY-MM-DD HH:mm:ss' desde la BD o 'YYYY-MM-DDTHH:mm:ss' para new Date()
  descripcionCorta: string;
  imagen: string; // Debería ser imagenUrl de tu BD
  lugar?: string;
  link_compra?: string;
  fechaFormateada?: string;
}

export default defineComponent({
  name: 'EventosDestacados',
  setup() {
    const router = useRouter();
    const uiStore = useUiStore();

    // Asegúrate de que las fechas sean futuras para que el filtro funcione
    const getFutureDate = (daysToAdd: number, hour: number = 20, minute: number = 0): string => {
      const date = new Date();
      date.setDate(date.getDate() + daysToAdd);
      date.setHours(hour, minute, 0, 0);
      return date.toISOString(); // Formato ISO que new Date() maneja bien
    };

    const todosLosEventos = ref<Evento[]>([
      { id: 'evento-1', titulo: 'Concierto de Adoración: Noche de Paz', fecha: getFutureDate(15), descripcionCorta: 'Una noche especial de alabanza y adoración con artistas invitados. ¡No te lo pierdas!', imagen: 'https://placehold.co/800x450/3498DB/FFFFFF?text=Evento+1', lugar: 'Auditorio Principal' },
      { id: 'evento-2', titulo: 'Taller de Composición Musical Cristiana', fecha: getFutureDate(30, 10), descripcionCorta: 'Aprende técnicas y fundamentos para componer canciones que glorifiquen a Dios.', imagen: 'https://placehold.co/800x450/E91E63/FFFFFF?text=Evento+2', lugar: 'Salón de Conferencias' },
      { id: 'evento-3', titulo: 'Retiro Espiritual "Encuentro"', fecha: getFutureDate(60, 16), descripcionCorta: 'Un tiempo de renovación espiritual y comunión profunda.', imagen: 'https://placehold.co/800x450/2ECC71/FFFFFF?text=Evento+3', lugar: 'Casa de Retiro "El Refugio"' },
      { id: 'evento-4', titulo: 'Conferencia "Fe en Acción"', fecha: getFutureDate(5), descripcionCorta: 'Descubre cómo vivir tu fe diariamente.', imagen: 'https://placehold.co/800x450/9B59B6/FFFFFF?text=Evento+4', lugar: 'Centro Comunitario' },
    ]);

    const formatearFecha = (fechaStr: string): string => {
      const fechaObj = new Date(fechaStr);
      return fechaObj.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) +
        ' - ' + fechaObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const proximosEventos = computed(() => {
      const ahora = new Date();
      return todosLosEventos.value
        .filter(evento => new Date(evento.fecha) >= ahora)
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        .map(evento => ({ ...evento, fechaFormateada: formatearFecha(evento.fecha) }))
        .slice(0, 2);
    });

    const navegarATodosEventos = async () => {
      await uiStore.showLoadingOverlay(); // Muestra el overlay y espera un poco
      router.push('/eventos');
    };

    return {
      proximosEventos,
      navegarATodosEventos,
    };
  },
});
</script>
