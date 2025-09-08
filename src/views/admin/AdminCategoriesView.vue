<template>
    <div class="p-6 md:p-8">
        <h1 class="text-3xl font-bold text-brand-negro mb-6">Gestión de Categorías</h1>

        <div class="flex justify-end mb-6">
            <button class="bg-brand-camel text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors" @click="openModal(null)">
                Crear Nueva Categoría
            </button>
        </div>

        <!-- Tabla de Categorías -->
        <div class="bg-white rounded-lg shadow-md overflow-x-auto">
            <table class="w-full table-auto">
                <thead class="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                    <tr>
                        <th class="p-4">ID</th>
                        <th class="p-4">Nombre</th>
                        <th class="p-4">Slug</th>
                        <th class="p-4">Acciones</th>
                    </tr>
                </thead>
                <tbody v-if="!isLoading">
                    <tr v-for="category in categories" :key="category.id" class="border-b hover:bg-gray-50">
                        <td class="p-4">{{ category.id }}</td>
                        <td class="p-4">{{ category.name }}</td>
                        <td class="p-4">{{ category.slug }}</td>
                        <td class="p-4 flex items-center space-x-2">
                            <button class="text-blue-600 hover:text-blue-800" @click="openModal(category)">Editar</button>
                            <button class="text-red-600 hover:text-red-800" @click="handleDelete(category)">Eliminar</button>
                        </td>
                    </tr>
                    <tr v-if="categories.length === 0">
                        <td colspan="4" class="p-4 text-center text-gray-500">No hay categorías para mostrar.</td>
                    </tr>
                </tbody>
            </table>
             <div v-if="isLoading" class="p-4 text-center">Cargando...</div>
             <div v-if="error" class="p-4 text-center text-red-500">{{ error }}</div>
        </div>

        <!-- Modal para Crear/Editar -->
        <CategoryFormModal 
            :show="isModalOpen"
            :category="selectedCategory"
            @close="closeModal"
            @save="handleSave"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { getCategories, deleteCategory, type Category, type CategoryData } from '@/services/categoryService';
import { useAuthStore } from '@/stores/authStore';

const CategoryFormModal = defineAsyncComponent(() => import('@/components/admin/CategoryFormModal.vue'));

const categories = ref<Category[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const authStore = useAuthStore();

const isModalOpen = ref(false);
const selectedCategory = ref<Category | null>(null);

const fetchCategories = async () => {
    try {
        isLoading.value = true;
        categories.value = await getCategories();
    } catch (err) {
        console.error('Error al cargar categorías:', err);
        error.value = 'No se pudieron cargar las categorías.';
    } finally {
        isLoading.value = false;
    }
};

const openModal = (category: Category | null) => {
    selectedCategory.value = category;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedCategory.value = null;
};

const handleSave = () => {
    closeModal();
    fetchCategories(); // Recargar la lista de categorías
};

const handleDelete = async (category: Category) => {
    if (!authStore.token) {
        alert('No estás autenticado. Por favor, inicia sesión de nuevo.');
        return;
    }
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`)) {
        try {
            await deleteCategory(category.id, authStore.token);
            fetchCategories();
        } catch (err) {
            alert('Error al eliminar la categoría.');
        }
    }
};

onMounted(() => {
    fetchCategories();
});
</script>