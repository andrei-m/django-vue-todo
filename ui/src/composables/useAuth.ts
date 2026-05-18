import { ref, readonly } from 'vue'
import client from '../api/client'

const isAuthenticated = ref(false)
const user = ref(null)

export function useAuth() {
  async function login(credentials: any) {
    try {
      await client.post('/login/', credentials)
      isAuthenticated.value = true
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message }
    }
  }

  async function register(data: any) {
    try {
      await client.post('/register/', data)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message }
    }
  }

  async function logout() {
    try {
      await client.post('/logout/')
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      isAuthenticated.value = false
      user.value = null
      // Force a refresh to clear any cached state and ensure fresh redirect
      window.location.href = '/'
    }
  }

  async function checkAuth() {
    try {
      // Attempt to list todos to check if token is valid
      await client.get('/todos/')
      isAuthenticated.value = true
    } catch (error) {
      isAuthenticated.value = false
    }
  }

  return {
    isAuthenticated: readonly(isAuthenticated),
    user: readonly(user),
    login,
    register,
    logout,
    checkAuth,
  }
}
