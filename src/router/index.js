import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/components/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import ThankYou from '@/pages/ThankYou.vue'
import EmpDashboard from '@/pages/EmpDashboard.vue'

const routes = [
  { path: '/', name: 'home', component: Login },
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/EmpDashboard', name: 'EmpDashboard', component: EmpDashboard },,
  { path: '/thankyou', name: 'Thank', component: ThankYou },
  {
    path: '/edit/:id',
    name: 'PublicEdit',
    component: () => import('@/pages/Publicedit.vue'),
    meta: { public: true },
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' }, 
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await new Promise(resolve => setTimeout(resolve, 0))  
  if (to.meta.public) {
    return true
  }

  if (!authStore.isAuthenticated) {
    if (to.name !== 'Login' && to.name !== 'home') {
      return { name: 'Login' }
    }
    return true 
  }
  if (authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      return true 
    }
    if (authStore.isEmployee) {
      if (to.name === 'EmpDashboard') {
        return true 
      }
      return { name: 'EmpDashboard' } 
    }
  }

  return true
})

export default router
