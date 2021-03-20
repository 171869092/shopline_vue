<template>
  <div style="overflow: hidden;">
    <!-- <b-navbar /> -->
    <div class="login-container">
      <!-- <div class="left-panel">
        <div class="imageLeft" />
      </div> -->
      <div class="right-panel">
        <div class="login-box flexbox justify-center align-center">
          <div class="login">
            <div class="login-header flexbox justify-space-between">
              <router-link :to="{name: 'home'}">
                <img class="cursor_p" src="@/assets/home/logo@2x.png" alt="" style="width:130px">
              </router-link>
              <div><el-button @click="SignUp">Sigin up</el-button></div>
            </div>
            <div class="login-form">
              <div class="login-tip">
                <h5>
                  <span class="primary">You’re 2 minutes away </span>
                  <span>from building your ecommerce empire</span>
                </h5>
              </div>
              <el-form ref="loginForm" :model="loginForm" :rules="rules" class="mt40" label-position="top">
                <el-form-item label="Your Email" prop="email">
                  <el-input v-model="loginForm.email" />
                </el-form-item>
                <el-form-item label="Your Password" prop="password">
                  <el-input v-model="loginForm.password" type="password" show-password @keyup.enter.native="handleLogin" />
                </el-form-item>
              </el-form>
              <div class="btn-group mt20">
                <el-button type="primary" :loading="loading" @click="handleLogin()">Login</el-button>
                <el-button type="text">Forget Password</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="login-footer">
          <div class="social-icon">
            <ul>
              <li><img src="@/assets/home/icon-1@2x.png" alt=""></li>
              <li><img src="@/assets/home/icon-2@2x.png" alt=""></li>
              <li><img src="@/assets/home/icon-3@2x.png" alt=""></li>
              <li><img src="@/assets/home/icon-4@2x.png" alt=""></li>
              <li><img src="@/assets/home/icon-5@2x.png" alt=""></li>
            </ul>
          </div>
          <hr>
          <div class="info text-center">
            <p>© 2020-2021 FbAil All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getCookie } from '@/utils/cookie'
export default {
  name: 'login',
  components: {
    // BNavbar
  },
  props: {},
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
        id: 1
      },
      rules: {
        email: [
          { required: true, message: 'Can not be empty', trigger: 'blur' },
          { pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, message: 'Please input the correct email address', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Can not be empty', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {},
  created() {},
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const shop = getCookie('shop') || ''
          this.$store.dispatch('user/login', { LoginForm: this.loginForm, id: 1, shop: shop }).then(() => {
            this.$router.push({ name: 'dashboard' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 返回注册
    SignUp() {
      this.$router.push({ name: 'register' })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  align-items: center;
  display: flex;
  height: 100vh;
}
// .form {
//   padding: 60px 0;
//   background: rebeccapurple;
//   position: relative;
//   top: 50%;
// }
.form-padding {
  padding: 4em;
}
.imageLeft {
  background: url(~@/assets/home/login.png) no-repeat center;
  // background: url("https://dx-tech-bucket.s3.amazonaws.com/20201206040409405d56b699830e77ba53855679cb1d252da") no-repeat center;
  background-size: cover;
  width: 100%;
  height: 100vh;
}
</style>
