<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
        <h3>{{ $route.query }}</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>
      <el-button v-google-signin-button="clientId" style="width:100%;" class="google-signin-button"> Continue with Google</el-button>
      <fb-signin-button :params="fbSignInParams" @success="onSignInSuccess" @error="onSignInError">
        <div style="display: flex;align-items: center;margin-left:100px">
          <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/szGrb_tkxMW.png">
          <span>Sign in with Facebook</span>
        </div>
      </fb-signin-button>
      <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div>

    </el-form>
  </div>
</template>

<script>
// import createApp from '@shopify/app-bridge'
import { testApi, gtoken } from '@/api/user'
// import { getSessionToken } from '@shopify/app-bridge-utils'
import { validUsername } from '@/utils/validate'
import GoogleSignInButton from '@/directive/google-signin'
import jsonwebtoken from 'jsonwebtoken'
export default {
  name: 'Login',
  directives: {
    GoogleSignInButton
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      // 谷歌clientId
      clientId: '849399331232-9d6f841g5t671s3t1ga1gvgqj99voa5n.apps.googleusercontent.com',
      // facebook配置
      fbSignInParams: {
        scope: 'email,user_likes',
        return_scopes: true
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  async mounted() {
    console.log(this.$route.query)
    // const query = { 'code': '1c0199484a1e28854cb96d47759b61b3', 'hmac': '90bddb272fb82234eae3f8085eea0f5d86f7a76598e4467d4bcd8726b7ed8b7e', 'shop': 'live-by-test.myshopify.com', 'timestamp': '1603941523' }
    // console.log(this.serialize(this.$route.query))
    // const shopOrigin = 'live-by-test.myshopify.com'
    // const apiKey = '5fdf0435f9093519625df5bfca4c8a31'
    // const app = createApp({
    //   apiKey: apiKey,
    //   shopOrigin: shopOrigin
    // })
    // const sessionToken = await getSessionToken(app) // requires an App Bridge instance
    // console.log('token', sessionToken)
    // const url = 'https://' + shopOrigin + '/admin/api/2019-10/products.json'
    // productApi(url, sessionToken, { limit: 50 }).then(res => {
    //   console.log('product', res.data)
    // }).catch(err => {
    //   console.log(err)
    // })
    // eslint-disable-next-line no-prototype-builtins
    if (this.$route.query.hasOwnProperty('hmac')) {
      gtoken(this.$route.query).then(res => {
        console.log(res.data)
        testApi({ ...this.$route.query, token: res.data }).then(res => {
          console.log(res.data)
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },
  methods: {
    // coogle第三方返回
    OnGoogleAuthSuccess(idToken) {
      console.log(idToken, 'tokesdasdasd') // 返回第三方结果信息 默认是全token 要用jsonwebtoken 解析
      // Receive the idToken and make your magic with the backend
      const detoken = jsonwebtoken.decode(idToken)
      console.log(detoken)
    },
    OnGoogleAuthFail(error) {
      console.log(error)
    },
    serialize(obj) {
      var str = []
      for (var p in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
        }
      }
      return str.join('&')
    },
    // facebook
    onSignInSuccess(response) {
      // FB.api('/me', dude => {
      console.log(response) // 返回第三方的登录信息 tolen等
      const fbtoken = jsonwebtoken.decode(response.authResponse.accessToken)
      console.log(fbtoken)
    },
    onSignInError(error) {
      console.log(error)
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ name: 'Dashboard' })
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
    GoogleLogin() {

    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
   .fb-signin-button {
    /* This is where you control how the button looks. Be creative! */
    padding: 8px 24px;
    border-radius: 16px;
    background-color: #67c23a;
    color: #fff;
    span{
      margin-left: 20px;
      font-size: 14px;
    }
  }
}
</style>
