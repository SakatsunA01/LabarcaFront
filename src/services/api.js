// src/services/api.js
import axios from 'axios'

// Crear una instancia de Axios con la URL base de tu API de Laravel
const api = axios.create({
  baseURL: 'http://localhost', // <--- La URL base de tu backend Laravel
  withCredentials: true, // Importante si usas autenticación basada en sesiones/cookies (Laravel Sanctum)
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default api
