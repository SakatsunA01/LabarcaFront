<template>
    <div class="mt-8">
        <h3 class="text-2xl font-bold text-brand-negro mb-4">Comentarios ({{ comments.length }})</h3>
        <div v-if="comments.length === 0" class="text-gray-600">
            <p>Sé el primero en comentar esta historia.</p>
        </div>
        <div v-else>
            <CommentItem 
                v-for="comment in comments" 
                :key="comment.id" 
                :comment="comment"
                @delete="(commentId) => emit('delete-comment', commentId)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Comment } from '@/services/postService';
import CommentItem from './CommentItem.vue';

const props = defineProps<{
    comments: Comment[];
}>();

const emit = defineEmits(['delete-comment']);
</script>
