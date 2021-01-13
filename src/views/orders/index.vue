<template>
  <div class="my-orders">
    <el-card class="box-card">
      <el-tabs v-model="formQuery.order_status_client" @tab-click="handleClick">
        <div class="flexbox justify-space-between">
          <div class="filter-control flexbox mb20">
            <div class="filter-item">
              <el-input
                v-model="formQuery.order_name"
                clearable
                class="w-400"
                prefix-icon="el-icon-search"
                placeholder="Filter orders"
                @change="filterOrders"
              />
            </div>
            <div class="filter-item w-250">
              <el-select
                v-model="formQuery.order_status_client"
                clearable
                collapse-tags
                placeholder="Ship status"
                style="width:100%"
                @change="filterOrderStatus"
              >
                <el-option
                  v-for="(item, key) in orderStatus"
                  :key="key"
                  :label="item"
                  :value="key"
                />
              </el-select>
            </div>
            <!-- <div class="filter-item w-250">
            <el-select
              v-model="queryForm.logistics_status"
              multiple
              clearable
              collapse-tags
              placeholder="Logistics status"
              style="width:100%"
              @change="filterLogisticsStatus"
            >
              <el-option
                v-for="(item, key) in logisticsStatus"
                :key="key"
                :label="item"
                :value="key"
              />
            </el-select>
          </div> -->
            <div class="filter-item w-250">
              <el-select
                v-model="formQuery.store_url"
                clearable
                style="width:100%"
                placeholder="Select Store"
                @change="filterStoreUrl"
              >
                <el-option
                  v-for="(item, key) in storeList"
                  :key="key"
                  :label="item.store_url"
                  :value="item.store_url"
                />
              </el-select>
            </div>

          </div>
          <div class="filter-control">
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button class="el-dropdown-link">
                Action<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="placing" icon="el-icon-paperclip">Placing</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <el-tab-pane v-for="(tab, key) in tabList" :key="key" :label="tab.label" :name="tab.name">
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            highlight-current-row
            fit
            stripe
            :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="Order">
              <template slot-scope="scope">
                <span class="primary pointer" @click="toLink(scope.row)">{{ scope.row.order_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Store">
              <template slot-scope="scope">
                <div>{{ scope.row.store_url }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Total">
              <template slot-scope="scope">
                <div>{{ scope.row.total_price }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Cost">
              <template slot-scope="scope">
                <div>{{ scope.row.purchase_price }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Ship Status">
              <template slot-scope="scope">
                <span>{{ orderStatus[scope.row.order_status_client] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Vendor">
              <template slot-scope="scope">
                <span>{{ scope.row.service_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Created">
              <template slot-scope="scope">
                <span>{{ scope.row.order_update_time_format }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="Operations">
              <template v-if="scope.row.order_status == 5" slot-scope="scope">
                <i v-show="scopeIndex == scope.$index && refreshLoading" class="el-icon-loading" />
                <el-button
                  type="text"
                  :disabled="scopeIndex == scope.$index && refreshLoading"
                  size="small"
                  @click="handleRefreshClick(scope.row, scope.$index)"
                >Refresh</el-button>
              </template>
            </el-table-column> -->
          </el-table>
          <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <unhosting-products :visible.sync="dialogVisible" />
  </div>
</template>
<script>
import { debounce } from '@/utils'
import { getOrderList, getLogisticInfo, clearOrderException } from '@/api/orders'
import { getStoreList } from '@/api/product'
import UnhostingProducts from './components/UnhostingProducts'
export default {
  name: 'orders',
  components: {
    Pagination: () => import('@/components/Pagination'),
    UnhostingProducts
  },
  props: {},
  data() {
    return {
      queryForm: {
        order_name: '',
        store_url: '',
        order_status: [],
        logistics_status: []
      },
      formQuery: {
        order_name: '',
        order_status_client: '',
        store_url: '',
        iDisplayStart: 0,
        iDisplayLength: 2
      },
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      // logisticsStatus: {1: "待发货", 2: "已揽件", 3: "运输中", 4: "已送达", 5: "已拒收", 6: "已取消", 7: "已退回", 8: "待转单", 9: "退货在仓"},
      // logisticsStatus: { 1: 'Waiting For Delivery', 2: 'Received', 3: 'In Transit', 4: 'Delivered', 5: 'Rejected', 6: 'Canceled', 7: 'Returned', 8: 'Pending Transfer', 9: 'Return Goods In Stock' },
      // orderStatus: {1: "待支付", 2: "金额处理", 3: "完成支付", 4: "退款", 5: "异常", 6: "部分支付", 7: "部分退款", 8: "订单取消"},
      // orderStatus: { 1: 'Pending payment', 2: 'Processing', 3: 'Complete payment', 4: 'Refunded', 5: 'Order exception', 6: 'Partially payment', 7: 'Partially refunded', 8: 'Order canceled' },
      orderStatus: { 0: 'ALL', 1: 'Pending', 2: 'Processing', 3: 'In transit', 4: 'Exception', 5: 'Delivered' },
      tabList: [
        { label: 'ALL', name: '0' },
        { label: 'Pending', name: '1' },
        { label: 'Processing', name: '2' },
        { label: 'In Transit', name: '3' },
        { label: 'Exception', name: '4' },
        { label: 'Delivered', name: '5' }
      ],
      labelList: [
        // { label: 'Order Number', value: 'order_no', type: 'order_no' },
        { label: 'Third Party Order Number', value: 'thirdParty_order_on', type: 'order_no' },
        { label: 'Order Amount', value: 'total_price' },
        { label: 'Order Status', value: 'order_status_name', type: 'order_status' },
        { label: 'Logistics Status', value: 'logistics_status_name', type: 'logistics_status' }
      ],
      loading: false,
      dialogVisible: false,
      timelineLoading: false,
      refreshLoading: false,
      tableData: [],
      logisticList: [],
      storeList: [],
      scopeIndex: '',
      selOrderIds: []
    }
  },
  computed: {},
  created() {
    this.init()
    this.Inquire()
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
    handleSelectionChange(val) {
      this.selOrderIds = val.map(i => i.id)
      console.log(this.selOrderIds)
    },
    Inquire() {
      // const loading = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      this.loading = true
      this.formQuery.iDisplayLength = this.listQuery.limit
      this.formQuery.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      getOrderList(this.formQuery).then(res => {
        // console.log(res.data)
        if (res.code === 200) {
          this.tableData = res.data
          this.listQuery.total = +res.total
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // loading.close()
        this.loading = false
      })
    },
    resetPageLimit() {
      this.listQuery.page = 1
      this.listQuery.limit = 10
    },
    handleClick() {
      this.resetPageLimit()
      this.Inquire()
    },
    toLink(row) {
      this.$router.push({ name: 'orders-detail', query: { order_id: row.id, order_no: row.order_name }})
    },
    logDetail(row) {
      this.dialogVisible = true
      this.timelineLoading = true
      getLogisticInfo({ logistics_no: row.logistics_no }).then(res => {
        console.log(res.data)
        if (res.code === 200) {
          this.timelineLoading = false
          this.logisticList = res.data.OrderTrackingDetails
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleOpen() {
      this.$nextTick(() => {
        this.$refs.myScrollbar.wrap.scrollTop = 0 // 这句重置滚动条高度
      })
    },
    handleRefreshClick(row, index) {
      this.$confirm('Try to refresh the abnormal status of the order?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.scopeIndex = index
        this.refreshLoading = true
        clearOrderException({ order_no: row.order_no }).then(res => {
          console.log(res.data)
          if (res.code === 200) {
            this.$message.success(res.message)
            this.Inquire()
          }
          this.refreshLoading = false
        }).catch(err => {
          console.log(err)
          this.refreshLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    handleCommand(command) {
      console.log(command)
      if (this.selOrderIds.length === 0) {
        this.$confirm(`Chosen orders will be allocated to the vendors following your product's hosting setting.`, 'Manual Order placing', {
          confirmButtonText: 'Ok',
          showCancelButton: false
        })
      } else {
        this.dialogVisible = true
      }
    },
    filterOrders: debounce(function() {
      // this.formQuery.order_name = this.queryForm.order_name
      this.resetPageLimit()
      this.Inquire()
    }, 500),
    filterOrderStatus: debounce(function() {
      // this.formQuery.order_status = this.queryForm.order_status.toString()
      this.resetPageLimit()
      this.Inquire()
    }, 500),
    filterLogisticsStatus: debounce(function() {
      // this.formQuery.logistics_status = this.queryForm.logistics_status.toString()
      this.resetPageLimit()
      this.Inquire()
    }, 500),
    filterStoreUrl: debounce(function() {
      // this.formQuery.store_url = this.queryForm.store_url
      this.resetPageLimit()
      this.Inquire()
    }, 500)
  }
}
</script>
<style lang="scss" scoped>
.my-orders {
  padding: 30px;
}
.logistics-timeline {
  padding-left: 20px;
}
.filter-control {
  .filter-item {
    &:first-child {
      margin-left: 0;
    }
     margin-left: 15px;
  }
}
</style>
