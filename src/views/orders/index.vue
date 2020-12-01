<template>
  <div class="my-orders">
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="(tab, key) in tabList" :key="key" :label="tab.label" :name="tab.name">
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            highlight-current-row
            fit
          >
            <el-table-column type="selection" />
            <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
              <template slot-scope="scope">
                <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
                <span v-if="item.type == 'product'">
                  <img :src="scope.row.image" width="50px" alt="">
                  <span class="ml20">{{ scope.row.name }}</span>
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
export default {
  name: 'orders',
  props: {},
  data() {
    return {
      activeName: '1',
      tabList: [
        { label: 'All', name: '1' },
        { label: 'Waiting For Delivery', name: '2' },
        { label: 'In Transit', name: '3' },
        { label: 'Complete', name: '4' },
        { label: 'Canceled', name: '5' }
      ],
      labelList: [
        { label: 'Order Number', value: 'id', type: 'order_number' },
        { label: 'Third Party Order Number', value: 'supplier_name' },
        { label: 'Order Amount', value: 'mobile' },
        { label: 'Order Status', value: 'wechat_num' },
        { label: 'Logistics Status', value: 'address' }
      ]
    }
  },
  computed: {},
  created() {},
  methods: {}
}
</script>
<style scoped>
.my-orders {
  padding: 30px;
}
</style>
