// src/services/api.js
import axios from 'axios'

// Crear una instancia de Axios con la URL base de tu API de Laravel
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.labarcaministerio.com'
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Importante si usas autenticación basada en sesiones/cookies (Laravel Sanctum)
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Interceptor para añadir el token de autenticación a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
