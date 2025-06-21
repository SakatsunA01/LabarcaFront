<template>
  <section
    class="relative w-full h-[calc(100vh-var(--navbar-height,80px))] md:h-[calc(100vh-var(--navbar-height,80px)-2rem)] overflow-hidden">
    <div class="relative h-full w-full" v-for="(slide, index) in slides" :key="slide.id" v-show="currentIndex === index"
      :aria-hidden="currentIndex !== index" role="tabpanel" :aria-labelledby="`slide-tab-${index}`">
      <img :src="slide.imageUrl" :alt="slide.altText"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        :class="{ 'opacity-100': currentIndex === index, 'opacity-0': currentIndex !== index }" />
      <div
        class="absolute inset-0 bg-brand-negro bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
        <h1 class="text-4xl md:text-6xl font-bold text-brand-gris-claro mb-4 drop-shadow-md">
          {{ slide.title }}
        </h1>
        <p class="text-xl md:text-2xl text-brand-gris-claro mb-8 max-w-2xl mx-auto drop-shadow-sm">
          {{ slide.subtitle }}
        </p>
        <button v-if="slide.buttonText && slide.buttonLink" @click="() => navegarConOverlay(slide.buttonLink!)"
          type="button"
          class="bg-brand-camel text-white py-3 px-8 rounded-md hover:bg-opacity-80 transition-colors text-lg font-medium shadow-lg">
          {{ slide.buttonText }}
        </button>
      </div>
    </div>

    <!-- Indicadores de Burbuja -->
    <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
      <button v-for="(slide, index) in slides" :key="`indicator-${slide.id}`" @click="goToSlide(index)"
        class="w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ease-in-out"
        :class="currentIndex === index ? 'bg-brand-camel scale-125' : 'bg-brand-gris-claro bg-opacity-50 hover:bg-opacity-75'"
        :aria-label="`Ir a la diapositiva ${index + 1}`" :id="`slide-tab-${index}`" role="tab"
        :aria-selected="currentIndex === index"></button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUiStore } from '@/stores/uiStore';

interface Slide {
  id: number;
  imageUrl: string;
  altText: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
}

const router = useRouter();
const uiStore = useUiStore();

const slides = ref<Slide[]>([
  {
    id: 1,
    imageUrl: 'https://placehold.co/1920x1080/234E4B/E2E2E2?text=LaBarca+Producciones',
    altText: 'Imagen inspiradora de LaBarca Producciones',
    title: 'LaBarca Producciones',
    subtitle: 'Conectando corazones a través de la música y eventos que inspiran.',
    buttonText: 'Ver Próximos Eventos',
    buttonLink: '/eventos',
  },
  {
    id: 2,
    imageUrl: 'https://placehold.co/1920x1080/5F0E1F/E2E2E2?text=Nuevos+Lanzamientos',
    altText: 'Nuevos lanzamientos musicales',
    title: 'Música que Transforma',
    subtitle: 'Descubre los últimos lanzamientos de nuestros artistas.',
    buttonText: 'Explorar Música',
    buttonLink: '/lanzamientos',
  },
  {
    id: 3,
    imageUrl: 'https://placehold.co/1920x1080/A18059/171C1E?text=Comunidad+Unida',
    altText: 'Comunidad unida en un evento',
    title: 'Eventos que Unen',
    subtitle: 'Vive experiencias inolvidables en nuestros conciertos y conferencias.',
    buttonText: 'Nuestros Artistas',
    buttonLink: '/artistas',
  },
]);

const currentIndex = ref(0);
let intervalId: number | undefined = undefined;

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

const navegarConOverlay = async (path: string) => {
  await uiStore.showLoadingOverlay();
  router.push(path);
};

onMounted(() => {
  // Ajusta la altura del carrusel basado en la altura del navbar si es necesario
  // document.documentElement.style.setProperty('--navbar-height', `${document.querySelector('nav')?.offsetHeight || 80}px`);
  intervalId = window.setInterval(nextSlide, 7000); // Cambia cada 7 segundos
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
