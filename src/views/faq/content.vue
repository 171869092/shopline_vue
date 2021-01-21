<template>
  <div>
    <navbar />
    <main>
      <section class="wap wap-top">
        <div class="privacy-banner">
          <div class="container">
            <div class="wap-input">
              <el-input placeholder="Search for articles..." icon="el-icon-search" c>
                <template slot="prepend">
                  <i class="el-icon-search" />
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </section>
      <section class="wap contain">
        <div class="container">
          <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ name: 'faq' }">All Collections</el-breadcrumb-item>
              <el-breadcrumb-item>FbAli Privacy Policy</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <el-card type="card" class="card-box">
            <div style="padding:3rem">
              <h3 class="title">FbAli Privacy Policy</h3>
              <div class="block">
                <p class="block-title">
                  FbAli provides lightweight ERP including product management, orders management and shipping management, and auto-processing for orders to merchants who use Shopify to power their stores. This Privacy Policy describes how personal information is collected, used, and shared when you install or use the App in connection with your Shopify-supported store.
                </p>
              </div>
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

    }
  },
  computed: {},
  created() {},
  methods: {}
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
  color: #111;
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
  margin-top: 30px;
  margin-bottom: 50px;
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
.card-box{
  margin-top: 20px;
  min-height: 400px;
}
.wap-input{
padding-top: 78px;
}
>>>.wap-input .el-input__inner{
  height: 50px!important;
}
</style>
