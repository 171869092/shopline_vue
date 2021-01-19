<template>
  <div>
    <navbar />
    <main>
      <section>
        <div class="container">
          <div class="flexbox elementor-widget-wrap">
            <div class="element-cai">
              <div class="elementor-image">
                <img src="@/assets/home/banner1.png" title="" alt="">
              </div>
            </div>
            <div class="element-cloud">
              <div class="elementor-image">
                <img src="@/assets/home/banner2.png" title="" alt="">
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="wap m-navbar-top banner-box">
        <div class="banner-stars" />
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
                <img class="banner3" src="@/assets/home/banner3.png" alt="">
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

      <section style="padding-bottom: 5rem">
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
              <img src="@/assets/home/details.jpeg" alt="" width="90%">
            </div>
          </div>
        </div>
      </section>
      <section style="background: #fafbff" class="featurette-padding">
        <div class="container">
          <div class="row featurette">
            <div class="col-md-6">
              <img src="@/assets/home/details1.png" alt="" width="90%">
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
              <img src="@/assets/home/details2.jpeg" alt="" width="90%">
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
<style lang="scss" scoped>
.banner-box {
  position: relative;
  padding: 0 !important;
}
.elementor-widget-wrap {
  position: relative;
  // width: 100%;
  flex-wrap: wrap;
  align-content: flex-start;
}
.element-cai {
  position: absolute;
  // width: 100%;
  // bottom: 27px;
  // right: -75px;
  z-index: 0;
  text-align: center;
  top: 40px;
  left: 5%;
  z-index: 1;
  .elementor-image {
    img {
      width: 140%;
      // max-width: 100%;
      vertical-align: middle;
      display: inline-block;
    }
  }
}
.element-cloud {
  position: absolute;
  // bottom: 377px;
  // right: -280px;
  left: 32%;
  z-index: 1;
  .elementor-image {
    img {
      width: 115%;
      // max-width: 76%;
      vertical-align: middle;
      display: inline-block;
    }
  }
}

.banner3 {
  width: 110%;
}
.banner-left {
  margin-top: 40px;
}
.banner-left .banner-title {
  color: #5b5b5b;
  font-size: 20px;
  font-weight: 400;
  /* line-height: 11px; */
}
.banner-right {
  z-index: 10;
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
.banner-stars {
  background: url("../../assets/home/stars.png");
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  background-position: center center;
  background-size: cover;
}
</style>
