<template>
  <footer class="bg-brand-gris-claro border-t border-gray-200">
    <!-- Sección de Colaboradores/Patrocinadores -->
    <section class="py-10 md:py-16 bg-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-2xl font-semibold text-brand-negro mb-8">
          Confían en nosotros
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center max-w-4xl mx-auto">
          <!-- Imagen 1 -->
          <div class="p-4 grayscale hover:grayscale-0 transition-all duration-300">
            <img src="https://placehold.co/300x100/E2E2E2/999999?text=Patrocinador+1" alt="Logo Patrocinador 1"
              class="mx-auto" />
          </div>
          <!-- Imagen 2 -->
          <div class="p-4 grayscale hover:grayscale-0 transition-all duration-300">
            <img src="https://placehold.co/300x100/E2E2E2/999999?text=Patrocinador+2" alt="Logo Patrocinador 2"
              class="mx-auto" />
          </div>
          <!-- Imagen 3 -->
          <div class="p-4 grayscale hover:grayscale-0 transition-all duration-300">
            <img src="https://placehold.co/300x100/E2E2E2/999999?text=Patrocinador+3" alt="Logo Patrocinador 3"
              class="mx-auto" />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Principal -->
    <div class="bg-brand-negro text-brand-gris-claro py-10 px-4 sm:px-6 lg:px-8">
      <div class="container mx-auto max-w-7xl">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <!-- Columna 1: Marca y Descripción -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-white">LaBarca Producciones</h3>
            <p class="text-sm text-gray-400">
              Conectando corazones a través de la música y eventos que inspiran.
            </p>
          </div>

          <!-- Columna 2: Navegación Rápida -->
          <div class="md:justify-self-center">
            <h4 class="font-semibold text-white mb-4 uppercase tracking-wider">Navegación</h4>
            <ul class="space-y-2 text-sm">
              <li><router-link to="/eventos" class="hover:text-brand-camel transition-colors">Eventos</router-link></li>
              <li><router-link to="/artistas" class="hover:text-brand-camel transition-colors">Artistas</router-link>
              </li>
              <li><router-link to="/lanzamientos"
                  class="hover:text-brand-camel transition-colors">Lanzamientos</router-link></li>
              <li><router-link to="/como-estas-hoy" class="hover:text-brand-camel transition-colors">¿Cómo estás
                  hoy?</router-link></li>
            </ul>
          </div>

          <!-- Columna 3: Sobre Nosotros -->
          <div class="md:justify-self-center">
            <h4 class="font-semibold text-white mb-4 uppercase tracking-wider">Nosotros</h4>
            <ul class="space-y-2 text-sm">
              <li><router-link to="/about" class="hover:text-brand-camel transition-colors">Sobre LaBarca</router-link>
              </li>
              <li><router-link to="/contacto" class="hover:text-brand-camel transition-colors">Contacto</router-link>
              </li>
              <li><router-link to="/privacidad" class="hover:text-brand-camel transition-colors">Política de
                  Privacidad</router-link></li>
            </ul>
          </div>

          <!-- Columna 4: Redes Sociales -->
          <div class="md:justify-self-end">
            <h4 class="font-semibold text-white mb-4 uppercase tracking-wider">Síguenos</h4>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-brand-camel transition-colors" aria-label="Facebook">
                <span class="sr-only">Facebook</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-brand-camel transition-colors" aria-label="Instagram">
                <span class="sr-only">Instagram</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 012.153 2.153c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-2.153 2.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-2.153-2.153c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 012.153-2.153c.636-.247 1.363.416 2.427.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0-2a7 7 0 110 14 7 7 0 010-14zm6.406-1.185a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"
                    clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-brand-camel transition-colors" aria-label="YouTube">
                <span class="sr-only">YouTube</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.505 2.505 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12L10 15.194V8.806L15.194 12z"
                    clip-rule="evenodd" />
                </svg>
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
// En el futuro, podrías cargar los patrocinadores desde una API
</script>
