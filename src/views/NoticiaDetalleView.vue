<template>
  <div class="bg-brand-gris-claro min-h-screen">
    <div v-if="article" class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

      <!-- Botón para volver -->
      <router-link
to="/"
        class="inline-flex items-center text-brand-camel hover:text-brand-borgona mb-8 font-inter font-semibold group">
        <svg
class="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none"
          stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Volver a Inicio
      </router-link>

      <!-- Título y categoría -->
      <div class="text-center mb-8">
        <span class="inline-block bg-brand-borgona text-white text-sm font-semibold px-3 py-1 rounded-md mb-4">{{
          article.category }}</span>
        <h1 class="text-4xl md:text-5xl font-bold font-playfair text-brand-negro">{{ article.title }}</h1>
        <p class="text-lg text-brand-camel mt-4 font-inter">Publicado el {{ article.date }}</p>
      </div>

      <!-- Imagen destacada -->
      <div class="w-full h-96 rounded-lg overflow-hidden shadow-lg mb-12">
        <img :src="article.imageUrl" :alt="article.title" class="w-full h-full object-cover">
      </div>

      <!-- Contenido del artículo -->
      <div class="prose prose-lg max-w-none font-inter text-brand-negro leading-relaxed">
        <p v-for="(paragraph, index) in article.content" :key="index" class="mb-6">{{ paragraph }}</p>
      </div>

    </div>
    <div v-else class="text-center py-20">
      <p class="text-brand-negro font-inter">Artículo no encontrado.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// Mock data - en una app real, esto vendría de una store o API
const articles = ref([
  {
    slug: 'la-historia-detras-de-tu-paz',
    title: "La historia detrás de nuestra nueva canción: 'Tu Paz'",
    category: 'Noticia',
    date: '10 de Agosto, 2025',
    imageUrl: 'https://www.bibliatodo.com/NoticiasCristianas/wp-content/uploads/2025/08/mas-de-40-personas-entregan-sus-vidas-a-jesus-y-se-bautizan-en-calle-concurrida-de-nueva-york.jpg',
    content: [
      "Una reciente jornada de fe en Nueva York impactó a toda la ciudad cuando 46 personas fueron bautizadas públicamente en la calle 24 de Midtown Manhattan. El evento fue promovido por la Movement Church, que instaló una piscina improvisada en medio de una de las ciudades más emblemáticas del mundo, marcando un poderoso testimonio cristiano a cielo abierto.",
      "El día 29 de junio, decenas de creyentes y nuevos convertidos se reunieron para celebrar el bautismo y la transformación de vidas bajo la misión de cumplir la Gran Comisión de Jesucristo. La ceremonia fue acompañada de alabanzas, oración y la predicación del Evangelio, atrayendo la mirada de peatones y vecinos.", "Según compartió Movement Church en sus redes sociales, cada bautismo fue una declaración valiente de fe y entrega a Jesús, reflejando el poder de Dios para cambiar corazones en pleno corazón urbano. La iglesia expresó: “Toda la gloria a Dios. Jesús está vivo. Él todavía transforma vidas”.", "Entre los testimonios, una joven afirmó: “Dar al Señor mi ‘sí’ fue la mejor decisión que ya tomé, y estoy emocionada de ver cómo otros experimentan el gozo y la presencia del Espíritu Santo”. Otra mujer enfatizó la urgencia de predicar fuera de los templos: “Los cristianos deben salir de sus iglesias, el mundo está perdido porque la Iglesia dejó de buscar almas. Hay que predicar con audacia y sin miedo”.", "El evento fue más que simbólico; representó un llamado a la iglesia a salir de su zona de confort, inspirando a otros creyentes a compartir el Evangelio en las calles y llevar el mensaje de esperanza donde la gente realmente lo necesita.", ""
    ]
  },
  {
    slug: 'entrevista-salmistas-unidos',
    title: "Entrevista a Salmistas Unidos: Adoración en tiempos difíciles",
    category: 'Testimonio',
    date: '5 de Agosto, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1517230878791-4d28214057c2?q=80&w=2070&auto=format&fit=crop',
    content: [
      "Este es el contenido de la entrevista. Hablamos sobre la importancia de la adoración y cómo mantener la fe en momentos de prueba.",
      "Fue una conversación muy profunda y esperamos que sea de bendición para todos los que la lean."
    ]
  },
  {
    slug: 'resumen-ultimo-evento',
    title: "Resumen de nuestro último evento: una noche inolvidable",
    category: 'Eventos',
    date: '1 de Agosto, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1974&auto=format&fit=crop',
    content: [
      "La noche del pasado sábado fue simplemente espectacular. Cientos de voces unidas en una sola adoración, un ambiente cargado de la presencia de Dios.",
      "Aquí te compartimos algunos de los momentos más especiales y testimonios de lo que Dios hizo."
    ]
  }
]);

const route = useRoute();
const article = computed(() => {
  return articles.value.find(a => a.slug === route.params.slug);
});

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<style scoped>
/* Para estilizar el contenido del artículo si viniera de un CMS como Markdown */
.prose :deep(h2) {
  @apply text-3xl font-playfair text-brand-borgona mt-12 mb-4;
}

.prose :deep(p) {
  @apply mb-6;
}

.prose :deep(a) {
  @apply text-brand-camel hover:text-brand-borgona;
}
</style>
