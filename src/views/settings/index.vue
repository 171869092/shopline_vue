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
        <el-tab-pane name="Password">
          <span slot="label"><i class="el-icon-message-solid" />Channge Password</span>
          <password />
        </el-tab-pane>
        <el-tab-pane name="personal">
          <span slot="label"><i class="el-icon-message-solid" />personal Center</span>
          <personal />
        </el-tab-pane>
        <el-tab-pane name="external">
          <span slot="label"><i class="el-icon-document" />External links</span>
          <external />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import templates from './components/templates'
import notifications from './components/notifications'
import password from './components/password'
import personal from './components/personal-center'
import external from './components/external-links'
export default {
  name: 'settings',
  components: {
    templates,
    notifications,
    password,
    personal,
    external
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
<style lang="scss">
.my-settings {
  padding: 30px;
  .el-tabs--border-card {
    .el-tabs__content {
      padding: 0!important;
    }
  }
}
</style>
