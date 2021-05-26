<template>
  <div v-loading="loading" class="order-detail p30">
    <div class="order-header flexbox">
      <el-button
        size="small"
        class="button-border"
        icon="el-icon-back"
        @click="$router.back()"
      />
      <div class="order-id ml20">
        Order No：<span class="primary">{{ order_no }}</span>
      </div>
      <el-select v-model="selectedProduct" v-if="isShowProductIndex" @change="handleChange(selectedProduct)" placeholder="Select Product">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- <div style="float:right;" class="order-id ml20">
       <el-button type="primary" size="small" @click="afterSales">Confirm After Sales</el-button>
      </div> -->
    </div>
    <div v-for="(info,key) in detailInfo" :key="key" class="order-cell" :id="'product'+key">
      <el-card class="box-card mt20">
        <div slot="header">
          <div class="detail-block-title">
            <div >
              <h2>Product <span v-if="isShowProductIndex">{{ key+1 }} </span><span style="float:right;"><el-button type="primary" size="small" @click="afterSales(info)">Confirm After Sales</el-button></span></h2>
            </div>
          </div>
        </div>
        <el-table
          ref="productTable"
          fit
          :data="info.goods_info"
          style="width: 100%"
          highlight-current-row
          :header-cell-style="{ background: '#F3F5F9FF', color: '#262B3EFF' }"
        >
          <el-table-column label="Picture" width="150">
            <template slot-scope="scope">
              <el-image class="sku_image" :src="scope.row.sku_image" fit="cover">
                <div slot="error" class="image-slot">
                  <i class="error-icon el-icon-picture-outline" />
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="third_goods_name" label="Products" min-width="150"/>
          <el-table-column prop="third_sku_name" label="Price&Amount" width="200">
            <template slot-scope="scope">
              <span>{{ `${scope.row.third_price} x ${scope.row.sku_num}` }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="total_price" label="Total Price" width="200" />
          <el-table-column prop="service_name" label="Vendor" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.service_name || '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="purchase_price" label="Total Cost" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.purchase_price || '--' }}</span>
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
          <el-col :offset="1" :span="8">
            <div class="flexbox">
              <div class="vendor-sub-title"><span>Shipping address</span></div>
            </div>
            <ul class="customer-info mt15">
              <li><span>Name: </span><span>{{ info.consignee }}</span></li>
              <li><span>Street: </span><span>{{ info.address1 }}</span></li>
              <li><span>Zipcode: </span><span>{{ info.zip }}</span></li>
              <li><span>Country: </span><span>{{ info.country }}</span></li>
              <li><span>Phone: </span><span>{{ info.mobile }}</span></li>
            </ul>
          </el-col>
          <el-col :span="10">
            <div class="flexbox">
              <div class="vendor-sub-title"><span>Contact information</span></div>
            </div>
            <ul class="customer-info mt15">
              <li><span>Email: </span><span>{{ info.email }}</span></li>
            </ul>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="box-card mt20">
        <div slot="header">
          <div class="detail-block-title">
            <h2>Vendor</h2>
          </div>
        </div>
        <div class="border-top">
          <el-row :gutter="20">
            <el-col :offset="1" :span="8">
              <div class="grid-content bg-purple">
                <div class="flexbox">
                  <div class="vendor-sub-title">Name: <span>{{ info.vendor.service_name || '--' }}</span></div>
                </div>
                <ul class="vendor-info mt15">
                  <li><span>Total Cost: </span><span>${{ info.vendor.total_cost }}</span></li>
                  <li><span>Product Price: </span><span>${{ info.vendor.product_price }}</span></li>
                  <li><span>Shipping Price: </span><span>${{ info.vendor.shipping_price }}</span></li>
                  <li><span>Service Price: </span><span>${{ info.vendor.service_price }}</span></li>
                </ul>
              </div>
            </el-col>
            <el-col :span="15">
              <div class="grid-content bg-purple">
                <div class="flexbox">
                  <div class="vendor-sub-title">Status: <span>{{ info.vendor.track_info.TrackingStatus ? info.vendor.track_info.TrackingStatus : '' || '--' }}</span></div>
                  <div class="vendor-sub-title ml40">Tracking Numbers: <span>{{ info.vendor.track_info.WaybillNumber ? info.vendor.track_info.WaybillNumber : '' || '--' }}</span></div>
                </div>
                <el-timeline v-if=" info.vendor.track_info.OrderTrackingDetails" class="mt20 pl20" :reverse="false">
                  <el-timeline-item
                    v-for="(item, index) in info.vendor.track_info.OrderTrackingDetails"
                    :key="index"
                    type="primary"
                  >
                    <span>{{ item.ProcessDate }}</span><span class="ml20">{{ item.ProcessContent }}</span>
                  </el-timeline-item>
                </el-timeline>
                <div v-else class="empty-text ml40 mt40">
                  <div class="empty-icon">
                    <svg-icon icon-class="nodata" />
                  </div>
                  <div class="empty-normal">No Track Info</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getOrderInfo } from '@/api/orders'
