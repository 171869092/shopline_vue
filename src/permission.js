import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
// import { staticMap } from '@/router'
// import { setToken } from '@/utils/auth'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register', '/auth', '/'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  const hasToken = getToken()
  // if (to.path !== '/login' && !hasToken && to.path !== '/registered') {
  //   return next('/login')
  // }
  // next()
  if (hasToken) { // 已经有token
    next()
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
