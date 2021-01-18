<template>
  <footer class="b-footer footer-bg">
    <div class="container">
      <!-- <p class="float-right">
        <a href="#">Back to top</a>
      </p>
      <p class="float-left">
        <span class="pointer" @click="policyClick">Privacy Policy</span>
      </p> -->
      <div class="footer-title">
        <h2 class="title is-2">
          Start with FaAil, take your business to next level!
        </h2>
        <el-button
          type="primary"
          class="botton-color"
          @click="tryFree"
        >Try It Free</el-button>
      </div>
      <div class="site-link content">
        <div>
          <a class="navbar-brand mr50" href="/">
            <img src="@/assets/home/logo@white.png" alt="" class="footer-logo">
          </a>
        </div>
        <div>
          <p>
            <a href="/">About us</a>
          </p>
          <p>
            <a href="/">Supply Service</a>
          </p>
          <p>
            <a href="/">Blog</a>
          </p>
        </div>
        <div>
          <p>
            <a href="/privacy-policy">Privacy Policy</a>
          </p>
          <p>
            <a href="/">Online Support</a>
          </p>
        </div>
      </div>
      <div class="content has-text-centered">
        © 2020-2021 FbAil All rights reserved.
        <!-- ICP: BJ-18032848 -->
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'b-footer',
  props: {},
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    // policyClick() {
    //   this.$router.push({ name: 'privacy-policy' })
    // },
    tryFree() {
      this.$router.push({ name: 'register' })
    }
  }
}
</script>
<style scoped>
.footer-bg {
  background: #f28c60;
  padding: 12px 12px 16px;
  color: #fff;
}
.is-2 {
  font-size: 2.5rem;
}
.footer-title {
  padding: 50px 5%;
  margin-bottom: 60px;
  text-align: center;
  position: relative;
}
.botton-color {
  width: 200px;
  height: 60px;
  background: #fff;
  color: #f28c60;
  font-size: 24px;
  margin-top: 20px;
}
.site-link {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 1.5rem;
}
.has-text-centered {
  text-align: center !important;
}
.footer-logo{
  width: 150px;
  border-bottom: 2px solid #fff;
  padding-bottom: 12px;
}
</style>
