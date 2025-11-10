import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router' // make sure this import exists!

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
})

apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore()

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Session expired — logging out automatically.')
      authStore.logout()
      if (router.currentRoute.value.name !== 'Login') {
        router.push('/login')
      }
    }

    return Promise.reject(error)
  }
)
