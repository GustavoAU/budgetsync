import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './authGuard'
import BudgetOrganizer from '@/views/BudgetOrganizer.vue'
import LoginPage from '@/views/LoginPage.vue'
import UnauthorizedView from '@/views/UnauthorizedView.vue'
import HomePage from '@/views/HomePage.vue'

const routes = [
  { path: '/', name: 'HomePage', component: HomePage },
  { path: '/login', name: 'LoginPage', component: LoginPage },

  {
    path: '/budget-organizer',
    name: 'BudgetOrganizer',
    component: BudgetOrganizer,
    meta: { requiresAuth: true },
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: UnauthorizedView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach(authGuard)

export default router
