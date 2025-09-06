<template>
    <div class="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
        <div class="flex items-center justify-between mb-2">
            <p class="font-semibold text-brand-negro">{{ comment.user.name }}</p>
            <span class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</span>
        </div>
        <p class="text-gray-700 mb-3">{{ comment.body }}</p>
        <div v-if="authStore.isAuthenticated && authStore.user?.id === comment.user_id" class="text-right">
            <button @click="emit('delete', comment.id)" class="text-red-600 hover:text-red-800 text-sm">Eliminar</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import type { Comment } from '@/services/postService';

const props = defineProps<{
    comment: Comment;
}>();

const emit = defineEmits(['delete']);

const authStore = useAuthStore();

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};
</script>
