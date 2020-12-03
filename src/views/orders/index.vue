<template>
  <div class="my-orders">
    <el-card class="box-card">
      <el-tabs v-model="formQuery.logistics_status" @tab-click="handleClick">
        <el-tab-pane v-for="(tab, key) in tabList" :key="key" :label="tab" :name="String(key)">
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
            <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
              <template slot-scope="scope">
                <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
                <span v-if="item.type == 'order_number'">
                  <span class="link" @click="toLink(scope.row)">{{ scope.row.order_no }}</span>
                </span>
                <span v-if="item.type == 'logistics_status'">
                  <div>{{ scope.row.logistics_status_name }}</div>
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
      tabList: { 1: '待发货', 2: '已揽件', 3: '运输中', 4: '已送达', 5: '已拒收', 6: '已取消', 7: '已退回', 8: '待转单', 9: '退货在仓' },
      labelList: [
        { label: 'Order Number', value: 'order_no', type: 'order_number' },
        { label: 'Third Party Order Number', value: 'thirdParty_order_on' },
        { label: 'Order Amount', value: 'total_price' },
        { label: 'Order Status', value: 'order_status_name' },
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
