import axios from 'axios'

// ─────────────────────────────────────────────────────────────────────────────
// BASE URL — set VITE_API_BASE_URL in your .env file
// Your backend is deployed at: https://voicebridgeai-production.up.railway.app
// For local dev: http://localhost:8000
// Do NOT include a trailing slash.
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401, try to refresh the token once, then redirect to login
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/api/token/refresh/`, { refresh })
          localStorage.setItem('access_token', data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// ─── Auth endpoints ───────────────────────────────────────────────────────────

// POST /api/register/  → { username, email, password }
export const register = (data) => api.post('/api/register/', data)

// POST /api/token/  → { username, password }  returns { access, refresh }
export const login = (data) => api.post('/api/token/', data)

// POST /api/token/refresh/  → { refresh }  returns { access }
export const refreshToken = (data) => api.post('/api/token/refresh/', data)

// ─── Audio Records ────────────────────────────────────────────────────────────

// POST /audio-records/  multipart/form-data with audio file
// Note: /audio-records/ is at root, not under /api/ (per your API root screenshot)
export const uploadAudio = (formData) =>
  api.post('/audio-records/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// GET /audio-records/  → list of all your audio records
export const getAudioRecords = () => api.get('/audio-records/')

// GET /audio-records/:id/  → single record
export const getAudioRecord = (id) => api.get(`/audio-records/${id}/`)

// DELETE /audio-records/:id/
export const deleteAudioRecord = (id) => api.delete(`/audio-records/${id}/`)

// ─── AI Summary ───────────────────────────────────────────────────────────────

// POST /api/ai/summary/  → { audio_id, transcript }
// Returns: { summary, action_items, important_names_dates, ... }
export const generateSummary = (data) => api.post('/api/ai/summary/', data)

export default api
