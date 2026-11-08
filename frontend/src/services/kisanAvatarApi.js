import axios from 'axios'

const kisanAvatarApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Check Kisan Avatar backend availability
export const checkKisanAvatarHealth = async () => {
  const response = await kisanAvatarApi.get('/kisan/health')
  return response.data
}

// Send a multilingual farming question
export const sendKisanAvatarMessage = async (message, language = 'hi') => {
  const response = await kisanAvatarApi.post('/kisan/chat', {
    message: message.trim(),
    language,
  })

  return response.data
}

export default kisanAvatarApi
