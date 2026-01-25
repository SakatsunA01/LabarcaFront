<template>
  <div class="admin-sorteos-view">
    <h1 class="text-3xl font-bold text-brand-negro mb-6">Gestion de Sorteos</h1>

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div class="w-full md:w-1/3">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por nombre o premio..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow"
        />
      </div>
      <button
        class="w-full md:w-auto bg-brand-verde-oscuro text-white py-2 px-5 rounded-md hover:bg-opacity-80 transition-colors font-medium flex items-center justify-center"
        @click="openCreateModal"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        Crear Sorteo
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-md overflow-x-auto">
      <div v-if="isLoading" class="p-8 text-center text-gray-500">Cargando sorteos...</div>
      <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
      <table v-else-if="filteredSorteos.length" class="min-w-full divide-y divide-gray-200 min-w-[980px]">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premio</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha limite</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requisitos</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ganador</th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="sorteo in filteredSorteos" :key="sorteo.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <img
                :src="sorteo.premio_imagen_url ? fullUrl(sorteo.premio_imagen_url) : 'https://placehold.co/40x40'"
                alt="Premio"
                class="h-10 w-10 rounded-full object-cover"
              >
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ sorteo.nombre }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDateTime(sorteo.fecha_limite) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatRequirements(sorteo.requisitos) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="sorteo.estado === 'cerrado' ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-800'"
              >
                {{ sorteo.estado === 'cerrado' ? 'Cerrado' : 'Activo' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ sorteo.ganador?.name || 'Sin ganador' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex flex-wrap justify-end gap-2">
                <button class="text-brand-camel hover:text-brand-borgona" @click="openEditModal(sorteo)">Editar</button>
                <button
                  v-if="sorteo.estado !== 'cerrado'"
                  class="text-brand-negro hover:text-brand-camel"
                  @click="confirmCloseSorteo(sorteo)"
                >
                  Cerrar
                </button>
                <button class="text-red-600 hover:text-red-900" @click="deleteSorteo(sorteo.id)">Eliminar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="p-8 text-center text-gray-500">No se encontraron sorteos.</div>
    </div>

    <SorteoFormModal :show="isModalOpen" :sorteo="sorteoSeleccionado" @close="closeModal" @save="handleSave" />
    <ConfirmDialog
      :show="showConfirmClose"
      title="Cerrar sorteo"
      message="Al cerrar el sorteo se seleccionara un ganador."
      confirm-text="Cerrar"
      cancel-text="Cancelar"
      @update:show="(val: boolean) => showConfirmClose = val"
      @confirm="performClose"
    />
    <ConfirmDialog
      :show="showConfirmDelete"
      title="Eliminar sorteo"
      message="Esta accion no se puede deshacer."
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      @update:show="(val: boolean) => showConfirmDelete = val"
      @confirm="performDelete"
    />
    <SorteoCloseModal
      :show="showCloseModal"
      :stage="closeStage"
      :winner-name="winnerName"
      :winner-email="winnerEmail"
      @close="closeCloseModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { PlusIcon } from '@heroicons/vue/24/outline';
import SorteoFormModal from '@/components/admin/SorteoFormModal.vue';
import SorteoCloseModal from '@/components/admin/SorteoCloseModal.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';

interface Winner {
  name: string;
  email?: string;
}

interface Requirement {
  id?: string;
  type?: string;
  data?: Record<string, any>;
}

interface Sorteo {
  id: number;
  nombre: string;
  fecha_limite: string;
  premio: string;
  premio_imagen_url?: string | null;
  descripcion?: string | null;
  requisitos?: Requirement[] | string | null;
  estado?: 'activo' | 'cerrado';
  ganador?: Winner | null;
}

const sorteos = ref<Sorteo[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const searchTerm = ref('');

const isModalOpen = ref(false);
const sorteoSeleccionado = ref<Sorteo | null>(null);

const showConfirmClose = ref(false);
const showConfirmDelete = ref(false);
const pendingCloseSorteo = ref<Sorteo | null>(null);
const pendingDeleteId = ref<number | null>(null);

const showCloseModal = ref(false);
const closeStage = ref<'pending' | 'result'>('pending');
const winnerName = ref<string | null>(null);
const winnerEmail = ref<string | null>(null);

const API_URL = 'https://api.labarcaministerio.com/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchSorteos = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${API_URL}/admin/sorteos`);
    sorteos.value = response.data;
  } catch (err) {
    console.error('Error al cargar sorteos:', err);
    error.value = 'No se pudieron cargar los sorteos.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchSorteos);

const filteredSorteos = computed(() => {
  if (!searchTerm.value) {
    return sorteos.value;
  }
  const term = searchTerm.value.toLowerCase();
  return sorteos.value.filter((sorteo) => {
    return (
      sorteo.nombre.toLowerCase().includes(term) ||
      sorteo.premio.toLowerCase().includes(term)
    );
  });
});

const normalizeRequirements = (value: Sorteo['requisitos']) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatRequirements = (value: Sorteo['requisitos']) => {
  const list = normalizeRequirements(value);
  if (!list.length) return 'Sin requisitos';
  return list.map((item) => item.type || 'Requisito').join(', ');
};

const formatDateTime = (value: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(value).toLocaleDateString('es-ES', options);
};

const fullUrl = (path: string) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  try {
    return new URL(path, API_BASE_URL).toString();
  } catch {
    return `${API_BASE_URL}${path}`;
  }
};

const openCreateModal = () => {
  sorteoSeleccionado.value = null;
  isModalOpen.value = true;
};

const openEditModal = (sorteo: Sorteo) => {
  sorteoSeleccionado.value = sorteo;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSave = () => {
  fetchSorteos();
  closeModal();
};

const confirmCloseSorteo = (sorteo: Sorteo) => {
  pendingCloseSorteo.value = sorteo;
  showConfirmClose.value = true;
};

const performClose = async () => {
  if (!pendingCloseSorteo.value) return;
  showConfirmClose.value = false;

  showCloseModal.value = true;
  closeStage.value = 'pending';
  winnerName.value = null;
  winnerEmail.value = null;

  const currentSorteo = pendingCloseSorteo.value;
  pendingCloseSorteo.value = null;

  try {
    const response = await axios.post(`${API_URL}/admin/sorteos/${currentSorteo.id}/close`);
    const winner = response.data?.winner || response.data?.ganador;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    closeStage.value = 'result';
    winnerName.value = winner?.name || winner?.nombre || 'Ganador por confirmar';
    winnerEmail.value = winner?.email || null;
    updateSorteoAfterClose(currentSorteo.id, winner);
  } catch (err) {
    console.error('Error al cerrar sorteo:', err);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    closeStage.value = 'result';
    winnerName.value = 'Ganador por confirmar';
    winnerEmail.value = null;
    updateSorteoAfterClose(currentSorteo.id, null);
  }
};

const updateSorteoAfterClose = (id: number, winner: Winner | null) => {
  const index = sorteos.value.findIndex((item) => item.id === id);
  if (index === -1) return;
  sorteos.value[index] = {
    ...sorteos.value[index],
    estado: 'cerrado',
    ganador: winner || sorteos.value[index].ganador || null,
  };
};

const closeCloseModal = () => {
  showCloseModal.value = false;
  fetchSorteos();
};

const deleteSorteo = (id: number) => {
  pendingDeleteId.value = id;
  showConfirmDelete.value = true;
};

const performDelete = async () => {
  if (!pendingDeleteId.value) return;
  const id = pendingDeleteId.value;
  pendingDeleteId.value = null;
  showConfirmDelete.value = false;
  try {
    await axios.delete(`${API_URL}/admin/sorteos/${id}`);
    sorteos.value = sorteos.value.filter((item) => item.id !== id);
  } catch (err) {
    console.error('Error al eliminar sorteo:', err);
    alert('No se pudo eliminar el sorteo.');
  }
};
</script>
