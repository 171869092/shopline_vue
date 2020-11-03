<template>
  <header>
    <nav class="navbar navbar-expand-md fixed-top s-navbar navbar-light white-bg shadow-sm">
      <div class="container">
        <a class="navbar-brand" href="#">DropShipping</a>
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
            <span class="login-btn" @click="loginClick">LOGIN</span>
            <button type="button" class="btn btn-lg s-btn" @click="registerClick">Get Started</button>
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
    return {}
  },
  computed: {},
  created() {},
  methods: {}
}
</script>
<style scoped>
</style>
