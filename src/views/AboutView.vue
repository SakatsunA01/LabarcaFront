<template>
  <div class="bg-white text-brand-negro">
    <!-- 1. Banner Principal -->
    <header class="relative h-[60vh] min-h-[400px] text-white">
      <div class="absolute inset-0 bg-black opacity-50 z-10"></div>
      <img src="@/assets/about-header-placeholder.png" alt="Comunidad de La Barca Music en adoración" class="absolute inset-0 w-full h-full object-cover">
      <div class="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <AnimatedSection>
          <h1 class="font-playfair text-4xl md:text-6xl font-bold">Somos La Barca Music</h1>
          <p class="mt-4 max-w-3xl text-lg md:text-xl font-light">
            "Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos." - Mateo 18:20
          </p>
        </AnimatedSection>
      </div>
    </header>

    <!-- 2. Introducción Ampliada -->
    <main class="py-section-md md:py-section-lg">
      <div class="container mx-auto px-4">
        
        <AnimatedSection class="mb-20">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="font-playfair text-3xl md:text-4xl font-semibold text-brand-borgona mb-6">Nuestra Historia, Nuestra Pasión, Nuestro Propósito</h2>
            <p class="text-lg text-gray-700">
              En La Barca Music, creemos firmemente que la música es más que melodía y armonía; es un vehículo divino para la transformación, un puente que conecta corazones con el Creador y un eco de Su voz en la Tierra. Nacimos del deseo de ver a la iglesia local equipada y empoderada, con recursos que no solo inspiren, sino que también reflejen la excelencia y la pasión del Reino.
            </p>
          </div>
        </AnimatedSection>

        <div class="grid md:grid-cols-2 gap-12 items-center mb-20">
          <AnimatedSection>
            <img src="@/assets/mission-vision-placeholder.png" alt="Unidad y propósito" class="rounded-lg shadow-lg w-full h-auto object-cover aspect-video">
          </AnimatedSection>
          <AnimatedSection>
            <div class="space-y-8">
              <div class="flex items-start">
                <LightBulbIcon class="h-8 w-8 text-brand-camel mr-4 flex-shrink-0"/>
                <div>
                  <h3 class="font-playfair text-2xl font-semibold mb-2">Misión</h3>
                  <p class="text-gray-600">Creemos firmemente que la música es más que melodía y armonía; es un vehículo divino para la transformación. Nuestra misión es crear y proveer música y recursos que inspiren, sanen y conecten a las personas con la presencia de Dios, fomentando una atmósfera de adoración genuina.</p>
                </div>
              </div>
              <div class="flex items-start">
                <UsersIcon class="h-8 w-8 text-brand-camel mr-4 flex-shrink-0"/>
                <div>
                  <h3 class="font-playfair text-2xl font-semibold mb-2">Visión</h3>
                  <p class="text-gray-600">Nuestra visión es equipar a la iglesia local con recursos de excelencia. Soñamos con ser un referente de apoyo para ministerios de alabanza, artistas emergentes y congregaciones, proveyendo herramientas que les permitan crecer en su llamado y manifestar el Reino de Dios a través del arte.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection class="bg-gray-50 rounded-lg p-8 md:p-12 mb-20">
           <div class="grid md:grid-cols-3 gap-8 text-center">
              <div class="flex flex-col items-center">
                <HeartIcon class="h-10 w-10 text-brand-borgona mb-3"/>
                <h4 class="font-playfair text-xl font-semibold mb-2">Excelencia</h4>
                <p class="text-gray-600 text-sm">Buscamos la más alta calidad en cada nota, letra y producción, como una ofrenda a Dios.</p>
              </div>
              <div class="flex flex-col items-center">
                <HandRaisedIcon class="h-10 w-10 text-brand-borgona mb-3"/>
                <h4 class="font-playfair text-xl font-semibold mb-2">Integridad</h4>
                <p class="text-gray-600 text-sm">Actuamos con transparencia y honestidad, reflejando el carácter de Cristo en nuestro ministerio.</p>
              </div>
              <div class="flex flex-col items-center">
                <ShareIcon class="h-10 w-10 text-brand-borgona mb-3"/>
                <h4 class="font-playfair text-xl font-semibold mb-2">Unción</h4>
                <p class="text-gray-600 text-sm">Dependemos del Espíritu Santo para que Su presencia fluya a través de nuestro trabajo y toque vidas.</p>
              </div>
           </div>
        </AnimatedSection>

      </div>

      <!-- 3. Nuestro Equipo -->
      <section class="py-section-md bg-brand-negro text-white">
        <div class="container mx-auto px-4">
          <AnimatedSection>
            <div class="text-center max-w-3xl mx-auto">
              <h2 class="font-playfair text-3xl md:text-4xl font-semibold mb-4">Nuestros Líderes</h2>
              <p class="text-gray-300 mb-12">
                Detrás de La Barca Music hay un equipo apasionado, unido por la fe y el amor por la música.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto text-center">
              <!-- Líder 1 -->
              <div class="flex flex-col items-center">
                <img src="https://via.placeholder.com/150" alt="Foto de Sergio Quinteros" class="rounded-full w-32 h-32 object-cover mb-4 border-4 border-brand-camel">
                <h4 class="font-playfair text-xl font-semibold">Sergio Quinteros</h4>
                <p class="text-brand-camel text-sm mb-2">Fundador & Director</p>
              </div>
              <!-- Líder 2 -->
              <div class="flex flex-col items-center">
                <img src="https://via.placeholder.com/150" alt="Foto de Maria Reynoso" class="rounded-full w-32 h-32 object-cover mb-4 border-4 border-brand-camel">
                <h4 class="font-playfair text-xl font-semibold">Maria Reynoso</h4>
                <p class="text-brand-camel text-sm mb-2">Directora</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <!-- 4. Impacto y Comunidad -->
      <section class="py-section-md md:py-section-lg">
        <div class="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <h2 class="font-playfair text-3xl md:text-4xl font-semibold text-brand-verde-oscuro mb-6">Unidos por un Mismo sentir</h2>
            <p class="text-gray-700 mb-4">
              Más que un sello o una productora, somos una comunidad creciente de adoradores, músicos y creativos. Cada evento, cada canción y cada recurso es un testimonio del poder de Dios obrando a través de la unidad.
            </p>
            <p class="text-gray-700 mb-8">
              Nos gozamos al ver cómo artistas locales encuentran una plataforma para su talento y cómo las iglesias son bendecidas con nueva música para sus congregaciones.
            </p>
            <div class="flex space-x-8">
                <div class="text-center">
                    <p class="font-playfair text-4xl font-bold text-brand-borgona">+15</p>
                    <p class="text-sm text-gray-600">Años Sirviendo</p>
                </div>
                <div class="text-center">
                    <p class="font-playfair text-4xl font-bold text-brand-borgona">+20</p>
                    <p class="text-sm text-gray-600">Artistas Apoyados</p>
                </div>
                <div class="text-center">
                    <p class="font-playfair text-4xl font-bold text-brand-borgona">+30</p>
                    <p class="text-sm text-gray-600">Eventos Realizados</p>
                </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <img src="@/assets/community-placeholder.png" alt="Compañerismo en La Barca Music" class="rounded-lg shadow-lg w-full h-auto object-cover aspect-video">
          </AnimatedSection>
        </div>
      </section>

      <!-- 5. Conecta con Nosotros -->
      <section class="bg-gray-50 py-section-md">
        <div class="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 class="font-playfair text-3xl font-semibold mb-4">Conecta con Nuestra Comunidad</h2>
            <p class="max-w-2xl mx-auto text-gray-600 mb-8">
              Síguenos en nuestras redes para no perderte ninguna novedad, lanzamiento o evento. ¡Queremos saber de ti!
            </p>
            <div class="flex justify-center space-x-6 mb-10">
              <a href="#" class="text-gray-500 hover:text-brand-camel transition-colors"><i class="fab fa-instagram fa-2x"></i></a>
              <a href="#" class="text-gray-500 hover:text-brand-camel transition-colors"><i class="fab fa-facebook-f fa-2x"></i></a>
              <a href="#" class="text-gray-500 hover:text-brand-camel transition-colors"><i class="fab fa-youtube fa-2x"></i></a>
              <a href="#" class="text-gray-500 hover:text-brand-camel transition-colors"><i class="fab fa-spotify fa-2x"></i></a>
            </div>
            <router-link to="/contacto" class="bg-brand-camel text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all">
              Contáctanos
            </router-link>
          </AnimatedSection>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import AnimatedSection from '@/components/AnimatedSection.vue';
import { 
  HeartIcon, 
  LightBulbIcon, 
  UsersIcon, 
  HandRaisedIcon,
  ShareIcon
} from '@heroicons/vue/24/outline';

// Para los iconos de redes sociales, asegúrate de tener Font Awesome instalado y configurado,
// o reemplázalos con SVGs u otro sistema de iconos si lo prefieres.
</script>

<style scoped>
/* Estilos adicionales si son necesarios. Tailwind CSS se encarga de la mayoría. */
/* Asegúrate de tener cargada la fuente Playfair Display y Inter en tu index.html o CSS global */
/* Ejemplo para Font Awesome (si decides usarlo) */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>