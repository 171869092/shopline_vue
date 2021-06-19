<template>
  <div class="my-shop">
    <div class="shop-btn-group">
      <el-dropdown type="primary"  size="small" @command="handleCommand">
        <el-button type="primary" size="small">
          <i class="el-icon-plus"></i>
          Connect A Store
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">Shopify</el-dropdown-item>
          <el-dropdown-item command="2">Woo Commerce</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
<!--      <el-button type="primary" size="small" icon="el-icon-plus" @click="connectShop">Connect A Store</el-button>-->
    </div>
    <el-card class="box-card">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        border
        stripe
        :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}"
        @cell-click="tabClick"
      >
        <el-table-column label="Store name">
          <template slot-scope="scope">
            <span v-if="(scope.row.index === tabClickIndex && tabClickLabel === 'Store name') || !scope.row.store_name">
              <el-input v-model="scope.row.store_name" class="w-230" @blur="inputBlur(scope.row)" />
            </span>
            <span v-else>{{ scope.row.store_name }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="Store ID">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="Store Url">
          <template slot-scope="scope">
            <div>{{ scope.row.store_url }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Platform">
          <template slot-scope="scope">
            <span>{{ scope.row.platform }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Status">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.is_del === '3'" class="item" effect="dark" content="App uninstalled" placement="top">
              <i class="el-icon-warning-outline" style="font-size:18px; color:red" />
            </el-tooltip>
            <span v-else><i class="el-icon-check" style="color: green" /></span>
          </template>
        </el-table-column>
        <el-table-column label="operating">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.platform === 'Shopify'" type="text" @click="handleEdit(scope.row)">edit</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="Create Time">
          <template slot-scope="scope">
            <div>{{ scope.row.create_time }}</div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="edit_shop(scope.row.id)">edit</el-button>
            <el-button type="primary" icon="el-icon-s-tools" size="mini" @click="config(scope.row)" />
          </template>
        </el-table-column> -->
      </el-table>
      <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
    </el-card>
    <el-dialog :title="Connect" width="650px" :visible.sync="dialogvisible" :close-on-click-modal="false" @close="closeDialog">
      <el-form ref="storeForm" :model="storeForm" :rules="rules" @submit.native.prevent="submitConnect">
        <el-form-item prop="store_url" :show-message="false">
          <el-input v-model="storeForm.store_url" autocomplete="off" placeholder="Shopify store URL">
            <template slot="append">.myshopify.com</template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item prop="api_token">
          <el-input v-model="storeForm.api_token" autocomplete="off" placeholder="API Token" />
        </el-form-item>
        <el-form-item prop="api_key">
          <el-input v-model="storeForm.api_key" autocomplete="off" placeholder="API Key" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="storeForm.password" autocomplete="off" placeholder="password" />
        </el-form-item>
        <el-form-item prop="shared_secret">
          <el-input v-model="storeForm.shared_secret" autocomplete="off" placeholder="Shared Secret" />
        </el-form-item>
        <el-form-item prop="api_version">
          <el-input v-model="storeForm.api_version" autocomplete="off" placeholder="API Version" />
        </el-form-item>
        <el-form-item prop="location_id">
          <el-input v-model="storeForm.location_id" autocomplete="off" placeholder="Location Id" />
        </el-form-item>
        <el-form-item prop="pull_date" label="Import Orders:">
          <el-radio-group v-model="storeForm.pull_date" class="mt10 ml20">
            <el-radio v-for="(item,key) in importList" :key="key" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="storeForm.pull_date == 'Orders'" prop="Orders_by_date">
          <el-input v-model="storeForm.Orders_by_date" autocomplete="off" placeholder="Orders by date" />
        </el-form-item> -->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button size="small" type="success" :loading="testLoading" @click="testConnect">Test Connect</el-button> -->
        <el-button size="small" @click="closeDialog">Cancel</el-button>
        <el-button size="small" type="primary" :disabled="storeForm.store_url === ''" :loading="submitLoading" @click="submitConnect">Connect</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="Connect" width="650px" :visible.sync="dialogConnectVisible" :close-on-click-modal="false" :destroy-on-close="true" @close="closeConnectDialog">
      <el-form ref="storeConnectForm" :model="storeConnectForm" :rules="storeConnectRules" label-position="right" label-width="130px">
        <el-form-item label="STORE NAME" prop="store_name">
          <el-input v-model="storeConnectForm.store_name" placeholder="Woo Commerce STORE NAME" />
        </el-form-item>
        <el-form-item label="STORE URL" prop="store_url">
          <el-input v-model="storeConnectForm.store_url" placeholder="Woo Commerce STORE URL" />
        </el-form-item>
        <el-form-item label="API KEY" prop="api_key">
          <el-input v-model="storeConnectForm.api_key" placeholder="Woo Commerce API KEY" />
        </el-form-item>
        <el-form-item label="SECRET KEY" prop="serect_key">
          <el-input v-model="storeConnectForm.serect_key" placeholder="Woo Commerce SECRET KEY" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeConnectDialog">Cancel</el-button>
        <el-button size="small" type="primary" :loading="ConnectSubmitLoading" @click="newSubmitConnect">determine</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="Store Configuration"
      :visible.sync="configDialog"
      width="30%"
    >
      <el-form ref="storeForm" :model="storeForm">
        <el-form-item prop="pull_date" label="Import Orders:">
          <el-radio-group v-model="storeForm.pull_date" class="mt10 ml20">
            <el-radio v-for="(item,key) in importList" :key="key" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="storeForm.pull_date == 'Orders'" prop="Orders_by_date">
          <el-input v-model="storeForm.Orders_by_date" autocomplete="off" placeholder="Orders by date" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="configDialog = false">Cancel</el-button>
        <el-button type="primary" @click="configDialog = false">Done</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { shopList, shopPush, testStoreConnect, connectStore, c_name, editStore, checkShop } from '@/api/shop'
import { shopList, testStoreConnect, c_name, editStore, checkShop, shopStoreSaved } from '@/api/shop'
export default {
  name: 'shop',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  props: {},
  data() {
    return {
      tableData: [],
      formQuery: {
        iDisplayStart: 0,
        iDisplayLength: 10
      },
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      tabClickIndex: '',
      tabClickLabel: '',
      loading: false,
      dialogvisible: false,
      submitLoading: false,
      testLoading: false,
      configDialog: false,
      storeForm: {
        store_url: '',
        api_token: '',
        api_key: '',
        password: '',
        api_version: '',
        location_id: '',
        pull_date: ''
      },
      storeConnectForm: {
        store_url: '',
        store_name: '',
        api_key: '',
        serect_key: ''
      },
      stutas: '',
      importList: [
        { label: '7 days', value: '7' },
        { label: '1month', value: '30' },
        { label: 'Orders by date', value: 'Orders' }
      ],
      Connect: 'Connect to Shopify',
      ConnectCommand: 1,
      ConnectSubmitLoading: false,
      dialogConnectVisible: false,
      ConnectEdit: false,
      ConnectId: '',
      rules: {
        store_url: [
          { required: true, message: 'store_url', trigger: 'blur' }
        ],
        api_key: [
          { required: true, message: 'api_key', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'password', trigger: 'blur' }
        ],
        shared_secret: [
          { required: true, message: 'shared_secret', trigger: 'blur' }
        ],
        api_version: [
          { required: true, message: 'api_version', trigger: 'blur' }
        ],
        location_id: [
          { required: true, message: 'location_id', trigger: 'blur' }
        ],
        pull_date: [
          { required: true, message: 'Please select', trigger: 'change' }
        ],
        Orders_by_date: [
          { required: true, message: 'Orders by date', trigger: 'blur' }
        ]
      },
      storeConnectRules: {
        store_name: [
          { required: true, message: 'store_name is required', trigger: 'blur' }
        ],
        store_url: [
          { required: true, message: 'store_url is required', trigger: 'blur' }
        ],
        api_key: [
          { required: true, message: 'api_key is required', trigger: 'blur' }
        ],
        serect_key: [
          { required: true, message: 'serect_key is required', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    uid() {
      return this.$store.getters.uid
    }
  },
  created() {
    this.Inquire()
  },
  methods: {
    Inquire() {
      this.loading = true
      this.formQuery.iDisplayLength = this.listQuery.limit
      this.formQuery.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      shopList(this.formQuery).then(res => {
        console.log(res.data)
        if (res.code === 200) {
          res.data.data.map(it => {
            if (it.platform === '') {
              it.platform = 'Woo Commerce'
            }
          })
          this.tableData = res.data.data
          this.listQuery.total = +res.data.pagination.totalCount
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // loading.close()
        this.loading = false
      })
    },
    connectShop() {
      // https://fdapi.dongketech.com/site/install?shop=live-by-test.myshopify.com
      this.dialogvisible = true
    },
    // 编辑
    edit_shop(id) {
      this.dialogvisible = true
      editStore({ id: id }).then(res => {
        if (res.code === 200) {
          this.storeForm = {
            api_token: res.data.setting.token,
            store_url: res.data.setting.store_url.split('.')[0],
            api_key: res.data.setting.api_key,
            password: res.data.setting.password,
            api_version: res.data.setting.api_version,
            pull_date: res.data.setting.pull_date,
            location_id: res.data.setting.location_id,
            id: res.data.id
          }

          if (res.data.setting.pull_date === '7' || res.data.setting.pull_date === '30') {
            this.storeForm.pull_date = res.data.setting.pull_date
          } else {
            console.log('000')
            this.storeForm.Orders_by_date = res.data.setting.pull_date
            this.storeForm.pull_date = 'Orders'
          }
        }
      })
    },
    config() {
      this.configDialog = true
    },
    // 测试链接店铺
    testConnect() {
      this.$refs.storeForm.validate((valid) => {
        if (valid) {
          this.testLoading = true
          const url = `${this.storeForm.store_url}.myshopify.com`
          this.storeForm.type = 1
          this.storeForm.uid = this.uid
          this.storeForm.shop = url
          testStoreConnect(this.storeForm).then(res => {
            if (res.code === 200) {
              this.testLoading = false
              this.$message({ message: res.message, type: 'success' })
            }
            console.log(res.data)
          }).catch(err => {
            console.log(err)
            this.testLoading = false
          })
        }
      })
    },
    // 编辑Woo Commerce
    handleEdit(row) {
      this.handleCommand('2')
      this.storeConnectForm.store_name = row.store_name
      this.storeConnectForm.store_url = row.store_url
      this.storeConnectForm.api_key = row.api_key
      this.storeConnectForm.serect_key = row.serect_key
      this.ConnectEdit = true
      this.ConnectId = row.id
    },
    // 新增Woo Commerce
    newSubmitConnect() {
      console.log('this.storeConnectForm', this.storeConnectForm)
      this.$refs['storeConnectForm'].validate((valid) => {
        if (valid) {
          this.ConnectSubmitLoading = true
          const formData = {}
          if (this.storeConnectForm.store_url.slice(0, 4) === 'http') {
            formData.store_url = this.storeConnectForm.store_url
          } else {
            formData.store_url = 'http://' + this.storeConnectForm.store_url
          }
          formData.store_name = this.storeConnectForm.store_name
          formData.api_key = this.storeConnectForm.api_key
          formData.serect_key = this.storeConnectForm.serect_key
          formData.type = this.ConnectCommand
          if (this.ConnectEdit === true) {
            formData.id = Number(this.ConnectId)
          }
          shopStoreSaved(formData).then(res => {
            if (res.code === 200) {
              this.closeConnectDialog()
              this.$message.success(res.message)
              this.ConnectSubmitLoading = false
              this.Inquire()
            } else {
              this.closeConnectDialog()
              this.$message.error(res.message)
              this.ConnectSubmitLoading = false
              this.Inquire()
            }
          }).catch(e => {
            console.log(e)
            this.ConnectSubmitLoading = false
          })
        } else {
          this.$message.warning('Please fill in the required fields!')
        }
      })
    },
    // 关闭Woo Commerce
    closeConnectDialog() {
      this.storeConnectForm = {
        store_url: '',
        store_name: '',
        api_key: '',
        serect_key: ''
      }
      this.dialogConnectVisible = false
    },
    submitConnect() {
      this.submitLoading = true
      const url = `${this.storeForm.store_url}.myshopify.com`
      checkShop({ shop: url }).then(res => {
        console.log(res.data)
        if (res.message === '-1') {
          this.dialogvisible = false
          window.location.href = `${process.env.VUE_APP_BASE_API}/l?shop=${url}&uid=${this.uid}&type=2`
        } else {
          this.$message.error(res.message)
        }
        this.submitLoading = false
      }).catch(err => {
        console.log(err)
        this.submitLoading = false
      })

      // this.$refs.storeForm.validate((valid) => {
      //   if (valid) {
      //     this.submitLoading = true
      //     const params = JSON.parse(JSON.stringify(this.storeForm))
      //     const url = `${this.storeForm.store_url}.myshopify.com`
      //     if (this.storeForm.pull_date === 'Orders') {
      //       params.pull_date = this.storeForm.Orders_by_date
      //     }
      //     params.type = 1
      //     params.uid = this.uid
      //     params.shop = url
      //     delete params.Orders_by_date
      //     connectStore(params).then(res => {
      //       if (res.code === 200) {
      //         shopPush({ shop: url }).then(v => {})
      //         this.dialogvisible = false
      //         this.submitLoading = false
      //         this.Inquire()
      //         this.$message({ message: res.message, type: 'success' })
      //       }
      //       console.log(res.data)
      //     }).catch(err => {
      //       console.log(err)
      //       this.submitLoading = false
      //     })
      //   }
      // })
    },
    closeDialog() {
      //  this.storeForm = this.$options.data().storeForm[0]
      this.$refs.storeForm.resetFields()
      delete this.storeForm.id
      this.dialogvisible = false
    },
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
      // console.log(row)
      if (row.is_del === '3') {
        return 'warning-row'
      } else {
        return ''
      }
    },
    inputBlur(row) {
      // console.log('row', row)
      this.tabClickIndex = null
      this.tabClickLabel = ''
      c_name({ id: row.id, store_name: row.store_name }).then(res => {
        if (res.code === 200) {
          this.$message({ message: res.message, type: 'success' })
        }
      })
    },
    // tabClick row 当前行 column 当前列
    tabClick(row, column, cell, event) {
      if (row.is_del !== '3') {
        this.tabClickIndex = row.index
        this.tabClickLabel = column.label
      }
    },
    // 选择添加的是Woo Commerce还是Shopify
    handleCommand(command) {
      if (command === '1') {
        this.dialogvisible = true
        this.Connect = 'Connect to Shopify'
        this.ConnectCommand = 1
      } else {
        this.ConnectEdit = false
        this.dialogConnectVisible = true
        this.Connect = 'Connect to Woo Commerce'
        this.ConnectCommand = 2
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.my-shop {
  padding: 30px;
}
.shop-btn-group {
  margin-bottom: 20px;
}
</style>
<style>
.el-table .warning-row {
  background: #f5f7fa;
  cursor: no-drop;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #f5f7fa;
}
</style>
