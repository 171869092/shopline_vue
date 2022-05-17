<template>
  <div>
    <navbar />
    <main>
      <section class="wap wap-top">
        <div class="About-banner">
          <div class="container">
            <div>
              <!-- <h1 class="title is-1">Welcome</h1> -->
            </div>
          </div>
        </div>
      </section>
      <section class="featurette-padding">
        <!-- <div class="container"> -->
        <div class="row featurette">
          <div class="col-md-6">
            <h2 class="ml30 mt80">About us</h2>
            <p class="lead ml30 mt30">
              What we've been thinking about is “Dropshipping is a good
              starting, but what is the next?”. Faster shipping speed, better
              product quality, higher quality after-service …. We came from a
              data company and we are aiming to revolute the dropshipping market
              by focusing on all data in the whole dropshipping chain.
            </p>
          </div>
          <div
            class="col-md-6"
            style="display: flex; justify-content: center; align-items: center"
          >
            <img src="@/assets/home/about_us.jpg" alt="" width="100%">
          </div>
        </div>
        <!-- </div> -->
      </section>
      <section style="padding: 5rem 7rem 7rem 7rem">
        <div class="container">
          <h2 class="text-center">The values we live by</h2>
          <div class="row featurette">
            <div class="col-md-4">
              <el-card type="card" class="mt50" style="min-height: 220px">
                <img
                  src="@/assets/home/about_ourStrengths_item_01.png"
                  alt=""
                  srcset=""
                >
                <h4 class="text-align">Humble</h4>
                <p class="lead ml30 mt20 featurette-title">
                  For the better product and the better service, we will listen
                  to every customer's advice with an open mind.
                </p>
              </el-card>
            </div>
            <div class="col-md-4">
              <el-card type="card" class="mt50" style="min-height: 220px">
                <img
                  src="@/assets/home/about_ourStrengths_item_02.png"
                  alt=""
                  srcset=""
                >
                <h4 class="text-align">Mission</h4>
                <p class="lead ml30 mt20 featurette-title">
                  Let 300k Dropshipper not close its own shop because of product
                  quality, logistics quality and after-sales problems.
                </p>
              </el-card>
            </div>
            <div class="col-md-4">
              <el-card type="card" class="mt50" style="min-height: 220px">
                <img
                  src="@/assets/home/about_ourStrengths_item_03.png"
                  alt=""
                  srcset=""
                >
                <h4 class="text-align">Vision</h4>
                <p class="lead ml30 mt20 featurette-title">
                  Let every retailer and buyer experience high quality
                  e-commerce supply chain service.
                </p>
              </el-card>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer-home />
  </div>
</template>
<script>
import Navbar from '@/views/home/components/navbar'
import footerHome from '@/views/home/components/footer'
export default {
  name: 'privacy-policy',
  components: {
    Navbar,
    footerHome
  },
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
.About-banner {
  background: url("../../assets/home/about_us1.jpeg") no-repeat;
  height: 490px;
  /* margin-top: -80px; */
  width: 100%;
  background-position: center center;
  background-size: cover;
}
.title {
  font-weight: 600;
  /* margin-bottom: 1.5rem; */
}
.is-1 {
  font-size: 3rem;
  color: #fff;
  line-height: 490px;
  text-align: center;
}
.wap-top {
  margin-top: 80px;
}
.block {
  margin-bottom: 1.5rem;
}
.block-title {
  color: #4a4a4a;
  font-size: 1em;
  font-weight: 400;
  line-height: 1.5;
}
.featurette-padding {
  padding: 5rem;
}
.text-align {
  text-align: center;
  margin-top: -25px;
}
.featurette-title {
  color: #5f5f64;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  /* margin: 0px 30px 0px 0px; */
}
</style>
