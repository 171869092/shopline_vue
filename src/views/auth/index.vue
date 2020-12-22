<template>
  <div class="redirecting" style="padding:10px">
    <h3>Redirecting...</h3>
  </div>
</template>
<script>
import { setCookies } from '@/utils/cookies'
import { shopifyApi } from '@/api/user'
export default {
  data() {
    return {}
  },
  created() {
    this.shopifyInit()
  },
  methods: {
    shopifyInit() {
      const query = this.$route.query
      if (Object.hasOwnProperty.call(query, 'code') && Object.hasOwnProperty.call(query, 'hmac')) {
        setCookies('shopify', query)
        setCookies('shop', query.shop)
        shopifyApi({ ...query }).then(res => {
          if (res.code === 200) {
            this.$store.commit('user/SET_TOKEN', res.data.token)
            this.$store.commit('user/SET_EMAIL', res.data.email)
            // getToken(res.data.token)
            setCookies('token', res.data.token)
            setCookies('email', res.data.email)
            this.$router.replace({ name: 'dashboard' })
          } else {
            this.$router.push({ name: 'home' })
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        window.location = '/'
      }
    }
  }
}
</script>
<style lang="scss">
.redirecting {
  width: 100%;
  height: 100vh;
  cursor: progress;
}
</style>
