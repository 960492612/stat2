import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store/index.js'
import Index from '@/components/Index'
import Entry from '@/components/Entry'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect: '/statis',
      meta: { requireAuth: true }
    },
    {
      path: '/entry',
      name: 'Entry',
      component: Entry,
      meta: { requireAuth: false }
    }
  ]
})



// 登录验证、
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (!Store.getters.isLogin) {
      next({
        path: '/entry',
        query: { redirct: to.fullPath }
      });
    } else {
      next();
    }

  } else {
    next();
  }
})

export default router