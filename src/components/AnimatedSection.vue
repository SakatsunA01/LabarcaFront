<template>
  <div ref="element" :class="['transition-all duration-700 ease-out', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAnimateOnScroll } from '@/composables/useAnimateOnScroll';

const element = ref<Element | null>(null);
const { isVisible } = useAnimateOnScroll(element, { threshold: 0.1, triggerOnce: true });
</script>
