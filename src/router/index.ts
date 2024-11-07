import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    meta: { layout: MainLayout },
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/about',
    name: 'about',
    meta: { layout: MainLayout },
    component: () => import('../pages/About.vue')
  },
  {
    path: '/questionnaire',
    name: 'questionnaire',
    meta: { layout: MainLayout },
    component: () => import('../pages/Questionnaire.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
