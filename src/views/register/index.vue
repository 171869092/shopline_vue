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
              <el-button type="primary" class="float-right" @click="SignIn">Sign In</el-button>
            </div>
            <div class="form-padding">
              <h3 class="text-cetner">You’re  2 minutes away from building your ecommerce empire</h3>
              <form class="register-form">
                <div class="form-group">
                  <label for="exampleInputEmail1">Your Email</label>
                  <input id="exampleInputEmail1" type="email" class="form-control" aria-describedby="emailHelp" placeholder="Your Email">
                  <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div class="form-group">
                  <label for="formGroupExampleInput">Identifying Code</label>
                  <input id="formGroupExampleInput" type="text" class="form-control" placeholder="Identifying Code">
                </div>
                <div class="form-group">
                  <label for="formGroupExampleInput">Your Name</label>
                  <input id="formGroupExampleInput" type="text" class="form-control" placeholder="Your Name">
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <input id="exampleInputPassword1" type="password" class="form-control" placeholder="Password">
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Confirm Password</label>
                  <input id="exampleInputPassword1" type="password" class="form-control" placeholder="Confirm Password">
                </div>
                <el-button class="s-btn" :loading="loading" @click="handleRegister">Get Started</el-button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import BNavbar from '@/views/home/components/navbar'
export default {
  name: 'register',
  components: {
    // BNavbar
  },
  props: {},
  data() {
    return {
      form: {},
      rules: {},
      loading: false
    }
  },
  computed: {},
  created() {},
  methods: {
    // 返回登陆
    SignIn() {
      this.$router.push({ name: 'login' })
    },
    handleRegister() {

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
.register-form {
  padding-top: 40px;
}
.imageLeft{
  background: url(~@/assets/home/register.jpg) no-repeat center;
  background-size: cover;
  width:100%;
  height: 100%;
  display: inline-block;
}
</style>
