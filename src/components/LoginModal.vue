<template>
    <transition name="modal-fade">
        <div
v-if="show"
            class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            @click.self="closeModal">
            <div class="bg-brand-gris-claro p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                <button
class="absolute top-4 right-4 text-gray-400 hover:text-brand-negro transition-colors"
                    @click="closeModal">
                    <XMarkIcon class="h-6 w-6" />
                </button>
                <h2 class="text-2xl font-bold text-brand-negro text-center mb-6">Iniciar Sesión</h2>
                <form @submit.prevent="handleLogin">
                    <div class="mb-4">
                        <label for="email" class="block text-sm font-medium text-brand-negro mb-1">Correo
                            Electrónico</label>
                        <input
id="email" v-model="email" type="email"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow"
                            required />
                    </div>
                    <div class="mb-6">
                        <label for="password" class="block text-sm font-medium text-brand-negro mb-1">Contraseña</label>
                        <input
id="password" v-model="password" type="password"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow"
                            required />
                    </div>
                    <div v-if="errorMessage" class="mb-4 text-red-600 text-sm text-center p-2 bg-red-100 rounded-md">
                        {{ errorMessage }}
                    </div>
                    <button
type="submit" :disabled="isLoading"
                        class="w-full bg-brand-camel text-white py-3 px-4 rounded-md hover:bg-opacity-90 transition-all duration-300 font-medium disabled:opacity-60 flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-camel focus:ring-offset-2">
                        <span v-if="isLoading" class="animate-pulse">Procesando...</span>
                        <span v-else>Iniciar Sesión</span>
                    </button>
                </form>
                <div class="mt-6 text-center text-sm">
                    <a href="#" class="text-brand-verde-oscuro hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
                <div class="mt-2 text-center text-sm">
                    <span class="text-gray-600">¿No tienes cuenta? </span>
                    <button class="text-brand-borgona hover:underline" @click="switchToRegister">Regístrate</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';

defineProps<{
    show: boolean;
}>();

const emit = defineEmits(['close']);

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();
const uiStore = useUiStore();

const handleLogin = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
        await authStore.login({ email: email.value, password: password.value });
        // Si el login es exitoso en el store, cerramos el modal
        if (authStore.isAuthenticated) {
            closeModal();
        } else {
            // Esto podría ser manejado por el store si lanza un error específico
            errorMessage.value = authStore.error || 'Credenciales incorrectas. Intenta de nuevo.';
        }
    } catch (error: any) {
        // The authStore already sets and logs the error. We just need to display it.
        errorMessage.value = authStore.error || 'Ocurrió un error al iniciar sesión.';
    } finally {
        isLoading.value = false;
    }
};

const closeModal = () => {
    uiStore.setShowLoginModal(false); // Usamos el store para cerrar
    emit('close'); // También emitimos por si el padre necesita saber
};

const switchToRegister = () => {
    uiStore.setShowLoginModal(false);
    uiStore.setShowRegisterModal(true);
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease-out;
}

.modal-fade-enter-active .transform,
.modal-fade-leave-active .transform {
    transition: transform 0.3s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-from .transform,
.modal-fade-leave-to .transform {
    transform: scale(0.95) translateY(-20px);
}

.modal-fade-enter-to,
.modal-fade-leave-from {
    opacity: 1;
}

.modal-fade-enter-to .transform,
.modal-fade-leave-from .transform {
    transform: scale(1) translateY(0);
}
</style>
