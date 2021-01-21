<template>
  <div>
    <navbar />
    <main>
      <section class="wap wap-top">
        <div class="privacy-banner">
          <div class="container">
            <h1 class="title is-1">FAQ</h1>
          </div>
        </div>
      </section>
      <section class="wap wap-top">
        <div class="container">
          <h3 class="title">FbAli Privacy Policy</h3>
          <div class="block">
            <p class="block-title">
              FbAli provides lightweight ERP including product management, orders management and shipping management, and auto-processing for orders to merchants who use Shopify to power their stores. This Privacy Policy describes how personal information is collected, used, and shared when you install or use the App in connection with your Shopify-supported store.
            </p>
          </div>
        </div>
      </section>
      <section class="wap wap-top">
        <div class="container">
          <h3 class="title">Contacting</h3>
          <div class="block">
            <p class="block-title">
              Contact Us For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at fulfilbyali@gmail.com or by mail using the details provided below:
            </p>
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
  name: 'faq',
  components: {
    Navbar,
    footerHome
  },
  props: {},
  data() {
    return {
    }
  },
  computed: {
  },
  created() {},
  methods: {
  }
}
</script>
<style scoped>
.privacy-banner{
  background: #f28c60;
  height: 490px;
  /* margin-top: -80px; */
}
.title{
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.is-1{
  font-size: 3rem;
  color: #fff;
  line-height: 410px;
  text-align: center;
}
.wap-top{
  margin-top: 80px;
}
.block{
  margin-bottom: 1.5rem;
}
.block-title{
  color: #4a4a4a;
    font-size: 1em;
    font-weight: 400;
    line-height: 1.5;
}
</style>
