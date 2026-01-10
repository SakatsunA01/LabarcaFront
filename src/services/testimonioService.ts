import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface NewTestimonio {
  id_evento: number | string;
  comentario: string;
}

export type TestimonioPayload = NewTestimonio | FormData;

export const testimonioService = {
  createTestimonio(testimonio: TestimonioPayload) {
    const config =
      testimonio instanceof FormData
        ? { headers: { 'Content-Type': undefined } }
        : undefined;
    return apiClient.post('/api/testimonios-eventos', testimonio, config);
  },
};
