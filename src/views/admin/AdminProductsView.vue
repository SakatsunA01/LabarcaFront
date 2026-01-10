<template>
  <div class="admin-products-view p-4">
    <h1 class="text-2xl font-bold mb-4">Gestion de Entradas</h1>

    <div class="mb-4 flex justify-end">
      <button
        class="bg-brand-camel text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
        @click="openCreateModal">
        Crear Entrada
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-camel"></div>
      <p class="mt-4 text-brand-negro">Cargando entradas...</p>
    </div>

    <div v-else-if="products.length > 0" class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ product.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatPrice(product.price_ars) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ product.stock }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'">
                {{ product.is_active ? 'Activa' : 'Inactiva' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <img
                v-if="product.image_url"
                :src="`${API_BASE_URL}${product.image_url}`"
                alt="Entrada"
                class="h-10 w-10 object-cover rounded-full">
              <span v-else>Sin imagen</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-brand-camel hover:text-brand-borgona mr-3" @click="openEditModal(product)">Editar</button>
              <button class="text-red-600 hover:text-red-900" @click="deleteProduct(product.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center py-10 bg-white shadow-md rounded-lg">
      <p class="text-lg text-gray-600">No hay entradas registradas.</p>
    </div>

    <ProductFormModal :show="showModal" :product="selectedProduct" @close="closeModal" @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProductFormModal from '@/components/admin/ProductFormModal.vue';

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price_ars: number;
  stock: number;
  image_url?: string | null;
  is_active: boolean;
}

const products = ref<Product[]>([]);
const isLoading = ref(true);
const showModal = ref(false);
const selectedProduct = ref<Product | null>(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api`;

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/products`);
    products.value = response.data;
  } catch (error) {
    console.error('Error al cargar entradas:', error);
  } finally {
    isLoading.value = false;
  }
};

const openCreateModal = () => {
  selectedProduct.value = null;
  showModal.value = true;
};

const openEditModal = (product: Product) => {
  selectedProduct.value = product;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedProduct.value = null;
};

const handleSave = () => {
  closeModal();
  fetchProducts();
};

const deleteProduct = async (id: number) => {
  if (confirm('Estas seguro de que quieres eliminar esta entrada?')) {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error al eliminar entrada:', error);
      alert('Hubo un error al eliminar la entrada.');
    }
  }
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

onMounted(fetchProducts);
</script>
