
<template>
  <div>
    <navbar />
    <main>
      <!-- <section class="wap wap-top">
        <div class="privacy-banner">
          <div class="container">
            <h1 class="title is-1">Privacy Policy</h1>
          </div>
        </div>
      </section> -->
      <section class="wap wap-top contact">
        <div class="container">
          <el-card type="card">
            <span>111</span>
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
  name: 'contact',
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
.contact {
  height: 720px;

}
.title {
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.is-1 {
  font-size: 3rem;
  color: #fff;
  line-height: 410px;
  text-align: center;
}
.wap-top {
  margin-top: 160px;
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
