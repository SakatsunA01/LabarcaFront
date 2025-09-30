import { defineStore } from 'pinia'

interface SnackbarState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  timeout: ReturnType<typeof setTimeout> | null;
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    isRouteLoading: false,
    showLoginModal: false,
    showRegisterModal: false, // Nuevo estado para el modal de registro
    snackbar: {
      visible: false,
      message: '',
      type: 'info',
      timeout: null,
    } as SnackbarState,
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
    showSnackbar(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 4000) {
      if (this.snackbar.timeout) {
        clearTimeout(this.snackbar.timeout);
      }
      this.snackbar.message = message;
      this.snackbar.type = type;
      this.snackbar.visible = true;

      this.snackbar.timeout = setTimeout(() => {
        this.hideSnackbar();
      }, duration);
    },
    hideSnackbar() {
      if (this.snackbar.timeout) {
        clearTimeout(this.snackbar.timeout);
      }
      this.snackbar.visible = false;
    },
  },
})
