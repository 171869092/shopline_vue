<template>
  <div>
    <navbar />
    <main>
      <div class="banner-2" />
      <section class="wap m-navbar-top banner-box">
        <div class="background-overlay" />
        <div class="jumbotron">
          <!-- <img src="@/assets/home/banner@2x.png" alt="" srcset="" style="width:100%"> -->
          <div class="container banner-bg">
            <div class="row">
              <div class="banner-left col-lg-6">
                <h1>Support more controllable supply chain services</h1>
                <div>
                  <span
                    class="banner-title"
                  >FbAli allows you to control total supply chain service,
                    including shipping, products, inventory, and vendors for
                    your e-commerce business.</span>
                </div>
                <div class="banner-button">
                  <el-button type="primary">Try It Free</el-button>
                </div>
              </div>
              <div class="banner-right col-lg-6">
                <img src="@/assets/home/banner3.png" alt="" class="banner3">
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- <section>
        <div class="page-container">
          <h2 class="text-center p-5">
            <img
              src="@/assets/home/section-1@2x.png"
              alt=""
              style="width: 220px"
            >
          </h2>
          <swiper class="swiper" :options="swiperOption">
            <swiper-slide v-for="(item, key) in swiperList" :key="key">
              <img style="width: 100%" :src="item.url" alt="">
            </swiper-slide>
            <div slot="pagination" class="swiper-pagination" />
          </swiper>
        </div>
      </section> -->
      <!-- <section class="marketing">
        <div class="container">
          <h2 class="text-center p-5">
            <img
              src="@/assets/home/section-2@2x.png"
              alt=""
              style="width: 220px"
            >
          </h2>
          <div class="row mb-5">
            <div class="col-lg-3 text-center">
              <img
                src="@/assets/home/section-block-1@2x.png"
                alt=""
                width="100%"
              >
              <p class="title mt-4">
                Customer purchases products from your online store
              </p>
            </div>
            <div class="col-lg-3 text-center">
              <img
                src="@/assets/home/section-block-2@2x.png"
                alt=""
                width="100%"
              >
              <p class="title mt-4">
                Your suppliers ship the product to your customer
              </p>
            </div>
            <div class="col-lg-3 text-center">
              <img
                src="@/assets/home/section-block-3@2x.png"
                alt=""
                width="100%"
              >
              <p class="title mt-4">
                Their order goes directly to your suppliers
              </p>
            </div>
            <div class="col-lg-3 text-center">
              <img
                src="@/assets/home/section-block-4@2x.png"
                alt=""
                width="100%"
              >
              <p class="title mt-4">
                You keep the profit from the retail price
              </p>
            </div>
          </div>
        </div>
      </section> -->

      <!-- <section>
        <div class="container">
          <h2 class="text-center p-5">
            <img
              src="@/assets/home/section-3@2x.png"
              alt=""
              style="width: 240px"
            >
          </h2>
          <div class="row pb-5">
            <div
              v-for="(item, idx) in threeList"
              :key="idx"
              class="col-lg-3 text-center"
            >
              <img :src="item.image" alt="" width="100%">
            </div>
          </div>
        </div>
      </section> -->

      <section class="featurette-padding">
        <div class="container">
          <h2 class="text-center p-5">
            <!-- <img
            src="@/assets/home/section-4@2x.png"
            alt=""
            style="width: 200px"
          > -->
            <!-- Tracking easily and in-time -->
          </h2>
          <div class="row featurette">
            <div class="col-md-6">
              <h2 class="ml30 mt80">Tracking easily and in-time</h2>
              <p class="lead ml30 mt30 featurette-title">
                FbAli allows you to check the in-time tracking details for your
                order from top Chinese logistics service providers, including
                YunExpress, 4PX, ChinaPost, and so on.
              </p>
            </div>
            <div class="col-md-6">
              <img
                src="@/assets/home/section-block-9@2x.png"
                alt=""
                width="100%"
              >
            </div>
          </div>
        </div>
      </section>
      <section style="background: #fafbff" class="featurette-padding">
        <div class="container">
          <div class="row featurette">
            <div class="col-md-6">
              <img
                src="@/assets/home/section-block-9@2x.png"
                alt=""
                width="100%"
              >
            </div>
            <div class="col-md-6">
              <h2 class="ml30 mt80">Filtered source agent</h2>
              <p class="lead ml30 mt30 featurette-title">
                FbAli had the most stringent credit screening for source agent.
                Every agent joined in FbAli should be examined and verified.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="featurette-padding">
        <div class="container">
          <div class="row featurette">
            <div class="col-md-6">
              <h2 class="ml30 mt80">Auto processing orders</h2>
              <p class="lead ml30 mt30 featurette-title">
                FbAli allows you to host your products to the vendor directly,
                which will make your orders to be processed by the vendor in
                time and automatically.
              </p>
            </div>
            <div class="col-md-6">
              <img
                src="@/assets/home/section-block-9@2x.png"
                alt=""
                width="100%"
              >
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer-home />
  </div>
</template>
<script>
// import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
// import 'swiper/css/swiper.css'
import { setCookies } from '@/utils/cookies'
import Navbar from '@/views/home/components/navbar'
import footerHome from '@/views/home/components/footer'
export default {
  components: {
    Navbar,
    footerHome
  },
  data() {
    return {
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
  created() {
    // console.log({ ...this.$route.query })
    const query = this.$route.query
    if (Object.hasOwnProperty.call(query, 'hmac')) {
      setCookies('shopify', query)
      setCookies('shop', query.shop)
    }
  },
  methods: {
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
    policyClick() {
      this.$router.push({ name: 'privacy-policy' })
    }
  }
}
</script>
<style scoped>
.banner-box {
  position: relative;
}
.banner-2 {
  background: url("../../assets/home/banner2.png") no-repeat;
  height: 100%;
  width: 100%;
  background-size: 33%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background-position-x: 65%;
}
.banner-bg {
  /* display: grid;
  grid-template-columns: repeat(2, 1fr); */
  /* justify-items: center;
  align-items: center; */
}
.background-overlay {
  background: url("../../assets/home/banner1.png") no-repeat;
  background-position: 60%;
  background-size: contain;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
}
.banner-left .banner-title {
  color: #5b5b5b;
  font-size: 20px;
  font-weight: 400;
  /* line-height: 11px; */
}
.banner-right {
  width: 76%;
  z-index: 3;
}
.banner-left h1 {
  color: #01004d;
  font-size: 36px;
  font-weight: 800;
  font-style: normal;
  line-height: 1.3em;
}
.banner-button {
  margin-top: 50px;
}
/* .banner-right{
  position: relative;
}
.banner3{
  position: absolute;
  right: 10px;
} */
.featurette-title {
  color: #5f5f64;
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  margin: 0px 30px 0px 0px;
}
.featurette-padding {
  padding: 5rem;
}
</style>
