<template>
  <div class="product">
    <div class="mb20">
      <div class="flexbox justify-flex-end">
        <el-button icon="el-icon-connection" size="small" class="button-border" @click="assignStore('add')">Assign store</el-button>
        <el-button type="primary" icon="el-icon-plus" size="small" class="" @click="productAdd('add')">Add products</el-button>
      </div>
    </div>
    <el-card class="box-card">
      <div class="flexbox mb20">
        <div>
          <el-input
            v-model="formInline.title"
            prefix-icon="el-icon-search"
            placeholder="Filter products"
            clearable
            class="w-570"
            @input="filterOrders"
          />
        </div>
        <div>
          <el-select v-model="formInline.status" placeholder="Status" clearable class="ml20" @change="filterOrders">
            <el-option
              v-for="(item,idx) in statusOptions"
              :key="item"
              :label="item"
              :value="String(idx + 1)"
            />
          </el-select>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        fit
        :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
        @selection-change="productChange"
      >
        <el-table-column type="selection" />
        <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
          <template slot-scope="scope">
            <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
            <div v-if="item.type == 'product'" style="color:#ef6f38;display: flex;" class="pointer f-l ml50" @click="productAdd('edit',scope.row.title,scope.row.id)">
              <img :src="scope.row.img_url" width="50px" alt="">
              <div class="ml20">{{ scope.row.title }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
    </el-card>
    <el-dialog title="Assign Store" :visible.sync="dialogvisible" width="500px">
      <el-form ref="dialogForm" :model="dialogForm" label-width="60px">
        <el-form-item
          label="Store"
          prop="store_id"
          :rules="{required: true, message: 'Please select a store', trigger: 'blur'}"
        >
          <el-select v-model="dialogForm.store_id" placeholder="Select Store" style="width:100%">
            <el-option
              v-for="(item, key) in storeList"
              :key="key"
              :label="item.store_url"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogvisible = false">Cancel</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit('dialogForm')">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { debounce } from '@/utils'
import { getStoreList, getAllProductList, allGoodsSelectStore } from '@/api/product'
export default {
  name: 'product',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  data() {
    return {
      // 列表表头
      labelList: [
        { label: 'Product', value: 'id', type: 'product', width: '700' },
        { label: 'Status', value: 'status' },
        { label: 'Inventory', value: 'stock' }
        // { label: 'Type', value: 'type' },
        // { label: 'Hosting', value: 'service_name' },
        // { label: 'Operating', type: 'Operating' }
      ],
      statusOptions: ['Active', 'Draft'],
      tableData: [],
      productSelection: [],
      loading: false,
      dialogvisible: false,
      submitLoading: false,
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      formInline: {
        title: '',
        status: ''
      },
      dialogForm: {
        store_id: '',
        product_list: []
      },
      storeList: []
    }
  },
  created() {
    this.initData()
    this.Inquire()
  },
  methods: {
    // 获取店铺list
    initData() {
      getStoreList().then(res => {
        if (res.code === 200) {
          this.storeList = res.data
        }
      })
    },
    // 查询
    Inquire() {
      this.loading = true
      const formData = JSON.parse(JSON.stringify(this.formInline))
      formData.iDisplayLength = this.listQuery.limit
      formData.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      getAllProductList(formData).then(res => {
        if (res.code === 200) {
          res.data.map(item => {
            item.status = item.status === '1' ? 'Active' : 'Draft'
          })
          this.tableData = res.data
          this.listQuery.total = +res.iTotalRecords
          this.loading = false
        }
      })
    },
    productChange(val) {
      this.productSelection = val
    },
    productAdd(type, title, id) {
      this.$router.push({ name: 'productDetails', query: { type: type, title: title, id: id, stroeType: 'all' }})
    },
    assignStore() {
      if (this.productSelection.length === 0) {
        this.$message({ message: 'Please check the product before', type: 'warning' })
        return
      }
      this.dialogvisible = true
      this.dialogForm.product_list = this.productSelection.map(i => i.id)
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          allGoodsSelectStore(this.dialogForm).then(res => {
            console.log(res.data)
            if (res.code === 200) {
              this.$message.success(res.message)
              this.$refs[formName].resetFields()
              this.dialogvisible = false
              this.Inquire()
            }
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.submitLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    filterOrders: debounce(function() {
      this.Inquire()
    }, 1000)
  }
}
</script>
<style lang="scss" scoped>
.product{
   margin: 20px 30px!important;
    .button-border{
      border: 1px solid #ef6f38;
      color:  #ef6f38;
    }
}
</style>
