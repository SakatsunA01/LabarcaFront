import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: number
  name: string
  email: string
  admin_sn: 0 | 1
  // Agrega otros campos que esperas del backend
}

interface AuthState {
  user: User | null
  token: string | null // O el mecanismo de sesión que uses
  error: string | null
  isLoading: boolean
}

const API_URL = 'http://localhost:8000/api' // Asegúrate que esta sea la URL de tu backend Laravel

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('authToken') || null, // Ejemplo si usas token
    error: null,
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user, // O !!state.token si usas tokens y no cargas el user inmediatamente
    currentUser: (state) => state.user,
    isAdmin: (state) => state.user?.admin_sn === 1,
  },
  actions: {
    async login(credentials: { email: string; password: string }) {
      this.isLoading = true
      this.error = null
      try {
        // Paso 1: Obtener la cookie CSRF (necesario para Laravel Sanctum con SPA)
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })

        // Paso 2: Intentar el login
        const response = await axios.post(`${API_URL}/login`, credentials, {
          withCredentials: true,
        })

        // Si Laravel devuelve el usuario directamente tras el login:
        if (response.data && response.data.user) {
          // Ajusta esto según la respuesta de tu API
          this.user = response.data.user
          // Si usas tokens, aquí guardarías el token:
          // this.token = response.data.token;
          // localStorage.setItem('authToken', response.data.token);
        } else {
          // Si no devuelve el usuario, lo pedimos
          await this.fetchUser()
        }
      } catch (error: any) {
        this.user = null
        // this.token = null;
        // localStorage.removeItem('authToken');
        this.error = error.response?.data?.message || 'Error en el inicio de sesión.'
        console.error('Login error:', error)
        throw error // Relanzar para que el componente lo maneje si es necesario
      } finally {
        this.isLoading = false
      }
    },
    async fetchUser() {
      // Esta acción se llamaría después del login o al cargar la app si hay una sesión/token
      // try {
      //   const response = await axios.get(`${API_URL}/user`, { withCredentials: true }); // Asumiendo que /api/user devuelve el usuario autenticado
      //   this.user = response.data;
      // } catch (error) {
      //   this.user = null;
      //   console.error('Error fetching user:', error);
      // }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('authToken') // Limpia el token si usas
      // Aquí también deberías llamar a tu endpoint de logout en el backend:
      // axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      // Considera redirigir al home o a la página de login
    },
  },
})
