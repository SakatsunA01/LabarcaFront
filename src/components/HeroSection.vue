<template>
  <section class="relative h-screen flex items-center justify-center text-white">
    <!-- 1. Video de Fondo y Overlay -->
    <div class="absolute inset-0 overflow-hidden">
      <video autoplay loop muted playsinline class="w-full h-full object-cover" poster="#">
        <!-- Idealmente, usar un video de alta calidad -->
        <source src="#" type="video/mp4" />
        Tu navegador no soporta videos.
      </video>
    </div>
    <!-- Capa de superposición para legibilidad -->
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- 2. Contenido Centrado -->
    <div class="relative z-10 text-center px-4">
      <!-- 3. Copywriting y Tipografía -->
      <h1
class="text-4xl md:text-6xl font-bold text-white tracking-tight"
        style="font-family: 'Montserrat', sans-serif;">
        Donde la Fe se Hace Canción.
      </h1>
      <p class="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200" style="font-family: 'Lato', sans-serif;">
        Producimos eventos y música que inspiran, unen a la comunidad y te
        acercan a una experiencia de adoración auténtica.
      </p>

      <!-- 4. Llamadas a la Acción (CTAs) -->
      <div class="mt-8 flex justify-center gap-x-4">
        <a
href="/eventos"
          class="px-8 py-3 bg-[#D4AF37] text-black font-semibold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
          Ver Próximos Eventos
        </a>
        <a
href="/artistas"
          class="px-8 py-3 border border-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors">
          Conoce a los Artistas
        </a>
      </div>
    </div>
  </section>
</template>

<script>
// Lógica del componente si fuera necesaria
</script>

<style scoped>
/* Estilos adicionales si Tailwind no es suficiente */
h1 {
  text-shadow: 0px 2px 15px rgba(0, 0, 0, 0.5);
}
</style>
