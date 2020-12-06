<template>
  <div class="orders-detail p30">
    <el-card v-loading="loading" class="box-card">
      <div slot="header" class="clearfix">
        <div class="flexbox">
          <div class="detail-title">Order Detail</div>
          <div class="order-id ml30">Order No：<span class="primary">{{ order_no }}</span></div>
        </div>

      </div>
      <div>
        <div class="detail-block-title mb30">
          <h2>Product Information</h2>
        </div>
        <el-table
          ref="productTable"
          :data="detailInfo.goods_info"
          style="width: 100%"
          highlight-current-row
          fit
          :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}"
        >
          <!-- <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
            <template slot-scope="scope">
              <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="third_goods_name" label="Products" />
          <el-table-column prop="third_sku_name" label="SKU" />
          <el-table-column prop="sku_num" label="SKU Num" />
          <el-table-column prop="third_price" label="Price">
            <template slot-scope="scope">
              <span v-if="scope.row.third_price">{{ scope.row.third_price }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="logistics_cost" label="Logistics Cost">
            <template slot-scope="scope">
              <span v-if="scope.row.logistics_cost">{{ scope.row.logistics_cost }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="service_fee" label="Service Charge" />
        </el-table>
      </div>
      <div>
        <div class="detail-block-title mt30 mb30">
          <h2>Delivery Information</h2>
        </div>
        <el-row>
          <el-col :span="10">
            <el-form ref="ruleForm" :model="detailInfo" label-width="140px">
              <el-form-item label="Consignee" prop="consignee">
                <el-input v-model="detailInfo.consignee" readonly />
              </el-form-item>
              <el-form-item label="Shipping Address" prop="address1">
                <el-input v-model="detailInfo.address1" readonly />
              </el-form-item>
              <el-form-item label="Email Address" prop="email">
                <el-input v-model="detailInfo.email" readonly />
              </el-form-item>
              <el-form-item label="Contact" prop="mobile">
                <el-input v-model="detailInfo.mobile" readonly />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div>
        <div class="detail-block-title mt20 mb30">
          <h2>Logistics Information</h2>
        </div>
        <div class="block">
          <div class="flexbox p20 log-title">
            <div>Status: {{ detailInfo.track_info.TrackingStatus }}</div>
            <div class="ml50">Waybill Number：{{ detailInfo.track_info.WaybillNumber }}</div>
          </div>
          <el-timeline class="mt20 pl20">
            <el-timeline-item
              v-for="(activity, index) in detailInfo.track_info.OrderTrackingDetails"
              :key="index"
            >
              <span>{{ activity.ProcessDate }}</span><span class="ml40">{{ activity.ProcessContent }}</span>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getOrderInfo } from '@/api/orders'
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
        { label: 'Products', value: 'third_goods_name' },
        { label: 'SKU', value: 'third_sku_name' },
        { label: 'SKU Num', value: 'sku_num' },
        { label: 'Price', value: 'third_price' },
        { label: 'The Logistics Cost', value: 'logistics_cost' },
        { label: 'Service Fee', value: 'service_fee' }
      ],
      detailInfo: {
        track_info: {
          OrderTrackingDetails: []
        }
      },
      loading: false
    }
  },
  computed: {
    order_no() {
      return this.$route.query.order_no
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // const loading = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      this.loading = true
      getOrderInfo({ order_no: this.order_no }).then(res => {
        console.log(res.data)
        if (res.code === 200) {
          this.detailInfo = res.data
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // loading.close()
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-block-title {
  // color: #9299B0FF;
  padding: 5px 5px;
  border-bottom: 0.1rem solid var(--p-border-subdued,#dfe3e8);
  h2 {
    font-size: 16px;
    font-weight: 600;
    // margin: 0;
  }
}
.block {
  background: #F7F9FCFF;
}
.log-title {
  border-bottom: 1px solid #DFE1E8;
}
</style>
