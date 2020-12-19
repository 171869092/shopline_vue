<script>
import createApp from '@shopify/app-bridge'
import { Redirect } from '@shopify/app-bridge/actions'
// import { getSessionToken } from '@shopify/app-bridge-utils'
export default {
  data() {
    return {}
  },
  created() {
    const shopOrigin = 'live-by-test.myshopify.com'
    const apiKey = '5fdf0435f9093519625df5bfca4c8a31'
    const redirectUri = 'https://f9afcc25fbc1.ap.ngrok.io'
    const permissionUrl = `https://${shopOrigin}/admin/oauth/authorize?client_id=${apiKey}&scope=read_products,read_content&redirect_uri=${redirectUri}`

    // If the current window is the 'parent', change the URL by setting location.href
    if (window.top === window.self) {
      console.log('redirect')
      window.location.assign(permissionUrl)
      // If the current window is the 'child', change the parent's URL with Shopify App Bridge's Redirect action
    } else {
      console.log('init')
      const app = createApp({
        apiKey: apiKey,
        shopOrigin: shopOrigin
      })
      console.log(app)

      Redirect.create(app).dispatch(Redirect.Action.REMOTE, permissionUrl)
    }
  },
  methods: {}
}
</script>
