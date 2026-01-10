<template>
  <div class="admin-ticket-orders-view p-4">
    <h1 class="text-2xl font-bold mb-4">Ventas de Entradas</h1>

    <div v-if="isLoading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-camel"></div>
      <p class="mt-4 text-brand-negro">Cargando ventas...</p>
    </div>

    <div v-else-if="error" class="text-center py-10 bg-white shadow-md rounded-lg">
      <p class="text-lg text-red-600">{{ error }}</p>
    </div>

    <div v-else-if="orders.length > 0" class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ order.mp_payment_id || order.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ order.user?.name || 'Usuario' }}
              <div class="text-xs text-gray-500">{{ order.user?.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ order.event?.nombre || 'Evento' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ order.product?.name || 'Entrada' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ order.quantity }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatPrice(order.unit_price_ars * order.quantity) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="order.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'">
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(order.created_at) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center py-10 bg-white shadow-md rounded-lg">
      <p class="text-lg text-gray-600">Todavia no hay ventas registradas.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface TicketOrder {
  id: number;
  quantity: number;
  unit_price_ars: number;
  status: string;
  mp_payment_id?: string | null;
  created_at: string;
  event?: { nombre: string };
  product?: { name: string };
  user?: { name: string; email: string };
}

const orders = ref<TicketOrder[]>([]);
const isLoading = ref(true);
const error = ref('');

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api`;

const fetchOrders = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const response = await axios.get(`${API_URL}/admin/ticket-orders`);
    orders.value = response.data;
  } catch (err: any) {
    console.error('Error al cargar ventas:', err);
    error.value = err.response?.data?.message || 'No se pudieron cargar las ventas.';
  } finally {
    isLoading.value = false;
  }
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

const formatDate = (value: string) => {
  return new Date(value.replace(/-/g, '/')).toLocaleString('es-AR');
};

onMounted(fetchOrders);
</script>
