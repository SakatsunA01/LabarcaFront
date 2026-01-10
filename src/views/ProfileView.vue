<template>
  <div class="bg-gray-50 min-h-screen py-section-md px-4">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-2xl shadow-card border border-black/5 overflow-hidden">
        <div class="px-6 md:px-8 py-5 border-b border-black/5 flex items-center justify-between">
          <h1 class="font-playfair text-2xl md:text-3xl font-bold text-brand-negro">Mi Perfil</h1>
          <span v-if="authStore.isLoading" class="text-sm text-gray-500">Guardando…</span>
        </div>

        <form @submit.prevent="onSubmit" class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-brand-negro mb-1">Nombre</label>
            <input id="name" v-model="form.name" type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel" required />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-brand-negro mb-1">Correo electrónico</label>
            <input id="email" v-model="form.email" type="email" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel" required />
          </div>

          <div>
            <label for="birth_date" class="block text-sm font-medium text-brand-negro mb-1">Fecha de nacimiento</label>
            <input id="birth_date" v-model="form.birth_date" type="date" :max="maxBirthDate" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel bg-white" />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-brand-negro mb-1">Teléfono</label>
            <input id="phone" v-model="form.phone" type="tel" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel" />
          </div>

          <div class="md:col-span-2 flex items-center">
            <input id="belongs_to_church" v-model="form.belongs_to_church" type="checkbox" class="h-4 w-4 text-brand-camel focus:ring-brand-camel border-gray-300 rounded">
            <label for="belongs_to_church" class="ml-2 block text-sm text-gray-900">¿Perteneces a una iglesia?</label>
          </div>

          <div v-if="form.belongs_to_church" class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="church_name" class="block text-sm font-medium text-brand-negro mb-1">Nombre de la Iglesia</label>
              <input id="church_name" v-model="form.church_name" type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel" />
            </div>
            <div>
              <label for="pastor_name" class="block text-sm font-medium text-brand-negro mb-1">Nombre del Pastor</label>
              <input id="pastor_name" v-model="form.pastor_name" type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel" />
            </div>
          </div>

          <div class="md:col-span-2 pt-2">
            <h2 class="font-semibold text-brand-negro mb-2">Cambiar contraseña (opcional)</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="password" class="block text-sm font-medium text-brand-negro mb-1">Nueva contraseña</label>
                <input id="password" v-model="form.password" type="password" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel" />
              </div>
              <div>
                <label for="password_confirmation" class="block text-sm font-medium text-brand-negro mb-1">Confirmar contraseña</label>
                <input id="password_confirmation" v-model="form.password_confirmation" type="password" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel" />
              </div>
            </div>
          </div>

          <div v-if="error" class="md:col-span-2 text-red-600 text-sm bg-red-100 p-2 rounded">
            {{ error }}
          </div>

          <div class="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" @click="resetForm" class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Restablecer</button>
            <button type="submit" :disabled="authStore.isLoading" class="bg-brand-camel text-white py-2.5 px-5 rounded-md hover:bg-opacity-90 transition disabled:opacity-60">Guardar cambios</button>
          </div>
        </form>
      </div>

      <div class="bg-white rounded-2xl shadow-card border border-black/5 overflow-hidden mt-8">
        <div class="px-6 md:px-8 py-5 border-b border-black/5 flex items-center justify-between">
          <h2 class="font-playfair text-xl md:text-2xl font-bold text-brand-negro">Mis Entradas</h2>
          <span v-if="isLoadingOrders" class="text-sm text-gray-500">Cargando...</span>
        </div>
        <div class="p-6 md:p-8">
          <div v-if="orderError" class="text-red-600 text-sm bg-red-100 p-2 rounded">{{ orderError }}</div>
          <div v-else-if="orders.length === 0" class="text-sm text-gray-500">Todavia no tenes entradas compradas.</div>
          <div v-else class="space-y-4">
            <div
              v-for="orderItem in orders"
              :key="orderItem.id"
              class="border border-gray-200 rounded-xl p-4">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p class="text-sm text-gray-500">Evento</p>
                  <p class="text-lg font-semibold text-brand-negro">{{ orderItem.event?.nombre || 'Evento' }}</p>
                  <p class="text-sm text-gray-600">{{ formatDate(orderItem.event?.fecha) }}</p>
                  <p class="text-sm text-gray-600">{{ orderItem.event?.lugar || 'Ubicacion por confirmar' }}</p>
                </div>
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="orderItem.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'">
                  {{ orderItem.status === 'approved' ? 'Aprobada' : orderItem.status }}
                </span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div>
                  <p class="text-sm text-gray-500">Tipo de entrada</p>
                  <p class="text-base font-medium text-brand-negro">{{ orderItem.product?.name || 'Entrada' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Cantidad</p>
                  <p class="text-base font-medium text-brand-negro">{{ orderItem.quantity }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Total</p>
                  <p class="text-base font-medium text-brand-negro">{{ formatPrice(orderItem.unit_price_ars * orderItem.quantity) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Orden</p>
                  <p class="text-base font-medium text-brand-negro">{{ orderItem.mp_payment_id || orderItem.id }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import apiClient from '@/services/api';

const authStore = useAuthStore();
const uiStore = useUiStore();
const maxBirthDate = new Date().toISOString().split('T')[0];
const error = computed(() => authStore.error);

const form = reactive({
  name: '',
  email: '',
  birth_date: '',
  phone: '',
  belongs_to_church: false,
  church_name: '',
  pastor_name: '',
  password: '',
  password_confirmation: '',
});

interface TicketOrder {
  id: number;
  quantity: number;
  unit_price_ars: number;
  status: string;
  mp_payment_id?: string | null;
  event?: { nombre: string; fecha: string; lugar?: string | null };
  product?: { name: string };
}

const orders = ref<TicketOrder[]>([]);
const isLoadingOrders = ref(false);
const orderError = ref('');

const fillFromUser = () => {
  const u = authStore.currentUser;
  if (!u) return;
  form.name = u.name || '';
  form.email = u.email || '';
  // @ts-ignore
  form.birth_date = (u.birth_date as string) || '';
  // @ts-ignore
  form.phone = (u.phone as string) || '';
  // @ts-ignore
  form.belongs_to_church = Boolean(u.belongs_to_church);
  // @ts-ignore
  form.church_name = (u.church_name as string) || '';
  // @ts-ignore
  form.pastor_name = (u.pastor_name as string) || '';
};

onMounted(async () => {
  if (!authStore.currentUser && authStore.token) {
    await authStore.fetchUser();
  }
  fillFromUser();
  await fetchOrders();
});

const fetchOrders = async () => {
  isLoadingOrders.value = true;
  orderError.value = '';
  try {
    const response = await apiClient.get('/api/ticket-orders');
    orders.value = response.data;
  } catch (error: any) {
    orderError.value = error.response?.data?.message || 'No se pudieron cargar las entradas.';
  } finally {
    isLoadingOrders.value = false;
  }
};

const resetForm = () => {
  fillFromUser();
  form.password = '';
  form.password_confirmation = '';
};

const onSubmit = async () => {
  // Validaciones básicas
  if (!form.name.trim()) {
    uiStore.showSnackbar('El nombre es obligatorio.', 'error');
    return;
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  if (!emailOk) {
    uiStore.showSnackbar('Ingresa un correo electrónico válido.', 'error');
    return;
  }
  if (form.birth_date && form.birth_date > maxBirthDate) {
    uiStore.showSnackbar('La fecha de nacimiento no puede ser futura.', 'error');
    return;
  }
  if (form.password && form.password.length < 6) {
    uiStore.showSnackbar('La contraseña debe tener al menos 6 caracteres.', 'error');
    return;
  }
  if (form.password && form.password !== form.password_confirmation) {
    uiStore.showSnackbar('Las contraseñas no coinciden.', 'error');
    return;
  }
  const payload: any = {
    name: form.name,
    email: form.email,
    birth_date: form.birth_date || null,
    phone: form.phone || null,
    belongs_to_church: form.belongs_to_church,
    church_name: form.belongs_to_church ? form.church_name : null,
    pastor_name: form.belongs_to_church ? form.pastor_name : null,
  };
  if (form.password) {
    payload.password = form.password;
    payload.password_confirmation = form.password_confirmation;
  }
  try {
    await authStore.updateProfile(payload);
    uiStore.showSnackbar('Perfil actualizado con éxito.', 'success');
    resetForm();
  } catch (e: any) {
    const msg = e?.response?.data?.message || 'No se pudo actualizar el perfil.';
    uiStore.showSnackbar(msg, 'error');
  }
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

const formatDate = (value?: string) => {
  if (!value) return '';
  return new Date(value.replace(/-/g, '/')).toLocaleString('es-AR');
};
</script>

<style scoped>
</style>
