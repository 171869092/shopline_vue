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
      <section
        v-for="(item, key) in containList"
        :key="key"
        class="wap contain"
        @click="containClick"
      >
        <div class="container">
          <el-card type="card">
            <h5 class="title">{{ item.title }}</h5>
            <div class="block">
              <p class="block-title">
                {{ item.test }}
              </p>
            </div>
          </el-card>
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
      containList: [
        {
          title: 'FbAli Privacy Policy?',
          test:
            ' FbAli provides lightweight ERP including product management, orders management and shipping management, and auto-processing for orders to merchants who use Shopify to power their stores. This Privacy Policy describes how personal information is collected, used, and shared when you install or use the App in connection with your Shopify-supported store.'
        },
        {
          title: 'FbAli Privacy Policy?',
          test:
            ' FbAli provides lightweight ERP including product management, orders management and shipping management, and auto-processing for orders to merchants who use Shopify to power their stores. This Privacy Policy describes how personal information is collected, used, and shared when you install or use the App in connection with your Shopify-supported store.'
        },
        {
          title: 'FbAli Privacy Policy?',
          test:
            ' FbAli provides lightweight ERP including product management, orders management and shipping management, and auto-processing for orders to merchants who use Shopify to power their stores. This Privacy Policy describes how personal information is collected, used, and shared when you install or use the App in connection with your Shopify-supported store.'
        },
        {
          title: 'FbAli Privacy Policy?',
          test:
            ' FbAli provides lightweight ERP including product management, orders management and shipping management, and auto-processing for orders to merchants who use Shopify to power their stores. This Privacy Policy describes how personal information is collected, used, and shared when you install or use the App in connection with your Shopify-supported store.'
        }
      ]
    }
  },
  computed: {},
  created() {},
  methods: {
    containClick() {
      this.$router.push({ name: 'content' })
    }
  }
}
</script>
<style scoped>
.privacy-banner {
  background: #f28c60;
  height: 210px;
  /* margin-top: -80px; */
}
.title {
  font-weight: 400;
  margin-bottom: 1rem;
  color: #f28c60;
}
.is-1 {
  font-size: 3rem;
  color: #fff;
  line-height: 210px;
  text-align: center;
}
.wap-top {
  margin-top: 80px;
}
.contain {
  margin-top: 50px;
  margin-bottom: 50px;
  cursor: pointer;
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
</style>
