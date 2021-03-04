import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/index/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/flow',
    name: 'flow',
    component: Home
  },
  {
    path: '/public',
    name: 'public',
    component:()=>import ('../views/index/Public'),
  },
]

const router = new VueRouter({
  routes
})

export default router
