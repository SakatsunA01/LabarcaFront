<template>
  <div
    :id="`story-template-${post.id}`"
    class="story-template-container"
    :class="{ 'preview-mode': preview }"
  >
    <div class="story-template" :class="{ 'has-image': !!post.url_imagen }">

      <!-- 1. Encabezado -->
      <header class="header">
        <img src="@/assets/LA BARCA music 3.svg" alt="Logo La Barca Music" class="logo" />
      </header>

      <!-- 2. Contenido Principal -->
      <main class="main-content" :class="{ 'no-image': !post.url_imagen }">
        <div class="visual-block">
          <div class="image-container">
            <img v-if="isImageLoaded" :src="imageAsDataUrl" alt="Post Image" class="main-image" @load="handleImageLoad" />
            <div class="overlay"></div>

            <!-- Texto sobre la imagen -->
            <div class="overlay-text" ref="textContainer">
              <h1 class="title">{{ post.titulo }}</h1>
              <p class="content" ref="contentText">{{ strippedContent }}</p>
            </div>
          </div>

          <!-- VersiÃ³n sin imagen -->
          <div v-if="false" class="no-image-background text-only">
            <h1 class="title">{{ post.titulo }}</h1>
            <p class="content" ref="contentText">{{ strippedContent }}</p>
          </div>
        </div>

        <!-- Pie -->
        <footer class="footer">
          <div class="footer-pill">
            <span class="author">{{ post.autor }}</span>
            <span class="separator">|</span>
            <span class="date">{{ formatDate(post.fecha_publicacion) }}</span>
          </div>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, nextTick } from 'vue';
import type { Post } from '@/services/postService';

const props = defineProps<{ post: Post; preview?: boolean }>();
const emit = defineEmits(['ready']);

const imageAsDataUrl = ref<string>('');
const isImageLoaded = ref(false);
const textContainer = ref<HTMLElement | null>(null);
const contentText = ref<HTMLElement | null>(null);
const API_URL: string = (import.meta.env.VITE_API_BASE_URL as string) || '';

// Señalizar al padre cuando todo esté listo para capturar
const hasEmittedReady = ref(false);
const notifyReady = async () => {
  if (hasEmittedReady.value) return;
  try {
    // @ts-ignore: soporte condicional de Font Loading API
    await (document.fonts && document.fonts.ready);
  } catch {}
  await nextTick();
  hasEmittedReady.value = true;
  emit('ready');
};

const handleImageLoad = () => {
  isImageLoaded.value = true;
  notifyReady();
};

/* ---------------- Imagen ---------------- */
watchEffect(async () => {
  if (!props.post.url_imagen) {
    isImageLoaded.value = false; // No hay imagen que cargar
    return;
  }
  let fullUrl = props.post.url_imagen;
  if (!fullUrl.startsWith('http')) {
    fullUrl = API_URL ? `${API_URL}${fullUrl}` : fullUrl;
  }

  try {
    const response = await fetch(fullUrl, { mode: 'cors' });
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onloadend = () => {
      imageAsDataUrl.value = reader.result as string;
      isImageLoaded.value = true; // La imagen está lista para ser mostrada
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    console.warn('Falling back to direct image URL due to CORS:', error);
    imageAsDataUrl.value = fullUrl;
    isImageLoaded.value = true; // La imagen está lista para ser mostrada
  }
});


// Cuando no hay imagen, emite listo tras montar
onMounted(() => {
  if (!props.post.url_imagen) {
    notifyReady();
  }
});

/* ---------------- Texto ---------------- */
const strippedContent = computed(() => {
  if (!props.post.contenido) return '';
  return props.post.contenido.replace(/<[^>]*>?/gm, '').trim();
});

/* Ajusta tamaÃ±o dinÃ¡mico sin sobrepasar */
const adjustFontSize = () => {
  const container = textContainer.value;
  const content = contentText.value;
  if (!container || !content) return;

  let fontSize = 40;
  content.style.fontSize = fontSize + 'px';

  while (content.scrollHeight > container.clientHeight && fontSize > 22) {
    fontSize -= 2;
    content.style.fontSize = fontSize + 'px';
  }
};

onMounted(() => {
  nextTick(() => {
    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
  });
});

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;800&family=Open+Sans:wght@400;600&display=swap');

/* ==========================================================
   ðŸ”¹ GENERAL
========================================================== */
.story-template-container {
  position: absolute;
  left: -9999px;
  top: 0;
}

.story-template-container.preview-mode {
  position: relative;
  left: 0;
  top: 0;
  transform: scale(0.28);
  transform-origin: top left;
  height: 540px;
}

.story-template {
  width: 1080px;
  height: 1920px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
}

/* ==========================================================
   ðŸ”¹ HEADER
========================================================== */
.header {
  height: 13%;
  background-color: #1E2A3A;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.logo {
  width: 520px;
  height: auto;
  max-width: 80%;
}

/* ==========================================================
   ðŸ”¹ CONTENIDO
========================================================== */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.visual-block {
  position: relative;
  width: 100%;
  height: 77%;
  /* mÃ¡s espacio para el texto */
  overflow: hidden;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5; /* Fondo mientras carga la imagen */
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(85%);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(30, 42, 58, 0.85), transparent 50%);
}

/* TEXTO SOBRE IMAGEN */
.overlay-text {
  position: absolute;
  bottom: 40px; /* Ajusta segÃºn sea necesario */
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #fff;
  width: 85%;
  max-height: 45%; /* LÃ­mite de altura */
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Alinea el contenido al final (abajo) */
}

.overlay-text .title {
  font-weight: 800;
  font-size: 68px;
  line-height: 1.2;
  margin-bottom: 12px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.overlay-text .content {
  font-family: 'Open Sans', sans-serif;
  font-size: 38px;
  line-height: 1.6;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 15;
  /* mÃ¡ximo 15 lÃ­neas */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

/* SIN IMAGEN */
.no-image-background {
  height: 77%;
  width: 100%;
  background: #F6F8FB;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-only .title {
  font-weight: 800;
  font-size: 64px;
  color: #1E2A3A;
  margin-bottom: 30px;
  text-align: center;
}

.text-only .content {
  font-family: 'Open Sans', sans-serif;
  font-size: 38px;
  color: #4A4A4A;
  line-height: 1.6;
  text-align: center;
  max-width: 85%;
  display: -webkit-box;
  -webkit-line-clamp: 15;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

/* ==========================================================
   ðŸ”¹ FOOTER (compacto)
========================================================== */
.footer {
  height: 2%;
  /* reducido */
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.footer-pill {
  background-color: #F5F7FB;
  border-radius: 10px;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.author,
.date {
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  font-size: 26px;
  color: #3FA9F5;
}

.separator {
  font-size: 26px;
  color: #3FA9F5;
  opacity: 0.4;
}

/* ===== Overrides para disposición (footer fino y contenido más alto) ===== */
.story-template .visual-block { flex: 1 1 auto; height: auto; }
.story-template .no-image-background { flex: 1 1 auto; height: auto; }
.story-template .main-image { object-position: center; }
.story-template .overlay-text { bottom: 32px; height: 45%; }
.story-template .overlay-text .content { -webkit-line-clamp: 16; }
.story-template .footer { height: auto; padding: 10px 0; align-items: center; }
.story-template .footer .footer-pill { padding: 8px 18px; gap: 16px; }
.story-template .footer .author,
.story-template .footer .date,
.story-template .footer .separator { font-size: 26px; }
</style>
