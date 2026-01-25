<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-brand-negro bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div v-if="user" class="bg-brand-gris-claro p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
        <button
          class="absolute top-4 right-4 text-gray-400 hover:text-brand-negro transition-colors"
          @click="closeModal"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
        <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <UserIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Detalles del Usuario</h3>
                <div class="mt-4 space-y-4 text-sm">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                            <p class="font-medium text-gray-500">Nombre</p>
                            <p class="text-gray-900">{{ user.name }}</p>
                        </div>
                        <div>
                            <p class="font-medium text-gray-500">Email</p>
                            <p class="text-gray-900">{{ user.email }}</p>
                        </div>
                        <div>
                            <p class="font-medium text-gray-500">Teléfono</p>
                            <p class="text-gray-900">{{ user.phone || 'No especificado' }}</p>
                        </div>
                        <div>
                            <p class="font-medium text-gray-500">Miembro desde</p>
                            <p class="text-gray-900">{{ formatMemberSince(user.created_at) }}</p>
                        </div>
                    </div>
                    <div class="border-t pt-4 mt-4">
                        <p class="font-medium text-gray-500 mb-2">Información de Iglesia</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                             <div>
                                <p class="font-medium text-gray-500">¿Asiste a una iglesia?</p>
                                <p class="text-gray-900">{{ user.belongs_to_church ? 'Sí' : 'No' }}</p>
                            </div>
                            <div v-if="user.belongs_to_church">
                                <p class="font-medium text-gray-500">Nombre de la iglesia</p>
                                <p class="text-gray-900">{{ user.church_name || 'No especificado' }}</p>
                            </div>
                            <div v-if="user.belongs_to_church">
                                <p class="font-medium text-gray-500">Nombre del pastor</p>
                                <p class="text-gray-900">{{ user.pastor_name || 'No especificado' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-6 text-right">
            <button type="button" class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-camel focus:ring-offset-2" @click="closeModal">Cerrar</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">

import type { PropType } from 'vue';
import { UserIcon, XMarkIcon } from '@heroicons/vue/24/outline';

interface UserDetails {
  id: number;
  name: string;
  email: string;
  phone?: string;
  belongs_to_church: boolean;
  church_name?: string;
  pastor_name?: string;
  created_at: string;
}

defineProps({
  show: Boolean,
  user: { 
      type: Object as PropType<UserDetails | null>,
      default: null 
    },
});

const emit = defineEmits(['close']);

const formatMemberSince = (value: string) => {
  const date = new Date(value.replace(/-/g, '/'));
  return date.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
};

const closeModal = () => {
  emit('close');
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
