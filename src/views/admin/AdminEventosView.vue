<template>
    <div class="admin-eventos-view">
        <h1 class="text-3xl font-bold text-brand-negro mb-6">Gestión de Eventos</h1>

        <!-- Controles Superiores: Búsqueda y Botón de Crear -->
        <div class="flex justify-between items-center mb-6">
            <div class="w-1/3">
                <input type="text" v-model="searchTerm" placeholder="Buscar por nombre..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow" />
            </div>
            <button @click="openCreateModal"
                class="bg-brand-verde-oscuro text-white py-2 px-5 rounded-md hover:bg-opacity-80 transition-colors font-medium flex items-center">
                <PlusIcon class="h-5 w-5 mr-2" />
                Crear Evento
            </button>
        </div>

        <!-- Tabla de Eventos -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div v-if="isLoading" class="p-8 text-center text-gray-500">Cargando eventos...</div>
            <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
            <table v-else-if="filteredEventos.length" class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Imagen
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lugar
                        </th>
                        <th scope="col" class="relative px-6 py-3">
                            <span class="sr-only">Acciones</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="evento in filteredEventos" :key="evento.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <img :src="evento.imagenUrl ? `${API_BASE_URL}${evento.imagenUrl}` : 'https://placehold.co/40x40'"
                                alt="Imagen Evento" class="h-10 w-10 rounded-full object-cover">
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">{{ evento.nombre }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ formatDateTime(evento.fecha) }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ evento.lugar || 'N/A' }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button @click="openEditModal(evento)"
                                class="text-brand-camel hover:text-brand-borgona mr-4">Editar</button>
                            <button @click="deleteEvento(evento.id)"
                                class="text-red-600 hover:text-red-900">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="p-8 text-center text-gray-500">No se encontraron eventos.</div>
        </div>

        <!-- Modal para Crear/Editar Evento -->
        <EventoFormModal :show="isModalOpen" :evento="eventoSeleccionado" @close="closeModal" @save="handleSave" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { PlusIcon } from '@heroicons/vue/24/outline';
import EventoFormModal from '@/components/admin/EventoFormModal.vue';

interface Evento {
    id: number;
    nombre: string;
    fecha: string;
    lugar?: string;
    imagenUrl?: string;
    [key: string]: any; // For other properties
}

const eventos = ref<Evento[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const searchTerm = ref('');

const isModalOpen = ref(false);
const eventoSeleccionado = ref<Evento | null>(null);

const API_URL = 'http://localhost:8000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchEventos = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await axios.get(`${API_URL}/eventos`);
        eventos.value = response.data;
    } catch (err) {
        console.error("Error al cargar eventos:", err);
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

const openCreateModal = () => {
    eventoSeleccionado.value = null;
    isModalOpen.value = true;
};

const openEditModal = (evento: Evento) => {
    eventoSeleccionado.value = evento;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const handleSave = () => {
    fetchEventos(); // Recargar la lista después de guardar
    closeModal();
};

const deleteEvento = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        try {
            await axios.delete(`${API_URL}/eventos/${id}`);
            fetchEventos(); // Recargar la lista
        } catch (err) {
            console.error("Error al eliminar evento:", err);
            alert('No se pudo eliminar el evento.');
        }
    }
};
</script>
