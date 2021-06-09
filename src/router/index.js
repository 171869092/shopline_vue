import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/home/index'),
    name: 'home',
    hidden: true
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    name: 'login',
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    name: 'register',
    hidden: true
  },
  {
    path: '/privacy-policy',
    component: () => import('@/views/privacy-policy/index'),
    name: 'privacy-policy',
    hidden: true
  },
  {
    path: '/about-us',
    component: () => import('@/views/about-us/index'),
    name: 'about-us',
    hidden: true
  },
  {
    path: '/faq',
    component: () => import('@/views/faq/index'),
    name: 'faq',
    hidden: true
  },
  // {
  //   path: '/contact',
  //   component: () => import('@/views/contact/index'),
  //   name: 'contact',
  //   hidden: true
  // },
  {
    path: '/content',
    component: () => import('@/views/faq/content'),
    name: 'content',
    hidden: true
  },
  {
    path: '/track',
    component: () => import('@/views/track/track-number'),
    name: 'track',
    hidden: true
  },
  {
    path: '/track-details',
    component: () => import('@/views/track/details'),
    name: 'track-details',
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '',
    component: Layout,
    // redirect: '/dashboard',
    children: [{
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'el-icon-s-home' }
    }]
  },
  {
    path: '/storeProduct',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'storeProduct',
        component: () => import('@/views/storeProduct/index'),
        meta: { title: 'Store Products', icon: 'el-icon-goods' }
      },
      {
        path: 'productDetails',
        hidden: true,
        name: 'productDetails',
        component: () => import('@/views/storeProduct/productDetails'),
        meta: { title: 'Product Detail' }
      }
    ]
  },

  {
    path: '/product',
    component: Layout,
    meta: { title: 'Products', icon: 'el-icon-data-line' },
    children: [
      {
        path: 'product',
        name: 'product',
        component: () => import('@/views/product/index'),
        meta: { title: 'Products' }
      },
      {
        path: 'quoted',
        name: 'quoted',
        component: () => import('@/views/product/quoted'),
        meta: { title: 'Quoted' }
      }
    ]
  },

  {
    path: '/orders',
    component: Layout,
    meta: { title: 'Orders', icon: 'el-icon-tickets' },
    children: [
      {
        path: 'shopify',
        name: 'shopify',
        component: () => import('@/views/orders/index'),
        meta: { title: 'Shopify' }
      },
      {
        path: 'woo-commerces',
        name: 'woo-commerces',
        component: () => import('@/views/orders/index'),
        meta: { title: 'Woo Commerce' }
      },
      {
        path: 'detail',
        name: 'orders-detail',
        component: () => import('@/views/orders/detail'),
        meta: { title: 'Orders Detail', icon: 'el-icon-tickets' },
        hidden: true
      }
    ]
  },
  {
    path: '/after',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'after',
        component: () => import('@/views/after-sale/index'),
        meta: { title: 'After Sale', icon: 'el-icon-tickets' }
      },
      {
        path: 'after-detail',
        name: 'after-detail',
        component: () => import('@/views/after-sale/components/after-detail'),
        meta: { title: 'AfterSale Detail', icon: 'el-icon-tickets' },
        hidden: true
      },
      {
        path: 'after-create',
        name: 'after-create',
        component: () => import('@/views/after-sale/components/after-create'),
        meta: { title: 'Create AfterSale', icon: 'el-icon-tickets' },
        hidden: true
      }
    ]
  },
  {
    path: '/store',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'store',
        component: () => import('@/views/store/index'),
        meta: { title: 'Store', icon: 'el-icon-s-shop' }
      }
    ]
  },
  {
    path: '/bill',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'bill',
        component: () => import('@/views/bill/index'),
        meta: { title: 'Bill', icon: 'el-icon-notebook-2' }
      },
      {
        path: 'detail',
        name: 'bill-detail',
        component: () => import('@/views/bill/detail'),
        meta: { title: 'Bill Detail', icon: 'el-icon-notebook-2' },
        hidden: true
      },
      {
        path: 'preview',
        name: 'bill-preview',
        component: () => import('@/views/bill/preview'),
        meta: { title: 'Bill Preview', icon: 'el-icon-notebook-2' },
        hidden: true
      }
    ]
  },
  {
    path: '/service',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'source-agent',
        component: () => import('@/views/service-provider/index'),
        meta: { title: 'Source Agent', icon: 'el-icon-user-solid' }
        // hidden: true
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'settings',
        component: () => import('@/views/settings/index'),
        meta: { title: 'Settings', icon: 'el-icon-s-tools' }
        // hidden: true
      }
    ]
  },
  {
    path: '/vendors',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'vendors',
        component: () => import('@/views/vendors/index'),
        meta: { title: 'Vendors', icon: 'el-icon-reading' },
        hidden: true
      }
    ]
  },
  {
    path: '/messages',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'messages',
        component: () => import('@/views/message-center/index'),
        meta: { title: 'Messages', icon: 'el-icon-message-solid' },
        hidden: true
      },
      {
        path: 'notification',
        name: 'notification',
        component: () => import('@/views/message-center/components/notification'),
        meta: { title: 'System notification data', icon: 'el-icon-message-solid' },
        hidden: true
      },
      {
        path: 'priceDetails',
        name: 'priceDetails',
        component: () => import('@/views/message-center/components/priceDetails'),
        meta: { title: 'Price Details', icon: 'el-icon-message-solid' },
        hidden: true
      },
      {
        path: 'channelDetails',
        name: 'channelDetails',
        component: () => import('@/views/message-center/components/channelDetails'),
        meta: { title: 'Channel Details', icon: 'el-icon-message-solid' },
        hidden: true
      }
    ]
  },
  // {
  //   path: '/edit_faq',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'edit_faq',
  //       component: () => import('@/views/edit_faq/index'),
  //       meta: { title: 'FAQ', icon: 'el-icon-edit' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
