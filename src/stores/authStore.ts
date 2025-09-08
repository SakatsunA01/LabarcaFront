import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: number
  name: string
  email: string
  admin_sn: 0 | 1
  phone?: string;
  belongs_to_church?: boolean;
  church_name?: string | null;
  pastor_name?: string | null;
}

export interface AuthState {
  user: User | null
  token: string | null
  error: string | null
  isLoading: boolean
}

const API_URL = 'https://api.labarcaministerio.com/api'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('authToken') || null,
    error: null,
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user || !!state.token,
    currentUser: (state) => state.user,
    isAdmin: (state) => state.user?.admin_sn === 1,
  },
  actions: {
    async login(credentials: { email: string; password: string }) {
      this.isLoading = true
      this.error = null
      try {
        await axios.get('https://api.labarcaministerio.com/sanctum/csrf-cookie', { withCredentials: true })

        const response = await axios.post(`${API_URL}/login`, credentials, {
          withCredentials: true,
        })

        if (response.data && response.data.user) {
          this.user = response.data.user
          this.token = response.data.token
          localStorage.setItem('authToken', response.data.token)
        } else {
          await this.fetchUser()
        }
      } catch (error: any) {
        this.user = null
        this.token = null
        localStorage.removeItem('authToken')
        if (error.response && error.response.data) {
            const errors = error.response.data.errors || error.response.data;
            if (typeof errors === 'object' && errors !== null) {
                const firstErrorKey = Object.keys(errors)[0];
                this.error = errors[firstErrorKey]?.[0] || 'Error de validación desconocido.';
            } else {
                this.error = error.response.data.message || 'Error en el inicio de sesión.';
            }
        } else {
            this.error = 'Ocurrió un error de red o del servidor.';
        }
        console.error('Login error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async register(userInfo: any) {
      this.isLoading = true;
      this.error = null;
      try {
        await axios.get('https://api.labarcaministerio.com/sanctum/csrf-cookie', { withCredentials: true });
        const response = await axios.post(`${API_URL}/register`, userInfo, { withCredentials: true });
        
        // Después de un registro exitoso, intentar loguear al usuario
        await this.login({ email: userInfo.email, password: userInfo.password });

        return response.data; // Devuelve la respuesta de registro si es necesario
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error en el registro.';
        console.error('Register error:', error.response?.data);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchUser() {
      try {
        const response = await axios.get(`${API_URL}/user`, { withCredentials: true, headers: { 'Authorization': `Bearer ${this.token}` } })
        this.user = response.data
      } catch (error: any) {
        this.user = null
        this.token = null
        localStorage.removeItem('authToken')
        console.error('Error fetching user:', error)
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('authToken')
      axios
        .post(`${API_URL}/logout`, {}, { withCredentials: true, headers: { 'Authorization': `Bearer ${this.token}` } })
        .catch((error) => console.error('Logout API error:', error))
    },
  },
})