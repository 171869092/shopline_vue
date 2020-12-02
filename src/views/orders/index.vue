<template>
  <div class="my-orders">
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="(tab, key) in tabList" :key="key" :label="tab" :name="key">
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            highlight-current-row
            fit
            :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}"
          >
            <el-table-column type="selection" />
            <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
              <template slot-scope="scope">
                <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
                <span v-if="item.type == 'order_number'">
                  <span class="link" @click="toLink(scope.row)">{{ scope.row.order_number }}</span>
                </span>
                <span v-if="item.type == 'logistics_status'">
                  <div>{{ scope.row.logistics_status }}</div>
                  <div class="primary pointer">Logistics Details</div>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import { getOrderTabs } from '@/api/orders'
export default {
  name: 'orders',
  props: {},
  data() {
    return {
      activeName: '1',
      tabList: [],
      labelList: [
        { label: 'Order Number', value: 'order_number', type: 'order_number' },
        { label: 'Third Party Order Number', value: 'third_party_order_number' },
        { label: 'Order Amount', value: 'order_amount' },
        { label: 'Order Status', value: 'order_status' },
        { label: 'Logistics Status', value: 'logistics_status', type: 'logistics_status' }
      ],
      loading: false,
      tableData: [
        {
          order_number: '13698846235',
          third_party_order_number: 'H12-14432685728',
          order_amount: '$10.00',
          order_status: 'Complete payment',
          logistics_status: 'In Transit'
        }
      ]
    }
  },
  computed: {},
  created() {
    this.init()
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
    toLink(row) {
      this.$router.push({ name: 'orders-detail' })
    }
  }
}
</script>
<style scoped>
.my-orders {
  padding: 30px;
}
</style>
