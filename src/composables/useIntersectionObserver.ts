import { ref, onMounted, onUnmounted, type Ref } from 'vue';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export function useIntersectionObserver(
  target: Ref<Element | undefined>,
  options: IntersectionObserverOptions = { root: null, rootMargin: '0px', threshold: 0.1 }
) {
  const isIntersecting = ref(false);

  onMounted(() => {
    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting.value = entry.isIntersecting;
    }, options);

    if (target.value) {
      observer.observe(target.value);
    }

    onUnmounted(() => {
      if (target.value) {
        observer.unobserve(target.value);
      }
    });
  });

  return isIntersecting;
}
