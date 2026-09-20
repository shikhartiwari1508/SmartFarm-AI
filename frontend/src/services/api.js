import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const msg = error.response?.data?.detail || error.message || 'Network error'
    return Promise.reject(new Error(msg))
  }
)

// ---- Crop Recommendation ----
export const recommendCrop = (data) => api.post('/crops/recommend', data)
export const getCropsList = () => api.get('/crops/crops-list')

// ---- Disease Detection ----
export const detectDisease = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/disease/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// ---- Irrigation ----
export const getIrrigationRecommendation = (data) => api.post('/irrigation/recommend', data)
export const getIrrigationCrops = () => api.get('/irrigation/crops')

// ---- Weather ----
export const getWeather = (location = 'Maharashtra') => api.get(`/weather/?location=${location}`)

// ---- Chat ----
export const sendChatMessage = (message, sessionId = null) =>
  api.post('/chat/', { message, session_id: sessionId })

// ---- Farm ----
export const getFarmProfile = () => api.get('/farm/profile')
export const getFarmSummary = () => api.get('/farm/summary')

// ---- Insights ----
export const getInsights = (params = {}) => api.get('/insights/', { params })

// ---- Health ----
export const healthCheck = () => api.get('/health')

export default api
