<template>
    <transition name="modal-fade">
        <div v-if="show" tabindex="-1"
            class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            @click.self="close">
            <div
                class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all max-h-[90vh] overflow-y-auto">
                <h2 class="text-2xl font-bold text-brand-negro mb-6">{{ isEditing ? 'Editar' : 'Crear' }} Categoría</h2>
                <form @submit.prevent="handleSubmit">
                    <div class="space-y-6">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700">Nombre de la Categoría</label>
                            <input type="text" id="name" v-model="formData.name"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel" required>
                        </div>
                    </div>

                    <div v-if="errorMessage" class="mt-4 text-red-600 text-sm text-center p-2 bg-red-100 rounded-md">
                        {{ errorMessage }}
                    </div>

                    <!-- Botones de Acción -->
                    <div class="mt-8 flex justify-end space-x-4">
                        <button type="button" @click="close"
                            class="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="isLoading"
                            class="bg-brand-camel text-white py-2 px-6 rounded-md hover:bg-opacity-90 transition-all duration-300 font-medium disabled:opacity-60 flex items-center justify-center shadow-md hover:shadow-lg">
                            <span v-if="isLoading">Guardando...</span>
                            <span v-else>Guardar</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { createCategory, updateCategory, type Category, type CategoryData } from '@/services/categoryService';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps<{
    show: boolean;
    category: Category | null;
}>();

const emit = defineEmits(['close', 'save']);

const authStore = useAuthStore();

const defaultFormData = (): CategoryData => ({
    name: '',
});

const formData = ref(defaultFormData());
const isLoading = ref(false);
const errorMessage = ref('');

const isEditing = computed(() => !!props.category);

watch(() => props.show, (newVal) => {
    if (newVal) {
        errorMessage.value = '';
        if (props.category) {
            formData.value = { ...defaultFormData(), ...props.category };
        } else {
            formData.value = defaultFormData();
        }
    }
});

const handleSubmit = async () => {
    if (!authStore.token) {
        errorMessage.value = 'No estás autenticado. Por favor, inicia sesión de nuevo.';
        return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
        if (isEditing.value && props.category) {
            await updateCategory(props.category.id, formData.value, authStore.token);
        } else {
            await createCategory(formData.value, authStore.token);
        }
        emit('save');
        close();
    } catch (error: any) {
        console.error("Error al guardar categoría:", error);
        errorMessage.value = error.response?.data?.message || 'Ocurrió un error al guardar la categoría.';
    } finally {
        isLoading.value = false;
    }
};

const close = () => {
    emit('close');
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
