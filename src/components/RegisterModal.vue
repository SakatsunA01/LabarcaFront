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
                <h2 class="text-2xl font-bold text-brand-negro text-center mb-6">Crear Cuenta</h2>
                <form @submit.prevent="handleRegister">
                    <div class="mb-4">
                        <label for="name" class="block text-sm font-medium text-brand-negro mb-1">Nombre</label>
                        <input
id="name" v-model="name" type="text"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow"
                            required />
                    </div>
                    <div class="mb-4">
                        <label for="email-reg" class="block text-sm font-medium text-brand-negro mb-1">Correo Electrónico</label>
                        <input
id="email-reg" v-model="email" type="email"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow"
                            required />
                    </div>
                    <div class="mb-4">
                        <label for="phone" class="block text-sm font-medium text-brand-negro mb-1">Teléfono</label>
                        <input
id="phone" v-model="phone" type="tel"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow"
                            required />
                    </div>
                    <div class="mb-4 flex items-center">
                        <input
id="belongs_to_church" v-model="belongs_to_church" type="checkbox"
                            class="h-4 w-4 text-brand-camel focus:ring-brand-camel border-gray-300 rounded">
                        <label for="belongs_to_church" class="ml-2 block text-sm text-gray-900">¿Perteneces a una iglesia?</label>
                    </div>
                    <div v-if="belongs_to_church">
                        <div class="mb-4">
                            <label for="church_name" class="block text-sm font-medium text-brand-negro mb-1">Nombre de la Iglesia</label>
                            <input
id="church_name" v-model="church_name" type="text"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow"
                                :required="belongs_to_church" />
                        </div>
                        <div class="mb-4">
                            <label for="pastor_name" class="block text-sm font-medium text-brand-negro mb-1">Nombre del Pastor</label>
                            <input
id="pastor_name" v-model="pastor_name" type="text"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow"
                                :required="belongs_to_church" />
                        </div>
                    </div>
                    <div class="mb-4">
                        <label for="password-reg" class="block text-sm font-medium text-brand-negro mb-1">Contraseña</label>
                        <input
id="password-reg" v-model="password" type="password"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow"
                            required />
                    </div>
                    <div class="mb-6">
                        <label for="password-confirm" class="block text-sm font-medium text-brand-negro mb-1">Confirmar Contraseña</label>
                        <input
id="password-confirm" v-model="password_confirmation" type="password"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-camel focus:border-brand-camel transition-shadow"
                            required />
                    </div>
                    <div v-if="errorMessage" class="mb-4 text-red-600 text-sm text-center p-2 bg-red-100 rounded-md">
                        {{ errorMessage }}
                    </div>
                    <button
type="submit" :disabled="isLoading"
                        class="w-full bg-brand-camel text-white py-3 px-4 rounded-md hover:bg-opacity-90 transition-all duration-300 font-medium disabled:opacity-60 flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-camel focus:ring-offset-2">
                        <span v-if="isLoading" class="animate-pulse">Creando cuenta...</span>
                        <span v-else>Registrarse</span>
                    </button>
                </form>
                <div class="mt-6 text-center text-sm">
                    <span class="text-gray-600">¿Ya tienes cuenta? </span>
                    <button class="text-brand-borgona hover:underline" @click="switchToLogin">Inicia Sesión</button>
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

const emit = defineEmits(['close', 'registration-success']);

const name = ref('');
const email = ref('');
const phone = ref('');
const belongs_to_church = ref(false);
const church_name = ref('');
const pastor_name = ref('');
const password = ref('');
const password_confirmation = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();
const uiStore = useUiStore();

const handleRegister = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    if (password.value !== password_confirmation.value) {
        errorMessage.value = 'Las contraseñas no coinciden.';
        isLoading.value = false;
        return;
    }
    try {
        await authStore.register({
            name: name.value,
            email: email.value,
            phone: phone.value,
            belongs_to_church: belongs_to_church.value,
            church_name: church_name.value,
            pastor_name: pastor_name.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
        });
        // Si el registro es exitoso, emitimos el evento de éxito
        closeModal();
        emit('registration-success');
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Ocurrió un error en el registro.';
    } finally {
        isLoading.value = false;
    }
};

const closeModal = () => {
    uiStore.setShowRegisterModal(false);
    emit('close');
};

const switchToLogin = () => {
    uiStore.setShowRegisterModal(false);
    uiStore.setShowLoginModal(true);
};
</script>

<style scoped>
/* Estilos de transición idénticos a LoginModal.vue */
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