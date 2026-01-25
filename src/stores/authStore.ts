import { defineStore } from 'pinia'
import axios from 'axios'

export interface User {
  id: number
  name: string
  email: string
  admin_sn: 0 | 1
  phone?: string;
  belongs_to_church?: boolean;
  church_name?: string | null;
  pastor_name?: string | null;
  birth_date?: string | null;
}

export interface AuthState {
  user: User | null
  token: string | null
  error: string | null
  isLoading: boolean
}

// Usa env en desarrollo/producción; fallback a prod si no está definido
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://api.labarcaministerio.com';
const API_URL = `${API_BASE_URL}/api`;

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
        await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true })

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
        await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true });
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
    async updateProfile(payload: Partial<User> & { password?: string; password_confirmation?: string }) {
      this.isLoading = true;
      this.error = null;

      const config = { withCredentials: true, headers: { 'Authorization': `Bearer ${this.token}` } } as const;

      // Permite definir endpoint y método por ENV, con soporte de :id
      const overridePath = (import.meta as any).env?.VITE_PROFILE_UPDATE_ENDPOINT as string | undefined;
      type UpdateMethod = 'put'|'patch'|'post';
      const overrideMethodRaw = ((import.meta as any).env?.VITE_PROFILE_UPDATE_METHOD as string | undefined)?.toLowerCase();
      const overrideMethod: UpdateMethod | undefined =
        overrideMethodRaw === 'put' || overrideMethodRaw === 'patch' || overrideMethodRaw === 'post'
          ? (overrideMethodRaw as UpdateMethod)
          : undefined;

      const userId = this.user?.id;
      const buildUrl = (path: string) => path.replace(':id', String(userId ?? ''));

      // Lista de candidatos en orden
      const candidates: Array<{ method: 'put'|'patch'|'post', url: string }> = [];

      if (overridePath && overrideMethod) {
        candidates.push({ method: overrideMethod, url: `${API_URL}${buildUrl(overridePath)}` });
      }

      // Convenciones comunes (Laravel/REST)
      candidates.push(
        { method: 'put', url: `${API_URL}/user` },
        ...(userId ? [{ method: 'put', url: `${API_URL}/users/${userId}` } as const] : []),
        ...(userId ? [{ method: 'patch', url: `${API_URL}/users/${userId}` } as const] : []),
        { method: 'post', url: `${API_URL}/user/update` },
        { method: 'put', url: `${API_URL}/user/profile-information` },
        { method: 'patch', url: `${API_URL}/user/profile-information` },
      );

      const acceptable = (status?: number) => status === 405 || status === 404;

      try {
        let response: any = null;
        for (const c of candidates) {
          try {
            if (c.method === 'put') response = await axios.put(c.url, payload, config);
            else if (c.method === 'patch') response = await axios.patch(c.url, payload, config);
            else response = await axios.post(c.url, payload, config);
            break; // éxito
          } catch (err: any) {
            const status = err?.response?.status;
            if (!acceptable(status)) throw err;
            // Continua probando siguiente candidato
          }
        }

        if (!response) throw new Error('No update endpoint matched (404/405). Configura VITE_PROFILE_UPDATE_ENDPOINT.');

        if (response.data && (response.data.user || response.data.id)) {
          this.user = (response.data.user ?? response.data) as User;
        } else {
          await this.fetchUser();
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Error al actualizar el perfil.';
        console.error('Update profile error:', error.response?.data || error);
        throw error;
      } finally {
        this.isLoading = false;
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






