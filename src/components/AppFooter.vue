<template>
  <footer class="bg-brand-gris-claro border-t border-gray-200">

    <!-- Footer Principal -->
    <div class="bg-brand-negro text-brand-gris-claro py-10 px-4 sm:px-6 lg:px-8">
      <div class="container mx-auto max-w-7xl">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <!-- Columna 1: Marca y Descripción -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              <MusicalNoteIcon class="h-6 w-6 text-brand-camel" />
              <span>LaBarca Producciones</span>
            </h3>
            <p class="text-sm text-gray-400">
              Conectando corazones a través de la música y eventos que inspiran.
            </p>
          </div>

          <!-- Columna 2: Navegación Rápida -->
          <div class="md:justify-self-center">
            <h4 class="font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <MapIcon class="h-5 w-5" />
              <span>Navegación</span>
            </h4>
            <ul class="space-y-2 text-sm">
              <li><router-link to="/eventos" class="hover:text-brand-camel transition-colors">Eventos</router-link></li>
              <li><router-link to="/artistas" class="hover:text-brand-camel transition-colors">Artistas</router-link></li>
              <li><router-link to="/lanzamientos" class="hover:text-brand-camel transition-colors">Lanzamientos</router-link></li>
              <li><router-link to="/comunidad" class="hover:text-brand-camel transition-colors">Comunidad</router-link></li>
            </ul>
          </div>

          <!-- Columna 3: Sobre Nosotros -->
          <div class="md:justify-self-center">
            <h4 class="font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <InformationCircleIcon class="h-5 w-5" />
              <span>Nosotros</span>
            </h4>
            <ul class="space-y-2 text-sm">
              <li><router-link to="/about" class="hover:text-brand-camel transition-colors">Sobre LaBarca</router-link></li>
              <li><router-link to="/contacto" class="hover:text-brand-camel transition-colors">Contacto</router-link></li>
              <li><router-link to="/privacidad" class="hover:text-brand-camel transition-colors">Política de Privacidad</router-link></li>
            </ul>
          </div>

          <!-- Columna 4: Redes Sociales -->
          <div class="md:justify-self-end">
            <h4 class="font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <ShareIcon class="h-5 w-5" />
              <span>Síguenos</span>
            </h4>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-brand-camel transition-colors" aria-label="Facebook">
                <span class="sr-only">Facebook</span>
                <UsersIcon class="w-6 h-6" />
              </a>
              <a href="#" class="text-gray-400 hover:text-brand-camel transition-colors" aria-label="Instagram">
                <span class="sr-only">Instagram</span>
                <CameraIcon class="w-6 h-6" />
              </a>
              <a href="#" class="text-gray-400 hover:text-brand-camel transition-colors" aria-label="YouTube">
                <span class="sr-only">YouTube</span>
                <VideoCameraIcon class="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <!-- Barra Inferior con Copyright -->
        <div class="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {{ new Date().getFullYear() }} LaBarca Producciones. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {
  MusicalNoteIcon,
  MapIcon,
  InformationCircleIcon,
  ShareIcon,
  UsersIcon,
  CameraIcon,
  VideoCameraIcon
} from '@heroicons/vue/24/outline';
</script>