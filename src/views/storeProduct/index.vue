<template>
  <div class="product">
    <div class="mt20 mr30">
      <div class="flexbox justify-flex-end">
        <!-- <el-button type="primary" icon="el-icon-plus" size="small" class="f-r mr50 mt20" @click="productAdd('add')">Add products</el-button> -->
        <el-button size="small" class="button-border" @click="providerClick">Hosting</el-button>
        <el-button size="small" type="danger" @click="CancleHostClick">Unhosting</el-button>
        <el-button size="small" type="primary" icon="el-icon-top" :loading="shopifyLoading" @click="pushShopify">Push to shopify</el-button>
      </div>
    </div>
    <el-card v-loading="tabloading" class="dataloading box-card min_height">
      <el-tabs v-if="tabList.length > 0" v-model="formInline.store_url" @tab-click="handleClick">
        <el-tab-pane v-for="(tab, key) in tabList" :key="key" :label="tab.store_name" :name="tab.store_url">
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
            <div>
              <el-select v-model="formInline.service_id" placeholder="Service id" clearable class="ml20" @change="filterOrders">
                <el-option
                  v-for="(item,idx) in serviceList"
                  :key="item.id"
                  :label="item.service_name"
                  :value="String(idx + 1)"
                />
              </el-select>
            </div>
            <el-button class="ml20" size="small" type="primary" @click="syncData">Sync Data</el-button>
          </div>
          <el-row v-if="typeClose && formInline.store_url === store_url" class="row-bg mb10">
            <el-col :span="2"><span>Data syncing:</span></el-col>
            <el-col :span="22"><el-progress :percentage="percentage" :color="customColor" /></el-col>
          </el-row>
          <div />
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            highlight-current-row
            fit
            :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
            :row-class-name="tableRowClassName"
            @selection-change="productChange"
            @cell-click="tabClick"
          >
            <el-table-column type="selection" />
            <el-table-column v-for="(item,idx) in labelList" :key="idx" :index="idx" :label="item.label" :prop="item.value" :width="item.width">
              <template slot-scope="scope">
                <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
                <span v-if="item.type == 'price'">{{ scope.row.price }}</span>
                <span v-if="item.type == 'cost'">
                  <!-- <span v-if="(scope.$index === tabClickIndex && tabClickLabel === 'Cost') || !scope.row.cost">
                    <el-input
                      v-model="scope.row.cost"
                      type="number"
                      min="0.00"
                      clearable
                      size="mini"
                      placeholder="0.00"
                      @change="(val) => (getTheCost(scope.row.id, val))"
                      @keydown.enter="(val) => (getTheCost(scope.row.id, val))"
                    >
                      <div slot="prefix" style="padding:3px 8px">{{ scope.row.money_signl || '$' }}</div>
                    </el-input>
                  </span> -->
                  <span>{{ scope.row.cost ? scope.row.money_signl : '' }}{{ scope.row.cost }}</span>
                </span>
                <span v-if="item.type == 'image'" @click="productAdd('edit', scope.row.id)">
                  <el-image class="sku_image" style="width: 50px; height: 50px" :src="scope.row.img_url" fit="cover">
                    <div slot="error" class="image-slot">
                      <i
                        class="el-icon-picture-outline"
                        style="font-size: 30px;"
                      />
                    </div>
                  </el-image>
                </span>
                <div v-if="item.type == 'product'" style="color:#ef6f38" class="pointer" @click="productAdd('edit', scope.row.id)">
                  <span>{{ scope.row.title }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
        </el-tab-pane>
      </el-tabs>
      <div v-else class="nodata">
        <img src="data:image/png;base64,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">
        <span class="mt20">There is no associated store. Please click <router-link class="primary" :to="{name: 'store'}">here</router-link> to connect to your store</span>
      </div>
    </el-card>
    <provider :visible="providerVisible" @providerAdd="closeprovider" :store_url="formInline.store_url"/>
  </div>
</template>
<script>
import { debounce } from '@/utils'
import {
  getStoreProductList,
  getCancelHosting,
  getStoreList,
  getStorePushProduct,
  productCost,
  getServiceList,
  ManualSync
} from '@/api/product'
export default {
  name: 'product',
  components: {
    Pagination: () => import('@/components/Pagination'),
    provider: () => import('./component/provider')
  },
  data() {
    return {
      // 列表表头
      percentage: 0,
      customColor: 'rgb(239, 111, 56)',
      labelList: [
        { label: '', value: '', type: 'image', width: '150' },
        { label: 'Product', value: 'id', type: 'product', width: '500' },
        { label: 'Status', value: 'status' },
        { label: 'Inventory', value: 'stock' },
        { label: 'Price', value: 'price', type: 'price' },
        { label: 'Cost', value: 'cost', type: 'cost' },
        { label: 'Hosting', value: 'service_name' }
        // { label: 'Operating', type: 'Operating' }
      ],
      statusOptions: ['Active', 'Draft'],
      tableData: [],
      productSelection: [],
      loading: false,
      providerVisible: false,
      tabloading: false,
      shopifyLoading: false,
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
      },
      costValue: '',
      tabClickIndex: '',
      tabClickLabel: '',
      websock: null,
      typeClose: false,
      store_url: '',
      serviceList: [],
      platform: ''
    }
  },
  created() {
    this.storeList()
    this.handleGetServiceList()
  },
  methods: {
    // 获取店铺list
    storeList() {
      this.tabloading = true
      getStoreList().then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.tabList = res.data
            this.formInline.store_url = res.data[0].store_url
            this.platform = res.data[0].platform
            this.Inquire()
            this.initWebSocket()
          }
          this.tabloading = false
        }
      })
    },
    // 查询
    Inquire() {
      this.loading = true
      const formData = JSON.parse(JSON.stringify(this.formInline))
      formData.iDisplayLength = this.listQuery.limit
      formData.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      formData.platform = this.platform
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
    productAdd(type, id) {
      this.$router.push({ name: 'productDetails', query: { type: type, id: id, stroeType: 'store' }})
    },
    handleClick(tab) {
      this.tabList.map(item => {
        if (tab.name === item.store_url) {
          this.platform = item.platform
        }
      })
      this.listQuery.page = 1
      this.listQuery.limit = 10
      this.formInline.title = ''
      this.formInline.status = ''
      this.Inquire()
      this.initWebSocket()
    },
    filterOrders: debounce(function() {
      this.listQuery.page = 1
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
    pushShopify() {
      if (this.productSelection.length === 0) {
        this.$message({ message: 'Please check the product before', type: 'warning' })
        return
      } else {
        this.shopifyLoading = true
        const pushProduct = {}
        this.tabList.find(item => {
          if (item.store_url === this.formInline.store_url) {
            pushProduct.store_id = item.id
          }
        })
        pushProduct.product_list = this.productSelection.map(item => item.id)
        getStorePushProduct(pushProduct).then(res => {
          if (res.code === 200) {
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
          productObj.store_url = this.formInline.store_url
          getCancelHosting(productObj).then(res => {
            if (res.code === 200) {
              this.$message({ message: res.message, type: 'success' })
              this.Inquire()
            }
          })
        }).catch(() => {})
    },
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    // 点击某个单元格
    tabClick(row, column, cell, event) {
      console.log(row)
      // console.log(column)
      this.tabClickIndex = row.index
      this.tabClickLabel = column.label
    },
    // 获取商品成本
    getTheCost(id, cost) {
      console.log(id, cost)
      this.tabClickIndex = null
      productCost({ id: id, cost: cost }).then(res => {
        console.log(res.data)
        if (res.code === 200) {
          this.$message.success(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 初始化weosocket
    initWebSocket() {
      const wsuri = 'wss://socket.fbali.co/wss/'
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() { // 连接建立之后执行send方法发送数据
      const actions = { store_url: this.formInline.store_url }
      this.websocketsend(JSON.stringify(actions))
      console.log('连接建立之后执行')
    },
    websocketonerror() { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage(e) { // 数据接收
      console.log(e)
      const redata = JSON.parse(e.data)
      this.percentage = parseInt(redata.expr) || 0
      this.store_url = redata.store_url
      redata.code === '-1' ? this.typeClose = false : this.typeClose = true
    },
    websocketsend(Data) { // 数据发送
      this.websock.send(Data)
      console.log(Data)
    },
    websocketclose(e) { // 关闭
      console.log('断开连接', e)
    },
    handleGetServiceList() {
      getServiceList().then(res => {
        if (res.code === 200) {
          this.serviceList = res.data
        }
      })
    },
    syncData() {
      ManualSync({ shop: this.store_url }).then(res => {
        if (res.code === 200) {
          this.$message.success('Sync start')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.product {
  .box-card {
    margin: 20px 30px !important;
  }
  .button-border {
    border: 1px solid #ef6f38;
    color: #ef6f38;
  }
  .min_height {
    min-height: 300px;
  }
}
</style>
