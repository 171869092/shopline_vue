<template>
  <header>
    <nav class="navbar navbar-expand-md fixed-top s-navbar navbar-light white-bg shadow-sm">
        <div class="container">
          <a class="navbar-brand mr50" href="#">
            <img src="@/assets/home/logo@2x.png" alt="" class="home-logo">
          </a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon" />
          </button>
          <div id="navbarCollapse" class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
              <li v-for="(menu, key) in menuList" :key="key" class="nav-item" :class="{'active': activeIndex == key}" @click="goLink(key)">
                <a class="nav-link" href="#">{{ menu }}</a>
              </li>
            </ul>
            <form class="form-inline mt-2 mt-md-0">
              <div v-if="isLogin">
                <router-link class="login-btn" :to="{name: 'dashboard'}">Dashboard</router-link>
              </div>
              <div v-else>
                <router-link class="login-btn" :to="{name: 'login'}">Login</router-link>
                <el-button type="primary" @click="registerClick">Get Started</el-button>
              </div>
            </form>
          </div>
        </div>
      </nav>
  </header>
</template>
<script>
export default {
  name: 'BNavbar',
  props: {},
  data() {
    return {
      activeIndex: 0,
      menuList: ['Home', 'FAQ', 'Contact'],
    }
  },
  computed: {
    isLogin() {
      return !!this.$store.getters.token
    }
  },
  created() {},
  methods: {
      goLink(index) {
      this.activeIndex = index
    },
    registerClick() {
      this.$router.push({ name: 'register' })
    },
  }
}
</script>
<style scoped>
</style>
