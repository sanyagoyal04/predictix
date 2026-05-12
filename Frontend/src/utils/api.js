import axios from 'axios'

// In production (Vercel), VITE_API_URL points to Render backend
// In development, Vite proxy forwards /api → localhost:5001
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 90000, // 90s — Render free tier cold starts take ~50s
})

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('predictix_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor - handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('predictix_token')
      localStorage.removeItem('predictix_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
