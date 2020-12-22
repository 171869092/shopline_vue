<template>
  <div class="order-detail p30">
    <el-row :gutter="20">
      <el-col :span="20" :offset="2">
        <div class="order-header flexbox">
          <el-button
            size="small"
            class="button-border"
            icon="el-icon-back"
            @click="$router.back()"
          />
          <div class="order-id ml20">
            Order No：<span class="primary">{{ order_name }}</span>
          </div>
        </div>
        <el-card class="box-card mt20">
          <div slot="header">
            <div class="detail-block-title">
              <h2>Product</h2>
            </div>
          </div>
          <el-table
            ref="productTable"
            :data="detailInfo.goods_info"
            style="width: 100%"
            highlight-current-row
            fit
            :header-cell-style="{ background: '#F3F5F9FF', color: '#262B3EFF' }"
          >
            <!-- <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
            <template slot-scope="scope">
              <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
            </template>
          </el-table-column> -->
            <el-table-column prop="third_goods_name" label="Products" width="300" />
            <el-table-column prop="third_sku_name" label="SKU" width="300" />
            <el-table-column prop="sku_num" label="SKU Num" />
            <el-table-column prop="third_price" label="Price">
              <template slot-scope="scope">
                <span v-if="scope.row.third_price">{{
                  scope.row.third_price
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="purchase_price" label="Cost">
              <template slot-scope="scope">
                <span v-if="scope.row.purchase_price">{{
                  scope.row.purchase_price
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card class="box-card mt20">
          <div slot="header">
            <div class="detail-block-title">
              <h2>Customer</h2>
            </div>
          </div>
          <el-row>
            <el-col :span="10">
              <el-form ref="ruleForm" :model="detailInfo" label-width="140px">
                <el-form-item label="Consignee :" prop="consignee">
                  <div>{{ detailInfo.consignee || '--' }}</div>
                </el-form-item>
                <el-form-item label="Shipping Address :" prop="address1">
                  <div>{{ detailInfo.address1 || '--' }}</div>
                </el-form-item>
                <el-form-item label="Email Address :" prop="email">
                  <!-- <el-input v-model="detailInfo.email" readonly /> -->
                  <div>{{ detailInfo.email || '--' }}</div>
                </el-form-item>
                <el-form-item label="Contact :" prop="mobile">
                  <!-- <el-input v-model="detailInfo.mobile" readonly /> -->
                  <div>{{ detailInfo.mobile || '--' }}</div>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>

        <el-card class="box-card mt20">
          <div slot="header">
            <div class="detail-block-title">
              <h2>Timeline</h2>
            </div>
          </div>
          <div class="block">
            <div class="flexbox p20 log-title">
              <div>Status: {{ detailInfo.track_info.TrackingStatus || '--' }}</div>
              <div class="ml50">
                Waybill Number：{{ detailInfo.track_info.WaybillNumber || '--' }}
              </div>
            </div>
            <el-timeline class="mt20 pl20" :reverse="false">
              <el-timeline-item
                v-for="(activity, index) in detailInfo.track_info.OrderTrackingDetails"
                :key="index"
              >
                <span>{{ activity.ProcessDate }}</span><span class="ml40">{{ activity.ProcessContent }}</span>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
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
          products:
            'SYLLABLE S101 Strong bass TWS wireless headset noise reduction for music QCC3020',
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
    },
    order_name() {
      return this.$route.query.order_name
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.loading = true
      getOrderInfo({ order_no: this.order_no })
        .then((res) => {
          // console.log(res.data)
          if (res.code === 200) {
            this.detailInfo = res.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          loading.close()
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.order-detail {
  .order-header {
    line-height: 30px;
  }
  .button-border {
    border: 1px solid #ef6f38;
    color: #ef6f38;
  }
}

.detail-block-title {
  // color: #9299B0FF;
  // padding: 5px 5px;
  // border-bottom: 0.1rem solid var(--p-border-subdued,#dfe3e8);
  h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }
}
.block {
  background: #f7f9fcff;
}
.log-title {
  border-bottom: 1px solid #dfe1e8;
}
</style>
