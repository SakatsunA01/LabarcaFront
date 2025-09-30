<template>
    <div class="admin-galeria-view">
        <h1 class="text-3xl font-bold text-brand-negro mb-6">Gestión de Galerías de Eventos</h1>

        <!-- Controles Superiores: Búsqueda -->
        <div class="flex justify-between items-center mb-6">
            <div class="w-1/3">
                <input
v-model="searchTerm" type="text" placeholder="Buscar evento por nombre..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow" />
            </div>
        </div>

        <!-- Tabla de Eventos para gestionar galería -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div v-if="isLoading" class="p-8 text-center text-gray-500">Cargando eventos...</div>
            <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
            <table v-else-if="filteredEventos.length" class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Evento
                        </th>
                        <th
scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                        </th>
                        <th scope="col" class="relative px-6 py-3">
                            <span class="sr-only">Acciones</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="evento in filteredEventos" :key="evento.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">{{ evento.nombre }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ formatDateTime(evento.fecha) }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
class="text-brand-camel hover:text-brand-borgona"
                                @click="openGalleryModal(evento)">Gestionar Galería</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="p-8 text-center text-gray-500">No se encontraron eventos.</div>
        </div>

        <!-- Modal para Gestionar Galería del Evento -->
        <EventGalleryManagerModal
:show="isGalleryModalOpen" :evento-id="selectedEventoId"
            :evento-nombre="selectedEventoName" @close="closeGalleryModal" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import EventGalleryManagerModal from '@/components/admin/EventGalleryManagerModal.vue';

interface Evento {
    id: number;
    nombre: string;
    fecha: string;
    [key: string]: any;
}

const eventos = ref<Evento[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const searchTerm = ref('');

const isGalleryModalOpen = ref(false);
const selectedEventoId = ref<number | null>(null);
const selectedEventoName = ref<string | null>(null);

const API_URL = 'https://api.labarcaministerio.com/api';

const fetchEventos = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await axios.get(`${API_URL}/eventos`);
        eventos.value = response.data;
    } catch (err) {
        console.error("Error al cargar eventos para galería:", err);
        error.value = "No se pudieron cargar los eventos.";
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchEventos);

const filteredEventos = computed(() => {
    if (!searchTerm.value) {
        return eventos.value;
    }
    return eventos.value.filter(evento =>
        evento.nombre.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
});

const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

const openGalleryModal = (evento: Evento) => {
    selectedEventoId.value = evento.id;
    selectedEventoName.value = evento.nombre;
    isGalleryModalOpen.value = true;
};

const closeGalleryModal = () => {
    isGalleryModalOpen.value = false;
    selectedEventoId.value = null;
    selectedEventoName.value = null;
};
</script>