export default {
  name: 'orders-detail',
  props: {},
  data() {
    return {
      labelList: [
        { label: 'Products', value: 'third_goods_name' },
        { label: 'SKU', value: 'third_sku_name' },
        { label: 'SKU Num', value: 'sku_num' },
        { label: 'Price', value: 'third_price' },
        { label: 'The Logistics Cost', value: 'logistics_cost' },
        { label: 'Service Fee', value: 'service_fee' }
      ],
      detailInfo: {},
      loading: false,
      selectedProduct: '',
      platForm: ''
    }
  },
  computed: {
    order_id() {
      return this.$route.query.order_id
    },
    order_no() {
      return this.$route.query.order_no
    },
    isShowProductIndex() {
      return this.detailInfo.length > 1
    },
    options() {
      const len = this.detailInfo.length
      const arr = []
      if (len < 2) {
        return []
      } else {
        for (let i = 0; i < len; i++) {
          arr.push({ label: 'Product' + (i + 1), value: i })
        }
      }
      return arr
    }
  },
  created() {
    this.platForm = this.$route.query.platForm
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
      getOrderInfo({ orders_id: this.order_id, plat_form: this.platForm })
        .then((res) => {
          console.log(res.data)
          if (res.code === 200) {
            this.detailInfo = res.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          // loading.close()
          this.loading = false
        })
    },
    handleChange(index) {
      const id = 'product' + index
      this.$nextTick(() => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
      })
    },
    afterSales(info) {
      // console.log(info)
      this.$router.push({ name: 'after-create', query: { type: 'create', id: this.order_id, order_no: this.$route.query.order_no, detailInfo: info }})
    }
  }
}
</script>
<style lang="scss">
.order-id {
  line-height: 36px;
  margin-right: 20px;
}
.order-detail {
  overflow: auto;
  .order-header {
    line-height: 30px;
  }
  .order-cell {
    overflow: auto;
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
  border-bottom: 1px solid #ddd;
  .text-subdued {
    color: #637381;
  }
  div {
    &:first-child {
      margin-left: 0;
    }
    margin-left: 20px;
  }
}
.empty-text {
  width: 150px;
  text-align: center;
  .empty-icon {
    svg {
      font-size: 55px;
    }
  }
  .empty-normal {
    color: rgba(0, 0, 0, 0.25);
  }
}
.vendor-info {
  padding-left: 25px;
  line-height: 35px;
}
.customer-info {
  @extend .vendor-info;
  // padding-left: 22px;
  // line-height: 30px;
}
.vendor-sub-title {
  line-height: 25px;
  font-weight: 700;
}
.border-top {
  border-top: 1px solid #ddd;
  padding-top: 20px;
  &:first-child {
    padding-top: 0 !important;
    border-top: none !important;
  }
}
</style>
