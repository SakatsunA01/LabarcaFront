<template>
  <div class="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-brand-negro mb-6">Petición de Oración</h1>

    <div class="bg-brand-gris-claro p-6 rounded-lg shadow-md mb-8">
      <p class="text-center italic text-lg text-brand-camel mb-4">
        "Y esta es la confianza que tenemos en él, que si pedimos alguna cosa conforme a su voluntad, él nos oye." - 1 Juan 5:14 Reina-Valera 1960
      </p>
      <p class="text-lg text-gray-700 text-center">Aquí podrás dejar tu petición de oración. ¡Estamos para orar por ti!</p>
    </div>

    <div v-if="authStore.isAuthenticated" class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-2xl font-bold text-brand-negro mb-4">Deja tu Petición</h2>
      <form @submit.prevent="submitPrayerRequest">
        <div class="mb-4">
          <label for="request_text" class="block text-sm font-medium text-gray-700 mb-1">Tu Petición</label>
          <textarea
id="request_text" v-model="newRequest.request_text" rows="5"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-camel focus:border-brand-camel"
            required></textarea>
        </div>
        <div class="mb-4 flex items-center">
          <input
id="is_public" v-model="newRequest.is_public" type="checkbox"
            class="h-4 w-4 text-brand-camel focus:ring-brand-camel border-gray-300 rounded">
          <label for="is_public" class="ml-2 block text-sm text-gray-900">Hacer pública mi petición (será visible para otros)</label>
        </div>
        <button type="submit" :disabled="isLoading" class="bg-brand-camel text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
          <span v-if="isLoading">Enviando...</span>
          <span v-else>Enviar Petición</span>
        </button>
        <p v-if="successMessage" class="mt-3 text-green-600 text-sm">{{ successMessage }}</p>
        <p v-if="errorMessage" class="mt-3 text-red-600 text-sm">{{ errorMessage }}</p>
      </form>
    </div>
    <div v-else class="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
      <p class="text-lg text-gray-700">Por favor, <button class="text-brand-camel hover:underline" @click="uiStore.setShowLoginModal(true)">inicia sesión</button> para dejar tu petición de oración.</p>
    </div>

    <h2 class="text-2xl font-bold text-brand-negro mb-4">Peticiones Públicas</h2>
    <div v-if="publicRequests.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="request in publicRequests" :key="request.id" class="bg-white p-6 rounded-lg shadow-md">
        <p class="text-gray-800 mb-3">"{{ request.request_text }}"</p>
        <p class="text-sm text-gray-600">- {{ request.user.name }} ({{ new Date(request.created_at).toLocaleDateString() }})</p>
      </div>
    </div>
    <div v-else class="bg-white p-6 rounded-lg shadow-md text-center">
      <p class="text-gray-700">No hay peticiones de oración públicas en este momento.</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';

interface PrayerRequest {
  id: number;
  user_id: number;
  request_text: string;
  is_public: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user: { id: number; name: string };
}

const authStore = useAuthStore();
const uiStore = useUiStore();

const newRequest = ref({
  request_text: '',
  is_public: false,
});

const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const publicRequests = ref<PrayerRequest[]>([]);

const API_URL = 'https://api.labarcaministerio.com';

const fetchPublicRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/prayer-requests`);
    publicRequests.value = response.data;
  } catch (error) {
    console.error('Error fetching public prayer requests:', error);
  }
};

const submitPrayerRequest = async () => {
  isLoading.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  try {
    await axios.post(`${API_URL}/prayer-requests`, newRequest.value, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    successMessage.value = 'Tu petición ha sido enviada con éxito. ¡Gracias!';
    newRequest.value.request_text = ''; // Clear form
    newRequest.value.is_public = false;
    fetchPublicRequests(); // Refresh list
  } catch (error: any) {
    console.error('Error submitting prayer request:', error);
    errorMessage.value = error.response?.data?.message || 'Ocurrió un error al enviar tu petición.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPublicRequests();
});
</script>

<style scoped>
/* Estilos específicos para esta vista */
</style>