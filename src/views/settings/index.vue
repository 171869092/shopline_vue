<template>
  <div class="my-settings">
    <el-card class="box-card">
      <el-tabs type="border-card">
        <!-- <el-tab-pane>
          <span slot="label"><i class="el-icon-s-tools" /> General</span>
        </el-tab-pane> -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-message-solid" /> Notifications</span>
          <notifications />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import Notifications from './components/notifications'
export default {
  name: 'settings',
  components: {
    Notifications
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
.my-settings {
  padding: 30px;
}
</style>
