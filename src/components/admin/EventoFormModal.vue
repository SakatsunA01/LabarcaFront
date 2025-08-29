<template>
    <transition name="modal-fade">
        <div v-if="show" tabindex="-1"
            class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            @click.self="close">
            <div
                class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
                <h2 class="text-2xl font-bold text-brand-negro mb-6">{{ isEditing ? 'Editar' : 'Crear' }} Evento</h2>
                <form @submit.prevent="handleSubmit">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Columna 1: Información General -->
                        <div class="space-y-6">
                            <fieldset class="border p-4 rounded-md shadow-sm">
                                <legend class="text-lg font-semibold text-brand-negro px-2">Información del Evento
                                </legend>
                                <div class="space-y-4 mt-2">
                                    <div>
                                        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre <span
                                                class="text-red-500">*</span></label>
                                        <input type="text" id="nombre" v-model="formData.nombre" required
                                            placeholder="Nombre del evento"
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                                    </div>
                                    <div>
                                        <label for="fecha" class="block text-sm font-medium text-gray-700">Fecha y Hora
                                            <span class="text-red-500">*</span></label>
                                        <input type="datetime-local" id="fecha" v-model="formData.fecha" required
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                                    </div>
                                    <div>
                                        <label for="lugar" class="block text-sm font-medium text-gray-700">Lugar</label>
                                        <input type="text" id="lugar" v-model="formData.lugar"
                                            placeholder="Ubicación del evento"
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                                    </div>
                                    <div>
                                        <label for="descripcion"
                                            class="block text-sm font-medium text-gray-700">Descripción</label>
                                        <textarea id="descripcion" v-model="formData.descripcion" rows="4"
                                            placeholder="Detalles completos del evento"
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel"></textarea>
                                    </div>
                                    <div>
                                        <label for="link_compra" class="block text-sm font-medium text-gray-700">Link de
                                            Compra</label>
                                        <input type="url" id="link_compra" v-model="formData.link_compra"
                                            placeholder="URL para comprar entradas"
                                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-camel focus:border-brand-camel">
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <!-- Columna 2: Carga de Imagen -->
                        <div class="space-y-6">
                            <ImageUploader label="Imagen Principal del Evento" :initial-preview="formData.imagenUrl"
                                @file-change="file => handleFileChange(file, 'imagenUrl')" />
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
import { ref, watch, computed, defineAsyncComponent } from 'vue';
import axios from 'axios';

const ImageUploader = defineAsyncComponent(() => import('./ImageUploader.vue'));

interface Evento {
    id: number;
    nombre: string;
    fecha: string; // YYYY-MM-DDTHH:mm
    link_compra?: string | null;
    descripcion?: string | null;
    lugar?: string | null;
    imagenUrl?: string | null;
    [key: string]: any; // For other properties
}

const props = defineProps<{
    show: boolean;
    evento: Evento | null;
}>();

const emit = defineEmits(['close', 'save']);

const defaultFormData = {
    nombre: '',
    fecha: '', // YYYY-MM-DDTHH:mm format for datetime-local input
    link_compra: null,
    descripcion: null,
    lugar: null,
    imagenUrl: null,
};

const formData = ref({ ...defaultFormData });
const imageFiles = ref<{ [key: string]: File | null }>({
    imagenUrl: null,
});

const isLoading = ref(false);
const errorMessage = ref('');

const isEditing = computed(() => !!props.evento);
const API_URL = 'http://localhost:8000/api';

watch(() => props.show, (newVal) => {
    if (newVal) {
        errorMessage.value = '';
        if (props.evento) {
            // Format date for datetime-local input
            const date = new Date(props.evento.fecha);
            const formattedDate = date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
            formData.value = { ...defaultFormData, ...props.evento, fecha: formattedDate };
        } else {
            formData.value = { ...defaultFormData };
        }
        // Reset files
        imageFiles.value = { imagenUrl: null };
    }
});

const handleFileChange = (file: File | null, fieldName: string) => {
    imageFiles.value[fieldName] = file;
};

const handleSubmit = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    const submissionData = new FormData();
    Object.entries(formData.value).forEach(([key, value]) => {
        // Append non-null/undefined values
        if (value !== null && value !== undefined) {
            submissionData.append(key, value);
        }
    });
    // Append image file if present
    if (imageFiles.value.imagenUrl) {
        submissionData.append('imagenUrl', imageFiles.value.imagenUrl);
    } else if (isEditing.value && formData.value.imagenUrl === null) {
        // If editing and image was explicitly cleared (set to null in formData)
        submissionData.append('imagenUrl', ''); // Send empty string to indicate clearing
    }

    try {
        if (isEditing.value && props.evento) {
            submissionData.append('_method', 'PUT'); // Laravel expects POST for FormData with _method for PUT/PATCH
            await axios.post(`${API_URL}/eventos/${props.evento.id}`, submissionData);
        } else {
            await axios.post(`${API_URL}/eventos`, submissionData);
        }
        emit('save');
    } catch (error: any) {
        console.error("Error al guardar evento:", error);
        if (error.response && error.response.data) {
            const errors = error.response.data.errors || error.response.data;
            if (typeof errors === 'object' && errors !== null) {
                const firstErrorKey = Object.keys(errors)[0];
                errorMessage.value = errors[firstErrorKey]?.[0] || 'Error de validación desconocido.';
            } else {
                errorMessage.value = error.response.data.message || 'Ocurrió un error al guardar.';
            }
        } else {
            errorMessage.value = 'Ocurrió un error de red o del servidor.';
        }
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
