<template>
  <div class="message-box">
    <div class="m30">
      <el-tabs v-model="active" type="border-card">
        <el-tab-pane name="system">
          <span slot="label">System notification</span>
          <system/>
        </el-tab-pane>
        <el-tab-pane name="customer">
          <span slot="label">Customer information</span>
          <customer/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import system from './components/system'
import customer from './components/customer'
export default {
  name: 'index',
  components: {
    system,
    customer
  },
  data() {
    return {
      active: 'system'
    }
  },
  created() {
    if (this.$route.query.paneName) {
      this.active = this.$route.query.paneName
    } else {
      this.active = 'system'
    }
  }
}
</script>

<style scoped>

</style>
