<template>
  <div class="my-shop">
    <div class="shop-btn-group">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="ConnectShop">Connect A Store</el-button>
    </div>
    <el-card class="box-card">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        fit
        stripe
        :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}"
      >
        <el-table-column label="Store ID">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Store Url">
          <template slot-scope="scope">
            <div>{{ scope.row.store_url }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Create Time">
          <template slot-scope="scope">
            <div>{{ scope.row.create_time }}</div>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
    </el-card>
    <el-dialog title="Connect to Shopify" width="500px" :visible.sync="dialogvisible" :close-on-click-modal="false" @close="closeDialog">
      <el-form :model="storeForm" :rules="rules" ref="storeForm">
        <el-form-item prop="store_url">
          <el-input v-model="storeForm.store_url" autocomplete="off" placeholder="Shopify store URL">
            <template slot="append">.myshopify.com</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="api_token">
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
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">Cancel</el-button>
        <el-button size="small" type="primary"  @click="submitConnect" :loading="submitLoading">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { shopList } from '@/api/shop'
import { connectStore } from '@/api/user'
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
      loading: false,
      dialogvisible: false,
      submitLoading: false,
      storeForm: {
        store_url: '',
        api_token: '',
        api_key:'',
        password:'',
        shared_secret:'',
        api_version:'',
        location_id:''
      },
      rules: {
         store_url: [
            { required: true, message: 'store_url', trigger: 'blur' },
          ],
        api_token: [
            { required: true, message: 'api_token', trigger: 'blur' },
          ],
        api_key: [
            { required: true, message: 'api_key', trigger: 'blur' },
          ],
        password: [
            { required: true, message: 'password', trigger: 'blur' },
          ],
        shared_secret: [
            { required: true, message: 'shared_secret', trigger: 'blur' },
          ],
        api_version: [
            { required: true, message: 'api_version', trigger: 'blur' },
          ],
        location_id: [
            { required: true, message: 'location_id', trigger: 'blur' },
          ],
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
    ConnectShop() {
      // https://fdapi.dongketech.com/site/install?shop=live-by-test.myshopify.com
      this.dialogvisible = true
      // this.$prompt('Shopify Store URL', 'Connect New Shop', {
      //   confirmButtonText: 'Confirm',
      //   cancelButtonText: 'Cancel',
      //   inputPattern: /.myshopify.com/,
      //   inputErrorMessage: 'The entered store url is incorrect',
      //   inputPlaceholder: 'xxxx.myshopify.com'
      // }).then(({ value }) => {
      //   window.open(`https://fdapi.dongketech.com/l?shop=${value}&uid=${this.uid}`)
      // }).catch(() => {})
    },
    submitConnect() {
       this.$refs.storeForm.validate((valid) => {
          if (valid) {
              this.submitLoading = true
              const url = `${this.storeForm.store_url}.myshopify.com`
              this.storeForm.type = 1
              this.storeForm.uid = this.uid,
              this.storeForm.shop = url,
              connectStore(this.storeForm).then(res => {
                if(res.code == 200){
                  this.dialogvisible = false
                  this.submitLoading = false
                  this.Inquire()
                  this.$message({ message: res.message, type: 'success' })    
                }
                console.log(res.data)
              }).catch(err => {
                console.log(err)
                this.submitLoading = false
              })
          }
       })

      // setTimeout(() => {
      //   window.open(`${process.env.VUE_APP_BASE_API}/l?shop=${url}&uid=${this.uid}&type=1`)
      // }, 300)
    },
    closeDialog() {
      //  this.storeForm = this.$options.data().storeForm[0]
      this.$refs.storeForm.resetFields()
      this.dialogvisible = false
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
