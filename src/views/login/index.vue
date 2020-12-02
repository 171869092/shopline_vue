<template>
  <div style="overflow: hidden;">
    <!-- <b-navbar /> -->
    <div class="row">
      <div class="col">
        <!-- <img width="100%" src="https://demo.htmlhunters.com/shopy/assets/images/demo/index2-slide-2.jpg" alt=""> -->
        <span class="imageLeft" />
      </div>
      <div class="col">
        <div class="container">
          <div class="form">
            <div class="clearfix">
              <div class="float-left">
                <h2>DropShipping</h2>
              </div>
              <!-- <button type="button" class="btn btn-danger btn-md float-right" @click="SignUp">Sign up</button> -->
              <el-button type="primary" class="float-right" @click="SignUp">Sign Up</el-button>
            </div>
            <div class="form-padding">
              <h3 class="text-cetner">You’re  2 minutes away from building your ecommerce empire</h3>
              <el-form ref="loginForm" :model="loginForm" class="login-form">
                <div class="form-group">
                  <label for="exampleInputEmail1">Your Email</label>
                  <el-input v-model="loginForm.email" placeholder="Your Email" />
                  <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <el-input v-model="loginForm.password" type="password" placeholder="Password" />
                </div>
                <!-- <button type="button" :disabled="loading" class="btn btn-lg s-btn" @click="handleLogin">Log In</button> -->
                <el-button class="s-btn" @click="handleLogin">Log In</el-button>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { testApi, gtoken } from '@/api/user'
export default {
  name: 'login',
  components: {
    // BNavbar
  },
  props: {},
  data() {
    return {
      rules: {},
      loginForm: {
        email: '171869092@qq.com',
        password: '123456',
        id: 1
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
          this.$store.dispatch('user/login', this.loginForm).then(() => {
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
.container{
  align-items: center;
  display: flex;
  height: 100vh
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
.login-form {
  padding-top: 40px;
}
.imageLeft{
  background: url(~@/assets/home/login.png) no-repeat center;
  background-size: cover;
  width:100%;
  height: 100%;
  display: inline-block;
}
</style>
