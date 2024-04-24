import { createRouter, createWebHistory } from 'vue-router'
import VivreView from '@/views/VivreView.vue'
import SettingsView from '@/views/SettingsView.vue'
import CreepRoutesView from '@/views/CreepRoutesView.vue'
import BuildOrderView from '@/views/BuildOrderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: VivreView
    },
    {
      path: '/creeproutes',
      name: 'creeproutes',
      component: CreepRoutesView
    },
    {
      path: '/buildorders',
      name: 'buildorders',
      component: BuildOrderView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    }
  ]
})

export default router
