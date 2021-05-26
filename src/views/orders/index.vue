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
          <div v-if="formQuery.order_status_client == 0 || formQuery.order_status_client == 1" class="filter-control">
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
            v-sticky="{top: 0, parent: '#app_main' }"
            :data="tableData"
            style="width: 100%"
            highlight-current-row
            fit
            stripe
            :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}"
            @select="shiftMultiple"
            @select-all="selectAll"
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
            <el-table-column label="Payment Time">
              <template slot-scope="scope">
                <span>{{ scope.row.order_update_time_format }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <unhosting-products :visible.sync="dialogVisible" :list="unhostingData" :orders-id="selOrderIds" @close="closeDialog" />
    <el-dialog title="Manual Order placing" :visible.sync="tipDialogVisible" :append-to-body="true" width="30%" class="dialog-border">
      <div>
        Chosen orders will be allocated to the vendors following your product's hosting setting.
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="tipDialogVisible = false">Cancel</el-button>
        <el-button size="small" type="primary" :loading="submitLoading" @click="next">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { debounce } from '@/utils'
import { getOrderList, getLogisticInfo, getOrderGoods, orderJoinQueue } from '@/api/orders'
import { getStoreList } from '@/api/product'
import Sticky from '@/directive/fix-table-header'
import UnhostingProducts from './components/unhosting-products'
export default {
  name: 'orders',
  directives: { Sticky },
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
      submitLoading: false,
      tipDialogVisible: false,
      tableData: [],
      logisticList: [],
      storeList: [],
      scopeIndex: '',
      selOrderIds: [],
      unhostingData: [],
      selectRows: [],
      origin: -1, // 选择起始行索引
      keepDown: false, // 是否按住shift键
      pin: false, // 这里给一个变量，默认为false，不按住
      jumpRoute: '1',
      platForm: ''
    }
  },
  computed: {},
  created() {
    this.jumpRoute = this.$route.name
    this.init()
    this.Inquire()
  },
  mounted() {
    window.addEventListener('keydown', code => { // 这个是获取键盘按住事件
      // console.log(code) // 这个是你按住键盘打印出键盘信息，在浏览器中自行查看
      if (code.key === 'Shift' && code.shiftKey) { // 判断是否按住shift键，是就把pin赋值为true
        this.pin = true
      }
    })
    window.addEventListener('keyup', code => { // 这个是获取键盘松开事件
      this.pin = false
    })
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
    // 这里是select事件开始
    shiftMultiple(selection, row) {
      console.log('single', selection)
      const tableIndex = this.formQuery.order_status_client
      const data = this.$refs.multipleTable[tableIndex].tableData // 获取所以数据
      const origin = this.origin // 起点数 从-1开始
      const endIdx = row.index // 终点数
      if (this.pin && selection.includes(data[origin])) { // 判断按住
        console.log('pinselect', selection)
        const sum = Math.abs(origin - endIdx) + 1// 这里记录终点
        const min = Math.min(origin, endIdx)// 这里记录起点
        let i = 0
        while (i < sum) {
          const index = min + i
          const item = data[index]
          this.$refs.multipleTable[tableIndex].toggleRowSelection(data[index], true) // 通过ref打点调用toggleRowSelection方法，第二个必须为true
          if (!this.selOrderIds.includes(item.id)) {
            this.selOrderIds.push(data[index].id)
          }
          i++
        }
      } else {
        console.log('unpinselect', selection)
        if (selection.length > 0) {
          this.selOrderIds = selection.map(item => item.id)
        } else {
          this.selOrderIds = []
        }
        this.origin = row.index // 没按住记录起点
      }
      console.log('single selOrderIds:', this.selOrderIds)
    },
    selectAll(selection) {
      console.log('all', selection)
      if (selection.length > 0) {
        this.selOrderIds = selection.map(item => item.id)
      } else {
        this.selOrderIds = []
      }
      console.log('all selOrderIds:', this.selOrderIds)
    },
    Inquire() {
      // const loading = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      if (this.jumpRoute === 'shopify') {
        this.formQuery.plat_form = '1'
      } else {
        this.formQuery.plat_form = '2'
      }
      this.loading = true
      this.selOrderIds = []
      this.formQuery.iDisplayLength = this.listQuery.limit
      this.formQuery.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      getOrderList(this.formQuery).then(res => {
        // console.log(res.data)
        if (res.code === 200) {
          this.tableData = res.data.map((item, index) => {
            item.index = index
            return item
          })
          this.listQuery.total = +res.total
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // loading.close()
        this.loading = false
      })
    },
    closeDialog(res) {
      console.log(res)
      if (res.status === 200) {
        // this.loading = true
        // setTimeout(() => {
        this.Inquire()
        // }, res.delay)
      }
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
      if (this.jumpRoute === 'shopify') {
        this.platForm = '1'
      } else {
        this.platForm = '2'
      }
      this.$router.push({ name: 'orders-detail', query: { order_id: row.id, order_no: row.order_name, platForm: this.platForm }})
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
    handleCommand(command) {
      console.log(command)
      if (this.selOrderIds.length > 0) {
        this.tipDialogVisible = true
      } else {
        this.$message.warning('Please choose product first!')
      }
    },
    next() {
      this.submitLoading = true
      getOrderGoods({ orders_id: this.selOrderIds.toString() })
        .then((res) => {
          if (res.code === 4998) {
            orderJoinQueue({ orders_id: this.selOrderIds.toString(), type: '2' }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.submitLoading = false
                this.tipDialogVisible = false
                this.Inquire()
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            this.unhostingData = res.data
            this.dialogVisible = true
            this.submitLoading = false
            this.tipDialogVisible = false
          }
        })
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
