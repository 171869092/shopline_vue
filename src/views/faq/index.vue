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
          title: 'What is the source agent?',
          test:
            'Let’s see what the process of a package borned from factory then to be deliveried to its owner.',
          contain: `<ol>
                <li>The products were produced by a factory with many processing steps.</li>
                <li>The products will be purchased by wholesalers or retailers then stored in warehouses.</li>
                <li>The worker will carry the product and then pack it into a package and paste the shipping label on the packages.</li>
                <li>The packages will be passed to shipping companies, with sorting and transportation over and over again</li>
                <li>The packages will appear in its owner’s hand.</li>
                </ol>
                <p>Source agents help you doing all these things behind marketing and orders.</p>`
        },
        {
          title: 'How to work with a source agent?',
          test:
            'FbAli will filter a good source agent for you to choose from. And it’s easy to work with one that you had negotiated.',
          contain: `<ol>
                <li>Make sure you had contacted the source agent that you want to work with, because they will be a part of your supply chain, make sure you know about them and want to work with them on your supply chain, and you can use the social platform supported by that source agent, usually is WhatsApp or telegram.</li>
                <li>Go to the store products page, and choose the product that you want to host to that good source agent.</li>
                <li>And there are 2 models you can use, manually process and automatically process, which means the order contains the products which you want that source agent to process will be sent out to the source agent manually or automatically.</li>
                </ol>
                <p>P.S The minimum unit for hosting is on the product, and not on SKU(stock keeping unit).</p>`
        },
        {
          title: 'How to track the orders?',
          test:
            'FbAli constructed 5 states to order, pending, processing, in transit, delivered, and exception. And you can check more details for timeline in order details.',
          contain: `<ol>
                    <li>Pending: It means there’s no source agent or any other vendor will process your orders, and the orders in pending will not be fulfilled.</li>
                    <li>Processing: The order is being fulfilled, and the source agents or other vendors are working on this order, such as purchasing, sorting, or packing.</li>
                    <li>In Transit: The package is on the deliveries ways to its owner, which will be transported over and over again, and you can check the details in the order details.</li>
                    <li>Delivered: The package is delivered to its owner.</li>
                    <li>Exception: Any unexpected situation caused the packages could not be delivered will in exception status.</li>
                    </ol>`
        },
        {
          title: 'What is the difference between work with source agents and with retail sellers such as Aliexpress?',
          test:
            'Working with Source agent, you: ',
          contain: `<p>Don’t need to connect different factories one by one</p>
                  <p>Better price produced directly by the factory, no service charge of the platform</p>
                  <p>Have faster-shipping line, no longer tired for long time shipping</p>
                  <p>Process orders and update tracking numbers automatically</p>
                  <p>Create and grow your own long term brand</p>
                  <p>Have more time to focus on advertising and selling</p>
                  <p></p>
                  <p>Working with Aliexpress, you:</p>
                  <p>Have safety secure platform</p>
                  <p>Cheaper shipping price for small items</p>`
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
