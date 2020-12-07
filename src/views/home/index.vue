<template>
  <div>
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
                <router-link class="login-btn" :to="{name: 'product'}">Dashboard</router-link>
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
    <main>
      <section class="wap m-navbar-top">
        <!-- <div class="jumbotron"> -->
        <img src="@/assets/home/banner@2x.png" alt="" srcset="" style="width:100%">
        <!-- <div class="container">
            <h1 class="display-4">Hello, world!</h1>
            <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
            <hr class="my-4">
            <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
            <p>{{ $route.query }}</p>
            <a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
          </div> -->
        <!-- </div> -->
      </section>
      <section>
        <div class="page-container">
          <h2 class="text-center p-5">
            <img src="@/assets/home/section-1@2x.png" alt="" style="width:220px">
          </h2>
          <swiper class="swiper" :options="swiperOption">
            <swiper-slide v-for="(item, key) in swiperList" :key="key">
              <img style="width:100%" :src="item.url" alt="">
            </swiper-slide>
            <div slot="pagination" class="swiper-pagination" />
          </swiper>
        </div>
      </section>
      <section class="marketing">
        <div class="container">
          <h2 class="text-center p-5">
            <img src="@/assets/home/section-2@2x.png" alt="" style="width:220px">
          </h2>
          <div class="row mb-5">
            <div class="col-lg-3 text-center">
              <img src="@/assets/home/section-block-1@2x.png" alt="" width="100%">
              <p class="title mt-4">Customer purchases products from your online store</p>
            </div>
            <div class="col-lg-3 text-center">
              <img src="@/assets/home/section-block-2@2x.png" alt="" width="100%">
              <p class="title mt-4">Your suppliers ship the product to your customer</p>
            </div>
            <div class="col-lg-3 text-center">
              <img src="@/assets/home/section-block-3@2x.png" alt="" width="100%">
              <p class="title mt-4">Their order goes directly to your suppliers</p>
            </div>
            <div class="col-lg-3 text-center">
              <img src="@/assets/home/section-block-4@2x.png" alt="" width="100%">
              <p class="title mt-4">You keep the profit from the retail price</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="container">
          <h2 class="text-center p-5">
            <img src="@/assets/home/section-3@2x.png" alt="" style="width:240px">
          </h2>
          <div class="row pb-5">
            <div v-for="(item,idx) in threeList" :key="idx" class="col-lg-3 text-center">
              <img :src="item.image" alt="" width="100%">
              <!-- <h5 class="title mt-4">{{ item.name }}</h5> -->
            </div>
          </div>
        </div>
      </section>

      <section class="container">
        <h2 class="text-center p-5">
          <img src="@/assets/home/section-4@2x.png" alt="" style="width:200px">
        </h2>
        <div class="row featurette">
          <div class="col-md-6">
            <img src="@/assets/home/section-block-9@2x.png" alt="" width="100%">
          </div>
          <div class="col-md-6">
            <div class="shopify-logo">
              <img src="@/assets/home/shopify-logo.png" alt="" width="150px">
            </div>
            <h3 class="ml30">Shopify</h3>
            <p class="lead ml30 mt30">
              DropShipping integrates with all your favorite eCommerce platforms. Get started dropshipping today!
            </p>
          </div>
        </div>
      </section>
      <section class="about">
        <div class="container-fluid">
          <div class="row p10">
            <div class="col-md-6">
              <div class="text-center">
                <img src="@/assets/home/section-block-10@2x.png" alt="" width="800px">
              </div>
            </div>
            <div class="col-md-6">
              <div class="about-us">
                <h2>
                  <img src="@/assets/home/section-5@2x.png" alt="" style="width:220px">
                </h2>
                <p class="mt40" style="width:450px">Password specification: more than 8 digits, English letters + numbers The user clicks to obtain the verification code, and the verification code is sent to the user's email. The specific verification code is attached to the email. The user needs to fill in the correct and register successfully</p>
                <el-button class="mt20" type="primary">Contact</el-button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer class="b-footer">
      <div class="container">
        <p class="float-right">
          <a href="#">Back to top</a>
        </p>
        <p>Album example is © Bootstrap, but please download and customize it for yourself!</p>
        <p>New to Bootstrap? <a href="https://v4.bootcss.com/">Visit the homepage</a> or read our <a href="/docs/getting-started/introduction/">getting started guide</a>.</p>
      </div>
    </footer>
  </div>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { shopifyApi } from '@/api/user'
// import createApp from '@shopify/app-bridge'
// import { Redirect, Button } from '@shopify/app-bridge/actions'
// import { getSessionToken } from '@shopify/app-bridge-utils'

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      activeIndex: 0,
      menuList: ['Home', 'FAQ', 'Contact'],
      swiperOption: {
        slidesPerView: 6,
        spaceBetween: 30,
        mousewheel: true,
        disableOnInteraction: false,
        loop: true,
        autoplay: {
          delay: 5000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        }
      },
      threeList: [
        { image: require('@/assets/home/section-block-5@2x.png') },
        { image: require('@/assets/home/section-block-6@2x.png') },
        { image: require('@/assets/home/section-block-7@2x.png') },
        { image: require('@/assets/home/section-block-8@2x.png') }
      ],
      swiperList: [
        { url: require('@/assets/home/swiper-1@2x.png') },
        { url: require('@/assets/home/swiper-2@2x.png') },
        { url: require('@/assets/home/swiper-3@2x.png') },
        { url: require('@/assets/home/swiper-4@2x.png') },
        { url: require('@/assets/home/swiper-5@2x.png') }
      ]
    }
  },
  computed: {
    isLogin() {
      return !!this.$store.getters.token
    }
  },
  created() {
    this.shopifyInit()
  },
  async mounted() {
    // console.log('init')
    // const shopOrigin = 'live-by-test.myshopify.com'
    // const apiKey = '5fdf0435f9093519625df5bfca4c8a31'
    // const app = createApp({
    //   apiKey: apiKey,
    //   shopOrigin: shopOrigin
    // })
    // // requires an App Bridge instance
    // const sessionToken = await getSessionToken(app)
    // console.log('token', sessionToken)
  },
  methods: {
    shopifyInit() {
      // const query = { 'code': 'c20411e3859748cc53f583b221048c81', 'hmac': '5cba719e7d85008aa29d7a33e946e1123595cbda5647958e40257699c4f4bb3b', 'shop': 'live-by-test.myshopify.com', 'timestamp': '1606810839' }
      // console.log(this.serialize(query))

      // eslint-disable-next-line no-prototype-builtins
      if (this.$route.query.hasOwnProperty('hmac')) {
        shopifyApi({ ...this.$route.query }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      }
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
    goLink(index) {
      this.activeIndex = index
    },
    registerClick() {
      this.$router.push({ name: 'register' })
    }
  }
}
</script>
