<template>
    <transition name="modal-fade">
        <div v-if="show" tabindex="-1"
            class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            @click.self="close">
            <div
                class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-4xl transform transition-all max-h-[90vh] flex flex-col">
                <h2 class="text-2xl font-bold text-brand-negro mb-6 flex-shrink-0">Testimonios de: {{ eventoNombre }}
                </h2>

                <div class="flex-grow overflow-y-auto">
                    <div v-if="isLoading" class="p-8 text-center text-gray-500">Cargando testimonios...</div>
                    <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
                    <div v-else-if="testimonials.length > 0" class="space-y-4">
                        <div v-for="testimonio in testimonials" :key="testimonio.id"
                            class="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex items-start justify-between">
                            <div class="flex-1">
                                <p class="text-gray-800 italic">"{{ testimonio.comentario }}"</p>
                                <p class="text-sm text-brand-camel mt-2 font-medium">
                                    - {{ testimonio.nombre_usuario || 'Usuario Anónimo' }}
                                    <span v-if="testimonio.usuario" class="text-gray-500">({{ testimonio.usuario.email
                                        }})</span>
                                </p>
                            </div>
                            <button @click="deleteTestimonial(testimonio.id)"
                                class="ml-4 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                                <TrashIcon class="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div v-else class="p-8 text-center text-gray-500">No hay testimonios para este evento.</div>
                </div>

                <div class="mt-8 flex justify-end flex-shrink-0">
                    <button type="button" @click="close"
                        class="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/authStore';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Testimonio {
    id: number;
    id_evento: number;
    comentario: string;
    nombre_usuario?: string;
    usuario?: User;
}

const props = defineProps<{
    show: boolean;
    eventoId: number | null;
    eventoNombre: string | null;
}>();

const emit = defineEmits(['close']);

const testimonials = ref<Testimonio[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const authStore = useAuthStore();

const API_URL = 'http://localhost:8000/api';

const fetchTestimonials = async () => {
    if (!props.eventoId) {
        testimonials.value = [];
        return;
    }
    isLoading.value = true;
    error.value = null;
    try {
        const response = await axios.get(`${API_URL}/eventos/${props.eventoId}/testimonios`);
        testimonials.value = response.data;
    } catch (err) {
        console.error("Error al cargar testimonios:", err);
        error.value = "No se pudieron cargar los testimonios.";
    } finally {
        isLoading.value = false;
    }
};

watch(() => props.show, (newVal) => {
    if (newVal && props.eventoId) {
        fetchTestimonials();
    }
});

const deleteTestimonial = async (testimonialId: number) => {
    if (!authStore.isAuthenticated) {
        alert('Debes estar autenticado para realizar esta acción.');
        return;
    }
    if (confirm('¿Estás seguro de que quieres eliminar este testimonio? Esta acción no se puede deshacer.')) {
        try {
            await axios.delete(`${API_URL}/testimonios-eventos/${testimonialId}`, {
                withCredentials: true // Importante para que el backend reciba la cookie de sesión
            });
            fetchTestimonials(); // Recargar la lista
        } catch (err: any) {
            console.error("Error al eliminar testimonio:", err);
            alert(err.response?.data?.message || 'No se pudo eliminar el testimonio.');
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
