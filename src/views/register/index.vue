<template>
  <div style="overflow: hidden;">
    <!-- <b-navbar /> -->
    <div class="login-container">
      <!-- <div class="left-panel">
        <img width="100%" src="https://demo.htmlhunters.com/shopy/assets/images/demo/index2-slide-2.jpg" alt="">
        <div class="imageLeft" />
      </div> -->

      <div class="right-panel">
        <div class="login-box flexbox justify-center align-center">
          <div class="login">
            <div class="login-header flexbox justify-space-between">
              <router-link :to="{name: 'home'}">
                <img class="cursor_p" src="@/assets/home/logo@2x.png" alt="" style="width:130px">
              </router-link>
              <div><el-button @click="SignIn">Sigin in</el-button></div>
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
                  <el-input v-model="loginForm.email" type="email" />
                </el-form-item>
                <el-form-item label="Email Verification Code" prop="code">
                  <el-input v-model="loginForm.code" autocomplete="off">
                    <el-button slot="append" class="secondary" :disabled="startCount" @click="sendCode">
                      <i class="el-icon-s-promotion" /> Send<span v-show="startCount">({{ timeCount }})</span>
                    </el-button>
                  </el-input>
                </el-form-item>
                <el-form-item label="Your Password" prop="password">
                  <el-input v-model="loginForm.password" autocomplete="new-password" type="password" />
                </el-form-item>
                <el-form-item label="Your Name" prop="name">
                  <el-input v-model="loginForm.name" />
                </el-form-item>
              </el-form>
              <div class="btn-group mt20">
                <el-button type="primary" :loading="loading" @click="handleRegister()">Get Started</el-button>
                <!-- <el-button type="text">Forget Password</el-button> -->
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
// import BNavbar from '@/views/home/components/navbar'
// import { getSession } from '@/utils/session'
import { sendEmail } from '@/api/user'
import { getCookies } from '@/utils/cookies'
export default {
  name: 'register',
  components: {
    // BNavbar
  },
  props: {},
  data() {
    return {
      loginForm: {
        email: '',
        code: '',
        password: '',
        name: ''
      },
      rules: {
        email: [
          { required: true, message: 'Email can not be empty', trigger: 'blur' },
          { pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, message: 'Please input the correct email address', trigger: 'blur' }
        ],
        code: [{ required: true, message: 'Verification code can not be empty', trigger: 'blur' }],
        password: [{ required: true, message: 'Password can not be empty', trigger: 'blur' }],
        name: [{ required: true, message: 'Name Can not be empty', trigger: 'blur' }]
      },
      loading: false,
      startCount: false,
      timeCount: 60,
      shopifyQuery: {
        code: '',
        hmac: '',
        host: '',
        shop: '',
        timestamp: ''
      }
    }
  },
  computed: {},
  created() {},
  methods: {
    sendCode() {
      if (this.loginForm.email) {
        this.startCount = true
        const count = setInterval(() => {
          this.timeCount = --this.timeCount
          if (this.timeCount === 0) {
            clearInterval(count)
            this.startCount = false
            this.timeCount = 60
          }
        }, 1000)
        sendEmail({ email: this.loginForm.email }).then(res => {
          console.log(res.data)
          if (res.code === 200) {
            this.$message.success('Sent successfully')
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$refs.loginForm.validateField('email')
      }
    },
    // 返回登陆
    SignIn() {
      this.$router.push({ name: 'login' })
    },
    handleRegister() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // const shopify = getSession('shopify')
          // const shop = shopify && shopify.shop ? shopify.shop : ''
          const shop = getCookies('shop') || ''
          const shopify = getCookies('shopify')
          if (shopify) {
            this.shopifyQuery = JSON.parse(shopify)
          }
          this.$store.dispatch('user/register', { ...this.loginForm, shop: shop, shopify: this.shopifyQuery }).then(() => {
            this.$router.push({ name: 'dashboard' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('err')
        }
      })
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
.register-form {
  padding-top: 40px;
}
.imageLeft {
  background: url("~@/assets/home/register.png") no-repeat center;
  background-size: cover;
  width: 100%;
  height: 100vh;
}
</style>
