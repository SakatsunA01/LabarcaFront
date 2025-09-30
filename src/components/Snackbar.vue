<template>
  <transition name="snackbar-fade">
    <div v-if="visible" :class="['snackbar', `snackbar--${type}`]">
      <p>{{ message }}</p>
      <button @click="hide" class="snackbar__close">&times;</button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String as () => 'success' | 'error' | 'info',
    default: 'info',
  },
});

const emit = defineEmits(['update:visible']);

const hide = () => {
  emit('update:visible', false);
};
</script>

<style scoped>
.snackbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 24px;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.snackbar--success {
  background-color: #4CAF50; /* Verde */
}

.snackbar--error {
  background-color: #F44336; /* Rojo */
}

.snackbar--info {
  background-color: #2196F3; /* Azul */
}

.snackbar__close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  margin-left: 16px;
  cursor: pointer;
  line-height: 1;
}

.snackbar-fade-enter-active,
.snackbar-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.snackbar-fade-enter-from,
.snackbar-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
