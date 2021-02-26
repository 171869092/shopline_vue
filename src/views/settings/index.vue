<template>
  <div class="my-settings">
    <el-card class="box-card">
      <el-tabs type="border-card">
        <!-- <el-tab-pane>
          <span slot="label"><i class="el-icon-s-tools" /> General</span>
        </el-tab-pane> -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-message-solid" /> Notifications</span>
          <el-row class="p20" :gutter="20">
            <el-col :span="4">
              <div class="notif-tip">
                <h5>Customers notifications</h5>
                <p>These notifications are automatically sent out to the customer. Click on the notification template to edit the content. </p>
                <el-button @click="dialogVisible = true">Customize</el-button>
              </div>
            </el-col>
            <el-col :span="20">
              <el-table
                :data="tableData"
                style="width: 100%"
              >
                <el-table-column
                  prop="title"
                  label="Title"
                  width="300"
                />
                <el-table-column
                  prop="desc"
                  align="left"
                />
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog title="New Template" :visible.sync="dialogVisible">
      <el-form :model="form" label-position="top">
        <el-form-item label="Email subject">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Email body">
          <tinymce ref="tinymces" v-model="form.describe" :height="300" />
          <!-- <editor v-model="form.describe" :init="init" /> -->
        </el-form-item>
      </el-form>
      <el-button @click="insertContent">插入内容</el-button>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Close</el-button>
        <el-button type="primary" @click="dialogVisible = false">Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'settings',
  components: {
    Tinymce: () => import('@/components/Tinymce')
  },
  props: {},
  data() {
    return {
      tableData: [
        { title: 'Order confirmation', desc: 'Sent automatically to the customer after they place their order.' },
        { title: 'Order invoice', desc: 'Sent to the customer when the order has an outstanding balance.' }
      ],
      dialogVisible: false,
      form: {}
    }
  },
  computed: {},
  created() {},
  methods: {
    insertContent() {
      console.log(this.$refs.tinymces)
      this.$refs.tinymces.execCommand('${username}')
    }
  }
}
</script>
<style scoped>
.my-settings {
  padding: 30px;
}
</style>
