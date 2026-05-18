import axios from 'axios'

const client = axios.create({
  baseURL: '/backend/api',
  withCredentials: true, // Required for cookies
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await axios.post('/backend/api/token/refresh/', {}, { withCredentials: true })
        return client(originalRequest)
      } catch (refreshError) {
        // Refresh failed, probably need to redirect to login
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default client
