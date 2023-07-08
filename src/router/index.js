import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { live: true },
      component: () => import('../views/Home.vue')
    },
    {
      path: '/detail/:id',
      component: () => import('../views/Detail.vue')
    },
    {
      path: '/login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/mine',
      component: () => import('../views/Mine.vue'),
      meta: { requiresAuth: true, live: true }
    },
    {
      path: '/collection',
      component: () => import('../views/Collection.vue'),
      meta: { requiresAuth: true, live: true }
    }
  ]
})

//全局路由守卫
//需要身份认证的页面加上 元信息：meta: { requiresAuth: true }
router.beforeEach((to, from, next) => {
  let userInfo = null
  if (localStorage.getItem('zhihu-userInfo')) {
    userInfo = JSON.parse(localStorage.getItem('zhihu-userInfo'))
  }
  //当前进入页面是否要验证
  if (to.meta.requiresAuth) {
    if (!userInfo) {
      router.push('/login').catch(() => {})
    }
  }
  next()
})

export default router
