<template>
  <div>
    <navbar />
    <main>
      <section class="wap wap-top">
        <div class="privacy-banner">
          <div class="container">
            <div class="wap-input">
              <el-input
                v-model="search"
                placeholder="Search for articles..."
                icon="el-icon-search"
                clearable
              >
                <template slot="prepend">
                  <i class="el-icon-search" />
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </section>
      <section
        v-for="(item, key) in containList"
        :key="key"
        class="wap contain"
        @click="containClick(item)"
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
import { setStorage } from '@/utils/storage'
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
            ' FbAli provides lightweight ERP including product management, orders management and shipping management, and auto-processing for orders to merchants who use Shopify to power their stores. This Privacy Policy describes how personal information is collected, used, and shared when you install or use the App in connection with your Shopify-supported store.',
          contain: `<ul>
<li>For <strong>product-related questions</strong>, we have articles in our Help Center to address frequently asked questions</li>
<li>For<strong> order-related concerns</strong>, kindly fill out Spocket's Order Inquiry Form via our messenger.</li>
<li>For any <strong>technical-related issues</strong>, please email our Customer Support team at <a href="mailto:support@spocket.co" target="_blank" rel="nofollow noopener noreferrer">support@spocket.co</a> or connect with us via live chat</li>
<li>For <strong>strategic questions</strong> related to promoting your store, how to generate more sales, and other tips and tricks, please enroll in the <a href="https://academy.spocket.co/" target="_blank" rel="nofollow noopener noreferrer">Spocket Academy</a></li>
</ul>`
        },
        {
          title: 'FbAli Privacy Policy?',
          test:
            ' FbAli provides lightweight ERP including product management, orders management and shipping management, and auto-processing for orders to merchants who use Shopify to power their stores. This Privacy Policy describes how personal information is collected, used, and shared when you install or use the App in connection with your Shopify-supported store.',
          contain: `<ul>
          <li>Fulfill your orders with one click. Spocket can easily sync with your online store and all orders automatically appear in your app. Spocket is integrated with Shopify,  BigCommerce, Wix, and WooCommerce.</li></ul>`
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
      ],
      search: ''
    }
  },
  computed: {},
  created() {},
  methods: {
    containClick(row) {
      setStorage('faq', row)
      this.$router.push({ path: '/content' })
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
.wap-input {
  padding-top: 78px;
}
>>> .wap-input .el-input__inner {
  height: 50px !important;
}
</style>
