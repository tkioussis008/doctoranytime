import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import QuestionnaireLayout from '@/layouts/QuestionnaireLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    meta: { layout: MainLayout },
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/questionnaire',
    name: 'questionnaire',
    meta: { layout: QuestionnaireLayout },
    component: () => import('../pages/Questionnaire.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
