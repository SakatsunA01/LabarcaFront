import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

export function useAnimateOnScroll(elementRef: Ref<Element | null>, options: IntersectionObserverOptions = {}) {
  const isVisible = ref(false);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        if (options.triggerOnce) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, options);

  onMounted(() => {
    if (elementRef.value) {
      observer.observe(elementRef.value);
    }
  });

  onUnmounted(() => {
    if (elementRef.value) {
      observer.unobserve(elementRef.value);
    }
  });

  return {
    isVisible,
  };
}
