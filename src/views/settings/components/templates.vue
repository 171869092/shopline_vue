<template>
  <div>
    <el-row class="p20" :gutter="20">
      <el-col :span="4">
        <div class="notif-tip">
          <h5>Customers template</h5>
          <p>These template are automatically sent out to the customer. Click on the notification template to edit the content. </p>
          <el-button @click="addTemplate">Customize</el-button>
        </div>
      </el-col>
      <el-col :span="20">
        <el-table v-loading="loading" :data="tableData" style="width: 100%">
          <el-table-column prop="template_name" label="Title" width="300">
            <template slot-scope="scope">
              <span class="link" @click="editTemplate(scope.row)">{{ scope.row.template_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="description" prop="description" align="left" show-overflow-tooltip />
          <el-table-column label="Bind Store" prop="store_url" align="left" />
          <el-table-column label="Status" prop="store_url" align="left" width="120">
            <template slot-scope="scope">
              <!-- {{ scope.row.is_use ? 'Enabled' : 'Disabled' }} -->
              <el-tooltip :content="scope.row.is_use == '1' ? 'Enabled' : 'Disabled'" placement="top">
                <el-switch
                  v-model="scope.row.is_use"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="1"
                  inactive-value="2"
                  @change="(value) => statusChange(value, scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="New Template" top="10vh" :visible.sync="dialogVisible" @open="handleDialogOpen">
      <el-form ref="templateForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="Name:" prop="template_name">
          <el-input v-model="form.template_name" autocomplete="off" placeholder="Template Name" />
        </el-form-item>
        <el-form-item label="Description:" prop="description">
          <el-input v-model="form.description" autocomplete="off" placeholder="Template Description" />
        </el-form-item>
        <el-form-item label="Bind Store:" prop="store_url">
          <el-select v-model="form.store_url" multiple placeholder="Select Store" style="width:100%">
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.store_name"
              :value="item.store_url"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Content:" prop="template_content">
          <tinymce ref="tinymces" v-model="form.template_content" menubar :height="300" />
        </el-form-item>
        <el-form-item>
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="primary" size="small">
              Insert Variable<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">Order Number</el-dropdown-item>
              <el-dropdown-item command="b">Tracking Number</el-dropdown-item>
              <el-dropdown-item command="c">Order Info</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="link ml10" @click="dialogTableVisible = true">Variable specification</span>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Close</el-button>
        <el-button type="primary" @click="saveTemplate('templateForm')">Save</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Variable specification" :visible.sync="dialogTableVisible">
      <div class="mb20">The SMS template can contain variables, and the variables represent the content that the user wants to customize and change when the SMS is actually sent. A text description should be added before and after the variable to reflect the commercial intention of the template user.</div>
      <el-table border :data="gridData" :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}">
        <el-table-column property="type" label="Category" width="150" />
        <el-table-column property="description" label="Description" />
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { templateList, templateAdd, templateEdit, templateEditUse } from '@/api/notifications'
import { getStoreList } from '@/api/product'
export default {
  name: 'templates',
  components: {
    Tinymce: () => import('@/components/Tinymce')
  },
  filters: {
    showStoreName(store) {
      // if (store) {
      //   const url = store.split(',')
      // }
    }
  },
  props: {},
  data() {
    return {
      formQuery: {
        type: 1
      },
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      tableData: [],
      dialogVisible: false,
      dialogTableVisible: false,
      form: {
        type: '1',
        template_name: '',
        description: '',
        template_content: ''
      },
      loading: false,
      rules: {
        template_name: [{ required: true, message: 'Can not be empty!', trigger: 'blur' }],
        store_url: [{ required: true, message: 'Please choose the store!', trigger: 'blur' }],
        template_content: [{ required: true, message: 'Can not be empty!', trigger: 'blur' }]
      },
      gridData: [
        { type: 'Variable format', description: '${name}, ${content}, etc. The middle letter should represent the variable attribute.' },
        { type: 'Variable name', description: '1~20 characters, the first letter must be an English letter, only supports letters, numbers and underscores, cannot be pure numbers, and cannot be email, mobile, id, nick, site, etc.' },
        { type: 'Other specifications', description: 'The notification template can add links, but it does not support setting variable links, such as www.${site}.cn, nor does it support the direct combination of short links and variables. For example: t.cn${code}, t.cn is a short link, and ${code} is a variable. For example, the format of www.****.com/${order_id} is allowed, but you are reminded that for the specific URL, the reviewer will review it, and it can be used only after the review is passed.' }
      ],
      storeList: [],
      editFlag: false
    }
  },
  computed: {},
  created() {
    this.init()
    this.initData()
  },
  methods: {
    init() {
      getStoreList().then(res => {
        if (res.code === 200) {
          this.storeList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    initData() {
      this.loading = true
      const queryData = JSON.parse(JSON.stringify(this.formQuery))
      queryData.type = 1
      queryData.iDisplayLength = this.listQuery.limit
      queryData.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      templateList(queryData).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },
    addTemplate() {
      this.editFlag = false
      this.dialogVisible = true
    },
    editTemplate(row) {
      this.form = { ...row }
      if (row.store_url) {
        this.form.store_url = row.store_url.split(',')
      }
      this.editFlag = true
      this.dialogVisible = true
      console.log(row)
    },
    saveTemplate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = { ...this.form }
          formData.store_url = this.form.store_url.toString()
          if (this.editFlag) {
            templateEdit(formData).then(res => {
              if (res.code === 200) {
                this.$message.success('Save Success!')
                this.dialogVisible = false
                this.$data.form = this.$options.data().form
                this.initData()
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            templateAdd(formData).then(res => {
              console.log(res.data)
              if (res.code === 200) {
                this.$message.success('Save Success!')
                this.dialogVisible = false
                this.$data.form = this.$options.data().form
                this.initData()
              }
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleDialogOpen() {
      if (this.editFlag) {
        this.$nextTick(() => {
          // console.log(this.form.template_content)
          // console.log(this.$refs.tinymces)
          setTimeout(() => {
            this.$refs.tinymces.setContent(this.form.template_content)
          }, 100)
        })
      } else {
        this.$data.form = this.$options.data().form
      }
    },
    handleCommand(command) {
      switch (command) {
        case 'a':
          this.$refs.tinymces.execCommand('${order_number}')
          break
        case 'b':
          this.$refs.tinymces.execCommand('${tracking_number}')
          break
        case 'c':
          this.$refs.tinymces.execCommand('${order_info}')
          break
        default:
          break
      }
    },
    statusChange(is_use, row) {
      console.log(is_use)
      templateEditUse({ id: row.id, is_use: is_use }).then(res => {
        console.log(res.data)
        if (res.code === 200) {
          this.$message.success('Change Status Success!')
        } else {
          this.$message.error('Change error, please try again later!')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped>
</style>
