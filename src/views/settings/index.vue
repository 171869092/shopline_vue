<template>
  <div class="my-settings">
    <el-card class="box-card">
      <el-tabs v-model="activeName" type="border-card">
        <!-- <el-tab-pane>
          <span slot="label"><i class="el-icon-s-tools" /> General</span>
        </el-tab-pane> -->
        <el-tab-pane name="Template">
          <span slot="label"><i class="el-icon-reading" /> Template</span>
          <templates />
        </el-tab-pane>
        <el-tab-pane name="Notification">
          <span slot="label"><i class="el-icon-message-solid" /> Notification</span>
          <notifications />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import templates from './components/templates'
import notifications from './components/notifications'
export default {
  name: 'settings',
  components: {
    templates,
    notifications
  },
  props: {},
  data() {
    return {
      activeName: 'Template'
    }
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
