<template>
  <div class="min-h-screen bg-brand-gris-claro py-section-md px-4">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-2xl shadow-card border border-black/5 p-6 md:p-8">
        <h1 class="text-3xl font-bold text-brand-negro mb-2">Pago aprobado</h1>
        <p class="text-gray-600 mb-6">Tu compra se registro correctamente.</p>

        <div v-if="isLoading" class="text-center py-10 text-gray-500">Cargando tu entrada...</div>
        <div v-else-if="errorMessage" class="text-red-600 text-sm bg-red-100 p-3 rounded-md">{{ errorMessage }}</div>

        <div v-else-if="order" class="border border-gray-200 rounded-xl p-6 space-y-4">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500">Evento</p>
              <p class="text-lg font-semibold text-brand-negro">{{ order.event?.nombre }}</p>
              <p class="text-sm text-gray-600">{{ formatDate(order.event?.fecha) }}</p>
              <p class="text-sm text-gray-600">{{ order.event?.lugar || 'Ubicacion por confirmar' }}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Aprobada</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Tipo de entrada</p>
              <p class="text-base font-medium text-brand-negro">{{ order.product?.name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Comprador</p>
              <p class="text-base font-medium text-brand-negro">{{ authStore.currentUser?.name || 'Usuario' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Cantidad</p>
              <p class="text-base font-medium text-brand-negro">{{ order.quantity }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total</p>
              <p class="text-base font-medium text-brand-negro">{{ formatPrice(order.unit_price_ars * order.quantity) }}</p>
            </div>
          </div>

          <div class="pt-2">
            <p class="text-sm text-gray-500">Numero de orden</p>
            <p class="text-sm font-medium text-brand-negro">{{ order.mp_payment_id || order.id }}</p>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <router-link to="/perfil" class="bg-brand-camel text-white py-2 px-4 rounded-md hover:bg-opacity-90">Ver mis entradas</router-link>
          <router-link to="/eventos" class="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50">Volver a eventos</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

interface TicketOrder {
  id: number;
  quantity: number;
  unit_price_ars: number;
  status: string;
  mp_payment_id?: string | null;
  event?: { nombre: string; fecha: string; lugar?: string | null };
  product?: { name: string };
}

const route = useRoute();
const authStore = useAuthStore();

const order = ref<TicketOrder | null>(null);
const isLoading = ref(true);
const errorMessage = ref('');

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

const formatDate = (value?: string) => {
  if (!value) return '';
  return new Date(value.replace(/-/g, '/')).toLocaleString('es-AR');
};

const fetchOrder = async () => {
  const orderId = route.query.external_reference || route.query.order_id;
  if (!orderId) {
    errorMessage.value = 'No se encontro la orden.';
    return;
  }
  try {
    const response = await apiClient.get(`/api/ticket-orders/${orderId}`);
    order.value = response.data;
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'No se pudo cargar la orden.';
  }
};

onMounted(async () => {
  if (!authStore.currentUser && authStore.token) {
    await authStore.fetchUser();
  }
  await fetchOrder();
  isLoading.value = false;
});
</script>
