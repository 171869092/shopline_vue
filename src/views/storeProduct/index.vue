<template>
  <div class="product">
    <div class="mt20 mr30">
        <div class="flexbox justify-flex-end">
            <!-- <el-button type="primary" icon="el-icon-plus" size="small" class="f-r mr50 mt20" @click="productAdd('add')">Add products</el-button> -->
            <el-button size="small" class="button-border" @click="providerClick">Hosting</el-button> 
            <el-button size="small" type="danger" @click="CancleHostClick">Cancle Hosting</el-button>
            <el-button size="small" type="primary" icon="el-icon-top" :loading="shopifyLoading" @click="pushShopify">Push to shopify</el-button>
        </div>
    </div>
    <el-card v-loading="tabloading" class="box-card min_height">
      <el-tabs v-model="formInline.store_url" @tab-click="handleClick">
        <el-tab-pane v-for="(tab, key) in tabList" :key="key" :label="tab.store_url" :name="tab.store_url">
          <div class="flexbox mb20">
            <div>
              <el-input
                v-model="formInline.title"
                prefix-icon="el-icon-search"
                placeholder="Filter store products"
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
                <span v-if="item.type == 'product'" style="color:#ef6f38" class="pointer f-l ml50" @click="productAdd('edit',scope.row.title,scope.row.id)">
                  <img :src="scope.row.img_url" width="50px" alt="">
                  <span class="ml20">{{ scope.row.title }}</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <provider :visible="providerVisible" @providerAdd="closeprovider" />
  </div>
</template>
<script>
import { debounce } from '@/utils'
import { getStoreProductList, getCancelHosting, getStoreList,getStorePushProduct } from '@/api/product'
export default {
  name: 'product',
  components: {
    Pagination: () => import('@/components/Pagination'),
    provider: () => import('./component/provider')
  },
  data() {
    return {
      // 列表表头
      labelList: [
        { label: 'Product', value: 'id', type: 'product', width: '500' },
        { label: 'Status', value: 'status' },
        { label: 'Inventory', value: 'stock' },
        // { label: 'Type', value: 'type' },
        { label: 'Hosting', value: 'service_name' }
        // { label: 'Operating', type: 'Operating' }
      ],
      statusOptions: ['Active', 'Draft'],
      tableData: [],
      productSelection: [],
      loading: false,
      providerVisible: false,
      tabloading: false,
      shopifyLoading:false,
      providerTitle: 'Hosting',
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      tabList: [],
      formInline: {
        store_url: '',
        title: '',
        status: ''
      }
    }
  },
  created() {
    this.storeList()
  },
  methods: {
    // 获取店铺list
    storeList() {
      this.tabloading = true
      getStoreList().then(res => {
        if (res.code === 200) {
          this.tabList = res.data
          this.formInline.store_url = res.data[0].store_url
          this.tabloading = false
          this.Inquire()
        }
      })
    },
    // 查询
    Inquire() {
      this.loading = true
      const formData = JSON.parse(JSON.stringify(this.formInline))
      formData.iDisplayLength = this.listQuery.limit
      formData.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      getStoreProductList(formData).then(res => {
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
      this.$router.push({ name: 'productDetails', query: { type: type, title: title, id: id, stroeType: 'store' }})
    },
    handleClick() {
      this.listQuery.page = 1
      this.listQuery.limit = 10
      this.formInline.title = ''
      this.formInline.status = ''
      this.Inquire()
    },
    filterOrders: debounce(function() {
      this.Inquire()
    }, 1000),
    // 托管
    providerClick(type) {
      if (this.productSelection.length === 0) {
        this.$message({ message: 'Please check the product before', type: 'warning' })
        return
      }
      this.providerVisible = true
    },
    closeprovider(type) {
      if (type !== 1) {
        this.Inquire()
      }
      this.providerVisible = false
    },
    // push to shopify
    pushShopify(){
      if (this.productSelection.length === 0) {
        this.$message({ message: 'Please check the product before', type: 'warning' })
        return
      }else{
        this.shopifyLoading = true
        const pushProduct = {}
        this.tabList.find(item =>{
          if(item.store_url === this.formInline.store_url){
            pushProduct.store_id = item.id;
          }
        });
        pushProduct.product_list = this.productSelection.map(item => item.id)
        getStorePushProduct(pushProduct).then(res =>{
            if (res.code == 200) {
               this.shopifyLoading = false
               this.$message({ message: res.message, type: 'success' })
            }
        }).catch(() => {
            this.shopifyLoading = false
        })
      }
    },
    // 取消托管
    CancleHostClick() {
      if (this.productSelection.length === 0) {
        this.$message({ message: 'Please check the product before', type: 'warning' })
        return
      }
      this.$confirm(`Are you sure to cancel hosting？`, 'Cancle Hosting', {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          const productObj = {}
          productObj.product_list = this.productSelection.map(item => {
            return {
              id: item.id
            }
          })
          getCancelHosting(productObj).then(res => {
            if (res.code === 200) {
              this.$message({ message: res.message, type: 'success' })
              this.Inquire()
            }
          })
        }).catch(() => {})
    },
  }
}
</script>
<style lang="scss" scoped>
.product{
   .box-card{
      margin: 20px 30px!important;
    }
    .button-border{
      border: 1px solid #ef6f38;
      color:  #ef6f38;
    }
    .min_height{
      min-height: 300px;
    }
}
</style>
