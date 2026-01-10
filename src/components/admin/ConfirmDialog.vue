<template>
  <transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center" @click.self="$emit('update:show', false)">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="px-5 py-4 border-b">
          <h3 class="text-lg font-semibold text-brand-negro">{{ title }}</h3>
        </div>
        <div class="px-5 py-4 text-brand-negro">
          <p>{{ message }}</p>
        </div>
        <div class="px-5 py-4 border-t flex justify-end gap-3">
          <button class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50" @click="$emit('update:show', false)">{{ cancelText }}</button>
          <button class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700" @click="$emit('confirm')">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{ show: boolean; title?: string; message: string; confirmText?: string; cancelText?: string }>();
defineEmits(['update:show', 'confirm']);
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>

