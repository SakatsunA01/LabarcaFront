<template>
    <transition name="modal-fade">
        <div
v-if="show" tabindex="-1"
            class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            @click.self="close">
            <div
                class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-4xl transform transition-all max-h-[90vh] overflow-y-auto">
                <h2 class="text-2xl font-bold text-brand-negro mb-6">Galería de Evento: {{ eventoNombre }}</h2>

                <div class="flex justify-end mb-4">
                    <button
class="bg-brand-verde-oscuro text-white py-2 px-5 rounded-md hover:bg-opacity-80 transition-colors font-medium flex items-center"
                        @click="openCreateImageModal">
                        <PlusIcon class="h-5 w-5 mr-2" />
                        Añadir Imagen
                    </button>
                </div>

                <div v-if="isLoading" class="p-8 text-center text-gray-500">Cargando imágenes...</div>
                <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
                <div v-else-if="galleryImages.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div
v-for="image in galleryImages" :key="image.id"
                        class="relative group bg-gray-100 rounded-lg overflow-hidden shadow-md">
                        <img
:src="`${API_BASE_URL}${image.url_imagen}`" :alt="image.descripcion || 'Imagen de galería'"
                            class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div
                            class="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p class="text-sm font-medium truncate">{{ image.descripcion || 'Sin descripción' }}</p>
                            <div class="flex justify-end space-x-2 mt-2">
                                <button
class="text-brand-camel hover:text-brand-borgona text-sm"
                                    @click="openEditImageModal(image)">Editar</button>
                                <button
class="text-red-500 hover:text-red-700 text-sm"
                                    @click="deleteImage(image.id)">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="p-8 text-center text-gray-500">No hay imágenes en esta galería.</div>

                <div class="mt-8 flex justify-end">
                    <button
type="button" class="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                        @click="close">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </transition>

    <!-- Modal para Crear/Editar Imagen de Galería -->
    <GaleriaImageFormModal
:show="isImageFormModalOpen" :evento-id="eventoId" :image="selectedImage"
        @close="closeImageFormModal" @save="handleImageSave" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';
import { PlusIcon } from '@heroicons/vue/24/outline';
import GaleriaImageFormModal from './GaleriaImageFormModal.vue';

interface GaleriaImage {
    id: number;
    id_evento: number;
    url_imagen: string;
    descripcion?: string;
}

const props = defineProps<{
    show: boolean;
    eventoId: number | null;
    eventoNombre: string | null;
}>();

const emit = defineEmits(['close']);

const galleryImages = ref<GaleriaImage[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const isImageFormModalOpen = ref(false);
const selectedImage = ref<GaleriaImage | null>(null);

const API_URL = 'https://api.labarcaministerio.com';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchGalleryImages = async () => {
    if (!props.eventoId) {
        galleryImages.value = [];
        return;
    }
    isLoading.value = true;
    error.value = null;
    try {
        const response = await axios.get(`${API_URL}/eventos/${props.eventoId}/galeria`);
        galleryImages.value = response.data;
    } catch (err) {
        console.error("Error al cargar imágenes de la galería:", err);
        error.value = "No se pudieron cargar las imágenes de la galería.";
    } finally {
        isLoading.value = false;
    }
};

watch(() => props.show, (newVal) => {
    if (newVal && props.eventoId) {
        fetchGalleryImages();
    }
});

const openCreateImageModal = () => {
    selectedImage.value = null;
    isImageFormModalOpen.value = true;
};

const openEditImageModal = (image: GaleriaImage) => {
    selectedImage.value = image;
    isImageFormModalOpen.value = true;
};

const closeImageFormModal = () => {
    isImageFormModalOpen.value = false;
    selectedImage.value = null;
};

const handleImageSave = () => {
    fetchGalleryImages(); // Recargar las imágenes después de guardar
    closeImageFormModal();
};

const deleteImage = async (imageId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen de la galería?')) {
        try {
            await axios.delete(`${API_URL}/galerias-eventos/${imageId}`);
            fetchGalleryImages(); // Recargar la lista
        } catch (err) {
            console.error("Error al eliminar imagen:", err);
            alert('No se pudo eliminar la imagen.');
        }
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
