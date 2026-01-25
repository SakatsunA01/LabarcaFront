<template>
  <div class="admin-artistas-view">
    <h1 class="text-3xl font-bold text-brand-negro mb-6">Gestión de Artistas</h1>

    <!-- Controles Superiores: Búsqueda y Botón de Crear -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div class="w-full md:w-1/3">
        <input
v-model="searchTerm" type="text" placeholder="Buscar por nombre..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow" />
      </div>
      <button
class="w-full md:w-auto bg-brand-verde-oscuro text-white py-2 px-5 rounded-md hover:bg-opacity-80 transition-colors font-medium flex items-center justify-center"
        @click="openCreateModal">
        <PlusIcon class="h-5 w-5 mr-2" />
        Crear Artista
      </button>
    </div>

    <!-- Tabla de Artistas -->
    <div class="bg-white rounded-xl shadow-md overflow-x-auto">
      <div v-if="isLoading" class="p-8 text-center text-gray-500">Cargando artistas...</div>
      <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
      <table v-else-if="filteredArtistas.length" class="min-w-full divide-y divide-gray-200 min-w-[520px]">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagen
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="artista in filteredArtistas" :key="artista.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <img
                :src="artista.imageUrl ? fullUrl(artista.imageUrl) : 'https://placehold.co/40x40'"
                alt="Avatar" class="h-10 w-10 rounded-full object-cover">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ artista.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
              <button class="text-brand-camel hover:text-brand-borgona" @click="openEditModal(artista)" title="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487z"/><path stroke-linecap="round" stroke-linejoin="round" d="M18 2l4 4"/></svg>
              </button>
              <button class="text-red-600 hover:text-red-900" @click="confirmDelete(artista.id)" title="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.036-1.005 12.062A3.75 3.75 0 0115.166 22H8.834a3.75 3.75 0 01-3.742-3.279L4.087 6.66l-.209.036a.75.75 0 01-.256-1.478A48.9 48.9 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.368 0C15.287 1.805 16.5 3.141 16.5 4.705zm-6.136-1.45a51.192 51.192 0 013.272 0C14.41 3.08 15 3.69 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.787.591-1.398 1.364-1.45z" clip-rule="evenodd"/></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="p-8 text-center text-gray-500">No se encontraron artistas.</div>
    </div>

    <!-- Modal para Crear/Editar Artista -->
    <ArtistaFormModal :show="isModalOpen" :artista="artistaSeleccionado" @close="closeModal" @save="handleSave" />
    <ConfirmDialog :show="showConfirm" title="Eliminar artista" message="Esta acción no se puede deshacer." confirm-text="Eliminar" cancel-text="Cancelar" @update:show="val => showConfirm = val" @confirm="performDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { PlusIcon } from '@heroicons/vue/24/outline';
import ArtistaFormModal from '@/components/admin/ArtistaFormModal.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';

interface Artista {
  id: number;
  name: string;
  imageUrl?: string;
  [key: string]: any; // Para el resto de propiedades
}

const artistas = ref<Artista[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const searchTerm = ref('');

const isModalOpen = ref(false);
const artistaSeleccionado = ref<Artista | null>(null);

const API_URL = 'https://api.labarcaministerio.com/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fullUrl = (path: string) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  try { return new URL(path, API_BASE_URL).toString(); } catch { return `${API_BASE_URL}${path}`; }
};

const fetchArtistas = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${API_URL}/artistas`);
    artistas.value = response.data;
  } catch (err) {
    console.error("Error al cargar artistas:", err);
    error.value = "No se pudieron cargar los artistas.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchArtistas);

const filteredArtistas = computed(() => {
  if (!searchTerm.value) {
    return artistas.value;
  }
  return artistas.value.filter(artista =>
    artista.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const openCreateModal = () => {
  artistaSeleccionado.value = null;
  isModalOpen.value = true;
};

const openEditModal = (artista: Artista) => {
  artistaSeleccionado.value = artista;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSave = () => {
  fetchArtistas(); // Recargar la lista después de guardar
  closeModal();
};

const showConfirm = ref(false);
const toDeleteId = ref<number | null>(null);
const confirmDelete = (id: number) => { toDeleteId.value = id; showConfirm.value = true; };
const performDelete = async () => {
  if (!toDeleteId.value) return;
  try {
    await axios.delete(`${API_URL}/artistas/${toDeleteId.value}`);
    fetchArtistas();
  } catch (err) {
    console.error('Error al eliminar artista:', err);
  } finally {
    showConfirm.value = false;
    toDeleteId.value = null;
  }
};
</script>

