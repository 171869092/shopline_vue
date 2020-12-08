<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Dashboard</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { shopifyApi } from '@/api/user'
// import createApp from '@shopify/app-bridge'
// import { Redirect, Button } from '@shopify/app-bridge/actions'
// import { getSessionToken } from '@shopify/app-bridge-utils'
export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    // const shopOrigin = 'live-by-test.myshopify.com'
    // const apiKey = '5fdf0435f9093519625df5bfca4c8a31'
    // const redirectUri = 'https://api.dongketech.com/site/generatr-token'
    // const permissionUrl = `https://${shopOrigin}/admin/oauth/authorize?client_id=${apiKey}&scope=read_products,read_content&redirect_uri=${redirectUri}`

    // // If the current window is the 'parent', change the URL by setting location.href
    // if (window.top === window.self) {
    //   console.log('redirect')
    //   window.location.assign(permissionUrl)
    //   // If the current window is the 'child', change the parent's URL with Shopify App Bridge's Redirect action
    // } else {
    //   console.log('init')
    //   const app = createApp({
    //     apiKey: apiKey,
    //     shopOrigin: shopOrigin
    //   })
    //   console.log(app)

    //   const myButton = Button.create(app, { label: 'Save' })
    //   console.log(myButton)

    //   Redirect.create(app).dispatch(Redirect.Action.REMOTE, permissionUrl)
    // }
    this.shopifyInit()
  },
  methods: {
    shopifyInit() {
      // const query = { 'code': 'c20411e3859748cc53f583b221048c81', 'hmac': '5cba719e7d85008aa29d7a33e946e1123595cbda5647958e40257699c4f4bb3b', 'shop': 'live-by-test.myshopify.com', 'timestamp': '1606810839' }
      // console.log(this.serialize(query))

      setInterval(() => {
        console.log('100')
      }, 5000)

      // eslint-disable-next-line no-prototype-builtins
      if (this.$route.query.hasOwnProperty('hmac')) {
        shopifyApi({ ...this.$route.query }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
