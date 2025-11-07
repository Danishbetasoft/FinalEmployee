
import { defineStore } from 'pinia'

import { apiClient } from '@/plugins/api';
export const useAuthStore = defineStore('auth', {
  id: 'auth',
  state: () => ({
    user: null,
    token: null,
    role: null, 
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'admin',
    isEmployee: (state) => state.role === 'employee',
  },
  persist: {
    key: 'auth-store',
    paths: ['user', 'token', 'role'], 
    storage: localStorage,
  },
  actions: {
    async login(username, password) {
      try {
        const response = await apiClient.post('/auth/login', { username, password });
        const { token, role, username: user } = response.data;

        if (token) {
          this.user = { username: user };
          this.token = token;
          this.role = role; 
          return true;
        }
        return false;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.role = null;
    },
  },
});
