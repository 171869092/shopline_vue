<template>
  <div class="my-orders">
    <el-card class="box-card">
      <!-- <el-tabs v-model="formQuery.logistics_status" @tab-click="handleClick"> -->
      <div class="filter-control flexbox mb20">
        <div class="filter-item">
          <el-input
            v-model="queryForm.order_name"
            clearable
            class="w-500"
            prefix-icon="el-icon-search"
            placeholder="Filter orders"
            @change="filterOrders"
          />
        </div>
        <div class="filter-item">
          <el-select
            v-model="queryForm.order_status"
            multiple
            clearable
            placeholder="Order status"
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
        <div class="filter-item">
          <el-select
            v-model="queryForm.logistics_status"
            multiple
            clearable
            placeholder="Logistics status"
            @change="filterLogisticsStatus"
          >
            <el-option
              v-for="(item, key) in logisticsStatus"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <el-select
            v-model="queryForm.store_url"
            clearable
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

      <!-- <el-tab-pane v-for="(tab, key) in tabList" :key="key" :label="tab.label" :name="tab.name"> -->
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
        <el-table-column label="Expand" type="expand" width="100">
          <template slot-scope="scope">
            <el-table border :data="scope.row.orders_sublist" style="width: 100%">
              <el-table-column prop="service_name" label="Service Provider" width="200">
                <template slot-scope="props">
                  <div>{{ props.row.service_name || '--' }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="total_price" label="Order Amount" width="150" />
              <el-table-column prop="order_status" label="Order Status" width="200">
                <template slot-scope="props">
                  <div>{{ orderStatus[props.row.order_status] }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="abnormal_reason" label="Abnormal Reason">
                <template slot-scope="props">
                  <div v-html="props.row.abnormal_reason || '--'" />
                </template>
              </el-table-column>
              <el-table-column label="Logistics Status" width="250">
                <template slot-scope="props">
                  <div>{{ logisticsStatus[props.row.logistics_status] }}</div>
                  <div class="primary pointer" @click="logDetail(props.row)">Logistics Details</div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="Order">
          <template slot-scope="scope">
            <span class="primary pointer" @click="toLink(scope.row)">{{ scope.row.order_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Order Amount">
          <template slot-scope="scope">
            <div>{{ scope.row.total_price }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Store">
          <template slot-scope="scope">
            <div>{{ scope.row.store_url }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Order Status">
          <template slot-scope="scope">
            <div>{{ orderStatus[scope.row.order_status] }}</div>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
      <!-- </el-tab-pane> -->
      <!-- </el-tabs> -->
    </el-card>
    <el-dialog class="custom-dialog" title="Logistics Details" :visible.sync="dialogVisible" width="700px" @open="handleOpen">
      <el-scrollbar ref="myScrollbar" v-loading="timelineLoading" wrap-class="dialog-scrollbar">
        <el-timeline class="logistics-timeline">
          <el-timeline-item v-for="(item,key) in logisticList" :key="key" color="#EF6F38FF">
            <!-- <p>{{ item.ProcessContent }}</p>
            <span style="color: #909399">{{ item.ProcessDate }}</span> -->
            <p>{{ item.ProcessContent }}</p>
            <span style="color: #909399">{{ item.ProcessDate }}</span>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
import { debounce } from '@/utils'
import { getOrderList, getLogisticInfo } from '@/api/orders'
import { getStoreList } from '@/api/product'
export default {
  name: 'orders',
  components: {
    Pagination: () => import('@/components/Pagination')
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
        order_status: '',
        store_url: '',
        logistics_status: '',
        iDisplayStart: 0,
        iDisplayLength: 2
      },
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      // logisticsStatus: {1: "待发货", 2: "已揽件", 3: "运输中", 4: "已送达", 5: "已拒收", 6: "已取消", 7: "已退回", 8: "待转单", 9: "退货在仓"},
      logisticsStatus: { 1: 'Waiting For Delivery', 2: 'Received', 3: 'In Transit', 4: 'Delivered', 5: 'Rejected', 6: 'Canceled', 7: 'Returned', 8: 'Pending Transfer', 9: 'Return Goods In Stock' },
      // orderStatus: {1: "待支付", 2: "金额处理", 3: "完成支付", 4: "退款", 5: "异常", 6: "部分支付", 7: "部分退款", 8: "订单取消"},
      orderStatus: { 1: 'Pending payment', 2: 'Processing', 3: 'Complete payment', 4: 'Refunded', 5: 'Order exception', 6: 'Partially payment', 7: 'Partially refunded', 8: 'Order canceled' },
      tabList: [
        { label: 'All', name: '0' },
        { label: 'Waiting For Delivery', name: '1' },
        { label: 'Received', name: '2' },
        { label: 'In Transit', name: '3' },
        { label: 'Delivered', name: '4' },
        { label: 'Rejected', name: '5' },
        { label: 'Canceled', name: '6' },
        { label: 'Returned', name: '7' },
        { label: 'Pending Transfer', name: '8' },
        { label: 'Return Goods In Stock', name: '9' }
      ],
      labelList: [
        // { label: 'Order Number', value: 'order_no', type: 'order_no' },
        { label: 'Third Party Order Number', value: 'thirdParty_order_on', type: 'order_no' },
        { label: 'Order Amount', value: 'total_price' },
        { label: 'Order Status', value: 'order_status_name', type: 'order_status' },
        { label: 'Logistics Status', value: 'logistics_status_name', type: 'logistics_status' }
      ],
      tableData: [],
      logisticList: [],
      storeList: [],
      loading: false,
      dialogVisible: false,
      timelineLoading: false
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
        console.log(res.data)
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
      this.$router.push({ name: 'orders-detail', query: { order_no: row.order_no }})
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
    filterOrders: debounce(function() {
      this.formQuery.order_name = this.queryForm.order_name
      this.resetPageLimit()
      this.Inquire()
    }, 500),
    filterOrderStatus: debounce(function() {
      this.formQuery.order_status = this.queryForm.order_status.toString()
      this.resetPageLimit()
      this.Inquire()
    }, 500),
    filterLogisticsStatus: debounce(function() {
      this.formQuery.logistics_status = this.queryForm.logistics_status.toString()
      this.resetPageLimit()
      this.Inquire()
    }, 500),
    filterStoreUrl: debounce(function() {
      this.formQuery.store_url = this.queryForm.store_url
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
