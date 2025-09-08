<template>
    <div class="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h3 class="text-2xl font-bold text-brand-negro mb-4">Deja un Comentario</h3>
        <div v-if="!authStore.isAuthenticated" class="text-center text-gray-600">
            <p>Por favor, <router-link :to="{ name: 'home' }" class="text-brand-camel hover:underline">inicia sesión</router-link> para dejar un comentario.</p>
        </div>
        <form v-else @submit.prevent="handleSubmit">
            <textarea
v-model="commentBody" rows="4" placeholder="Escribe tu comentario aquí..."
                class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-camel focus:border-brand-camel mb-4"
                required></textarea>
            <div v-if="errorMessage" class="text-red-600 text-sm mb-4">{{ errorMessage }}</div>
            <button type="submit" :disabled="isLoading" class="bg-brand-camel text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
                {{ isLoading ? 'Enviando...' : 'Enviar Comentario' }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { addComment } from '@/services/postService';

const props = defineProps<{
    postId: number;
}>();

const emit = defineEmits(['comment-added']);

const authStore = useAuthStore();
const commentBody = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
    if (!commentBody.value.trim()) {
        errorMessage.value = 'El comentario no puede estar vacío.';
        return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
        await addComment(props.postId, commentBody.value, authStore.token!);
        commentBody.value = ''; // Clear the textarea
        emit('comment-added');
    } catch (error: any) {
        console.error('Error adding comment:', error);
        errorMessage.value = error.response?.data?.message || 'Ocurrió un error al añadir el comentario.';
    } finally {
        isLoading.value = false;
    }
};
</script>
