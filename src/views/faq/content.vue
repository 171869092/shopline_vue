<template>
  <div>
    <navbar />
    <main>
      <section class="wap wap-top">
        <div class="privacy-banner">
          <div class="container">
            <div class="wap-input">
              <el-input v-model="search" placeholder="Search for articles..." icon="el-icon-search" clearable>
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
              <h3 class="title">{{ dataList.title }}</h3>
              <div class="block">
                <p class="block-title">{{ dataList.test }}</p>
              </div>
              <p v-html="dataList.contain" />
            </div>

          </el-card>
        </div>
      </section>
    </main>
    <footer-home />
  </div>
</template>
<script>
import { getStorage } from '@/utils/storage'
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
      search: '',
      dataList: {}
    }
  },
  computed: {},
  created() {
    this.dataList = getStorage('faq')
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
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
  color: #909399;
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
// >>>.wap-input .el-input__inner{
//   height: 50px!important;
// }
</style>

<style lang="scss">
.wap-input .el-input__inner {
  height: 50px;
  line-height: 50px;
}
</style>
