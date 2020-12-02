<template>
  <div class="orders-detail p30">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="flexbox">
          <div class="detail-title">Order Detail</div>
          <div class="order-id ml30">Order ID：<span class="c_blue">13698846235</span></div>
        </div>

      </div>
      <div>
        <div class="detail-block-title mb30">Product Information</div>
        <el-table
          ref="productTable"
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
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <div class="detail-block-title mt30 mb30">Delivery Information</div>
        <el-row>
          <el-col :span="10">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="140px">
              <el-form-item label="Receiver" prop="receiver">
                <el-input v-model="form.name" />
              </el-form-item>
              <el-form-item label="Shipping Address" prop="receiver">
                <el-input v-model="form.name" />
              </el-form-item>
              <el-form-item label="Email Address" prop="receiver">
                <el-input v-model="form.name" />
              </el-form-item>
              <el-form-item label="Contact" prop="receiver">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div>
        <div class="detail-block-title mt20 mb30">Logistics Information</div>
        <div class="block">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'orders-detail',
  props: {},
  data() {
    return {
      tableData: [
        {
          products: 'SYLLABLE S101 Strong bass TWS wireless headset noise reduction for music QCC3020',
          SKU: 'CUP- C',
          quantity: '6',
          payment_amount: '$120.00',
          the_logistics_cost: '$5.00',
          service_fee: '$5.00'
        }
      ],
      labelList: [
        { label: 'Products', value: 'products' },
        { label: 'SKU', value: 'SKU' },
        { label: 'Quantity', value: 'quantity' },
        { label: 'Payment Amount', value: 'payment_amount' },
        { label: 'The Logistics Cost', value: 'the_logistics_cost' },
        { label: 'Service Fee', value: 'service_fee' }
      ],
      form: {},
      rules: {},
      activities: [{
        content: '支持使用图标',
        timestamp: '2018-04-12 20:46',
        size: 'large',
        type: 'primary',
        icon: 'el-icon-more'
      }, {
        content: '支持自定义颜色',
        timestamp: '2018-04-03 20:46',
        color: '#0bbd87'
      }, {
        content: '支持自定义尺寸',
        timestamp: '2018-04-03 20:46',
        size: 'large'
      }, {
        content: '默认样式的节点',
        timestamp: '2018-04-03 20:46'
      }]
    }
  },
  computed: {},
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.detail-block-title {
  color: #9299B0FF;
}
</style>
