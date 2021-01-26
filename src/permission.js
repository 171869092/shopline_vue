import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
// import { staticMap } from '@/router'
// import { setToken } from '@/utils/auth'
import { shopifyApi } from '@/api/user'
import { setCookies, getCookies } from '@/utils/cookies'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/', '/login', '/register', '/auth', '/privacy-policy', '/about-us', '/faq', '/content'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()
  // if (to.path !== '/login' && !hasToken && to.path !== '/register') {
  //   return next('/login')
  // }
  // next()
  if (hasToken) { // 已经有token
    console.log('hastoken init dashboard')
    const query = to.query
    if (Object.hasOwnProperty.call(query, 'code') && Object.hasOwnProperty.call(query, 'hmac')) {
      console.log('init shoify query')
      setCookies('shopify', query)
      setCookies('shop', query.shop)
      const uid = getCookies('uid') || ''
      const res = await shopifyApi({ ...query, uid: uid })
      if (res.code === 200 && res.data.length === undefined) {
        console.log('set user token')
        store.commit('user/SET_TOKEN', res.data.token)
        store.commit('user/SET_EMAIL', res.data.email)
        // getToken(res.data.token)
        setCookies('uid', res.data.uid)
        setCookies('token', res.data.token)
        setCookies('email', res.data.email)
        console.log('jump next')
        next()
      } else {
        next('/login')
      }
    } else {
      next()
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      console.log('no token init dashboard')
      const query = to.query
      if (Object.hasOwnProperty.call(query, 'code') && Object.hasOwnProperty.call(query, 'hmac')) {
        setCookies('shopify', query)
        setCookies('shop', query.shop)
        const res = await shopifyApi({ ...query })
        if (res.code === 200 && res.data.length === undefined) {
          store.commit('user/SET_TOKEN', res.data.token)
          store.commit('user/SET_EMAIL', res.data.email)
          // getToken(res.data.token)
          setCookies('uid', res.data.uid)
          setCookies('token', res.data.token)
          setCookies('email', res.data.email)
          next({ ...to, replace: true })
        } else {
          next('/login')
        }
      } else {
        next('/login')
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
