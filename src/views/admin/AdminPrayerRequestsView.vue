<template>
  <div class="admin-prayer-requests-view">
    <h1 class="text-3xl font-bold text-brand-negro mb-6">Gestión de Peticiones de Oración</h1>

    <!-- Controles Superiores: Búsqueda -->
    <div class="flex justify-between items-center mb-6">
      <div class="w-1/3">
        <input type="text" v-model="searchTerm" placeholder="Buscar por usuario o texto..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow" />
      </div>
    </div>

    <!-- Tabla de Peticiones -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500">Cargando peticiones...</div>
      <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
      <table v-else-if="filteredRequests.length" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Petición (extracto)</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pública</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aprobada</th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="request in filteredRequests" :key="request.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ request.user?.name || 'Anónimo' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-md truncate">{{ request.request_text }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ request.is_public ? 'Sí' : 'No' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
               <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="request.is_approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ request.is_approved ? 'Sí' : 'No' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openDetailModal(request)" class="text-blue-600 hover:text-blue-900 mr-4">Ver</button>
              <button @click="toggleApproval(request)" class="text-brand-camel hover:text-brand-borgona mr-4">{{ request.is_approved ? 'Desaprobar' : 'Aprobar' }}</button>
              <button @click="deleteRequest(request.id)" class="text-red-600 hover:text-red-900">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="p-8 text-center text-gray-500">No se encontraron peticiones.</div>
    </div>

    <!-- Modal de Detalle -->
    <PrayerRequestDetailModal :show="isModalOpen" :request="selectedRequest" @close="isModalOpen = false" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import PrayerRequestDetailModal from '@/components/admin/PrayerRequestDetailModal.vue';

interface User {
  id: number;
  name: string;
}

interface PrayerRequest {
  id: number;
  user: User | null;
  request_text: string;
  is_public: boolean;
  is_approved: boolean;
}

const prayerRequests = ref<PrayerRequest[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchTerm = ref('');
const isModalOpen = ref(false);
const selectedRequest = ref<PrayerRequest | null>(null);

const openDetailModal = (request: PrayerRequest) => {
  selectedRequest.value = request;
  isModalOpen.value = true;
};

const fetchPrayerRequests = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('/api/admin/prayer-requests');
    prayerRequests.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch prayer requests.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const filteredRequests = computed(() => {
  if (!searchTerm.value) {
    return prayerRequests.value;
  }
  return prayerRequests.value.filter(request => {
    const userName = request.user?.name.toLowerCase() || '';
    const requestText = request.request_text.toLowerCase();
    const term = searchTerm.value.toLowerCase();
    return userName.includes(term) || requestText.includes(term);
  });
});

const toggleApproval = async (request: PrayerRequest) => {
  try {
    const newApprovedState = !request.is_approved;
    await axios.put(`/api/admin/prayer-requests/${request.id}`, {
      is_approved:newApprovedState,
    });
    const index = prayerRequests.value.findIndex((r) => r.id === request.id);
    if (index !== -1) {
      prayerRequests.value[index].is_approved = newApprovedState;
    }
  } catch (err) {
    console.error('Failed to update prayer request', err);
    alert('Failed to update prayer request.');
  }
};

const deleteRequest = async (id: number) => {
  if (!confirm('Are you sure you want to delete this request?')) {
    return;
  }
  try {
    await axios.delete(`/api/admin/prayer-requests/${id}`);
    prayerRequests.value = prayerRequests.value.filter((r) => r.id !== id);
  } catch (err) {
    console.error('Failed to delete prayer request', err);
    alert('Failed to delete prayer request.');
  }
};

onMounted(fetchPrayerRequests);
</script>