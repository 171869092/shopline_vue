<template>
  <header>
    <nav class="navbar navbar-expand-md fixed-top s-navbar navbar-light" :class="[isShow ? 'white-bg shadow-sm' : '']">
      <div class="container">
        <router-link class="login-btn" :to="{name: 'home'}">
          <img src="@/assets/home/logo@2x.png" alt="" class="home-logo">
        </router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon" />
        </button>
        <div id="navbarCollapse" class="collapse navbar-collapse justify-flex-end">
          <ul class="navbar-nav">
            <li v-for="(menu, key) in menuList" :key="key" class="nav-item" :class="{'active': activeIndex == key}" @click="goLink(key)">
              <router-link class="nav-link" :to="{name: menu.href}">{{ menu.name }}</router-link>
            </li>
            <li class="nav-item flexbox justify-center align-center">
              <router-link v-if="isLogin" class="login-btn nav-link" :to="{name: 'dashboard'}">Dashboard</router-link>
              <span v-else class="">
                <router-link class="login-btn" :to="{name: 'login'}">Login</router-link>
                <!-- <el-button class="ml10" type="text">Register</el-button> -->
                <a class="login-btn ml10" @click="registerClick">Sign up</a>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
<script>
export default {
  name: 'b-navbar',
  props: {},
  data() {
    return {
      activeIndex: 0,
      menuList: [
        { name: 'Home', href: 'home' },
        { name: 'FAQ', href: 'faq' }
        // { name: 'Contact', href: 'contact' }
      ],
      isShow: false
    }
  },
  computed: {
    isLogin() {
      return !!this.$store.getters.token
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    goLink(index) {
      this.activeIndex = index
    },
    handleScroll() {
      const scroll = document.documentElement.scrollTop || document.body.scrollTop
      if (scroll <= 5) {
        this.isShow = false
      } else {
        this.isShow = true
      }
    },
    registerClick() {
      this.$router.push({ name: 'register' })
    }
  }
}
</script>
<style scoped>
</style>
