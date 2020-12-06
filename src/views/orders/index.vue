<template>
  <div class="my-orders">
    <el-card class="box-card">
      <el-tabs v-model="formQuery.logistics_status" @tab-click="handleClick">
        <el-tab-pane v-for="(tab, key) in tabList" :key="key" :label="tab.label" :name="tab.name">
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            highlight-current-row
            fit
            :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}"
          >
            <!-- <el-table-column type="selection" /> -->
            <el-table-column label="Expand" type="expand" width="100">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="商品名称">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="所属店铺">
                    <span>{{ props.row.shop }}</span>
                  </el-form-item>
                  <el-form-item label="商品 ID">
                    <span>{{ props.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="店铺 ID">
                    <span>{{ props.row.shopId }}</span>
                  </el-form-item>
                  <el-form-item label="商品分类">
                    <span>{{ props.row.category }}</span>
                  </el-form-item>
                  <el-form-item label="店铺地址">
                    <span>{{ props.row.address }}</span>
                  </el-form-item>
                  <el-form-item label="商品描述">
                    <span>{{ props.row.desc }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
              <template slot-scope="scope">
                <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
                <span v-if="item.type == 'order_no'">
                  <span class="primary pointer" @click="toLink(scope.row)">{{ scope.row.thirdParty_order_on }}</span>
                </span>
                <span v-if="item.type == 'order_status'">
                  <div>{{ orderStatus[scope.row.order_status] }}</div>
                </span>
                <span v-if="item.type == 'logistics_status'">
                  <div>{{ logisticsStatus[scope.row.logistics_status] }}</div>
                  <div class="primary pointer" @click="logDetail(scope.row)">Logistics Details</div>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog title="Logistics Details" :visible.sync="dialogVisible" width="700px">
      <el-timeline v-if="logisticList">
        <el-timeline-item v-for="(item,key) in logisticList" :key="key" color="#0bbd87" :timestamp="item.ProcessDate" placement="top">
          <p>{{ item.ProcessLocation }}</p>
          <p>{{ item.ProcessContent }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderTabs, getOrderList, getLogisticInfo } from '@/api/orders'
export default {
  name: 'orders',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  props: {},
  data() {
    return {
      formQuery: {
        logistics_status: '1',
        iDisplayStart: 0,
        iDisplayLength: 2
      },
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      // orderStatus: {1: "待支付", 2: "金额处理", 3: "完成支付", 4: "退款", 5: "异常", 6: "部分支付", 7: "部分退款", 8: "订单取消"},
      logisticsStatus: { 1: 'Waiting For Delivery', 2: 'Received', 3: 'In Transit', 4: 'Delivered', 5: 'Rejected', 6: 'Canceled', 7: 'Returned', 8: 'Pending Transfer', 9: 'Return Goods In Stock' },
      orderStatus: { 1: 'Pending payment', 2: 'Processing', 3: 'Complete payment', 4: 'Refunded', 5: 'Order exception', 6: 'Partially payment', 7: 'Partially refunded', 8: 'Order canceled' },
      tabList: [
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
      loading: false,
      dialogVisible: false
    }
  },
  computed: {},
  created() {
    // this.init()
    this.Inquire()
  },
  methods: {
    init() {
      getOrderTabs().then(res => {
        console.log(res.data)
        if (res.code === 200) {
          this.tabList = res.data
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
    handleClick() {
      this.listQuery.page = 1
      this.listQuery.limit = 10
      this.Inquire()
    },
    toLink(row) {
      this.$router.push({ name: 'orders-detail', query: { order_no: row.order_no }})
    },
    logDetail(row) {
      this.dialogVisible = true
      getLogisticInfo({ logistics_no: row.logistics_no }).then(res => {
        console.log(res.data)
        if (res.code === 200) {
          this.logisticList = res.data.OrderTrackingDetails
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped>
.my-orders {
  padding: 30px;
}
</style>
