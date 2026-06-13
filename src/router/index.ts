import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import RoomPage from '@/pages/RoomPage.vue'
import GamePage from '@/pages/GamePage.vue'
import MemorialAlbumPage from '@/pages/MemorialAlbumPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/room/:id',
      name: 'room',
      component: RoomPage
    },
    {
      path: '/room/:id/game',
      name: 'game',
      component: GamePage
    },
    {
      path: '/album/:id',
      name: 'album',
      component: MemorialAlbumPage
    },
    {
      path: '/room/:id/album',
      name: 'room-album',
      component: MemorialAlbumPage
    }
  ]
})

export default router
