import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isRouteLoading: false,
    showLoginModal: false,
    showRegisterModal: false, // Nuevo estado para el modal de registro
  }),
  actions: {
    setRouteLoading(isLoading: boolean) {
      this.isRouteLoading = isLoading
    },
    async showLoadingOverlay(duration: number = 300) {
      this.isRouteLoading = true
      // Espera un poco para que la animación de entrada se complete
      await new Promise((resolve) => setTimeout(resolve, duration))
    },
    setShowLoginModal(show: boolean) {
      this.showLoginModal = show
      if (show) this.showRegisterModal = false // Cierra el otro modal si se abre este
    },
    setShowRegisterModal(show: boolean) {
      this.showRegisterModal = show
      if (show) this.showLoginModal = false // Cierra el otro modal si se abre este
    },
  },
})
