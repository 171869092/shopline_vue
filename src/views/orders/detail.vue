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
      <el-select v-if="isShowProductIndex" v-model="selectedProduct" placeholder="Select Product" @change="handleChange(selectedProduct)">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div v-for="(info,key) in detailInfo" :id="'product'+key" :key="key" class="order-cell">
      <el-card class="box-card mt20">
        <div slot="header">
          <div class="detail-block-title">
            <div>
              <h2>Product <span v-if="isShowProductIndex">{{ key+1 }} </span><span style="float:right;"><el-button type="primary" size="small" style="margin-top: -10px" @click="afterSales(info)">After Sales</el-button></span></h2>
            </div>
          </div>
        </div>
        <el-table
          ref="productTable"
          fit
          empty-text="No Data"
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
          <el-table-column prop="third_goods_name" label="Products" min-width="150" />
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
          <el-table-column prop="purchase_price" label="Status" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.goods_type === 1 ? 'Normal' : 'Refund' || '--' }}</span>
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
    <el-dialog
      title="After sales"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="afterDialog" label-position="right" label-width="100px" :model="afterDialog" :rules="formRule">
        <el-form-item label="Type" prop="after_type">
          <el-select v-model="afterDialog.after_type" style="width: 95%" placeholder="please choose">
            <el-option v-for="(item,idx) in typeList" :key="idx" :label="item" :value="idx" />
          </el-select>
        </el-form-item>
        <el-form-item label="Mode" prop="after_model">
          <el-select v-model="afterDialog.after_model" style="width: 95%" placeholder="please choose">
            <el-option v-for="(item,idx) in modeList" :key="idx" :label="item" :value="String(idx + 1)" />
          </el-select>
        </el-form-item>
        <el-form-item label="Products" prop="product_json">
          <el-select v-model="afterDialog.product_json" multiple style="width: 95%" placeholder="please choose">
            <el-option v-for="item in productsList" :key="item.id" :label="item.third_goods_name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button v-throttle="[handleAfterSales]" type="primary">Determine</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderInfo } from '@/api/orders'
import { afterSalesType, afterSalesCreate } from '@/api/after'
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
      dialogVisible: false,
      selectedProduct: '',
      platForm: '',
      afterDialog: {
        after_type: '',
        after_model: '',
        product_json: ''
      },
      typeList: [],
      modeList: ['Resend', 'Refund', 'Return/Refund', 'Other'],
      productsList: [],
      orderInfo: {},
      formRule: {
        after_type: [
          { required: true, message: 'Please enter a after type', trigger: 'blur' }
        ],
        after_model: [
          { required: true, message: 'Please enter a after mode', trigger: 'blur' }
        ],
        product_json: [
          { required: true, message: 'Please enter a Products', trigger: 'blur' }
        ]
      }
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
      this.loading = true
      getOrderInfo({ orders_id: this.order_id, plat_form: this.platForm })
        .then((res) => {
          if (res.code === 200) {
            this.detailInfo = res.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
      afterSalesType().then(res => {
        if (res.code === 200) {
          this.typeList = res.data
        }
      })
    },
    handleChange(index) {
      const id = 'product' + index
      this.$nextTick(() => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
      })
    },
    afterSales(info) {
      this.orderInfo = info
      info.goods_info.forEach(item => {
        this.productsList.push(item)
      })
      this.dialogVisible = true
    },
    handleClose() {
      this.afterDialog = this.$options.data().afterDialog
      this.productsList = []
      this.dialogVisible = false
    },
    // 获取cookie
    getCookie: function(cname) {
      var name = cname + '='
      var ca = document.cookie.split(';')
      // console.log("获取cookie,现在循环")
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        // console.log(c)
        while (c.charAt(0) === ' ') c = c.substring(1)
        if (c.indexOf(name) !== -1) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    },
    handleAfterSales() {
      this.$refs.afterDialog.validate((valid) => {
        if (valid) {
          const products = []
          const productArr = []
          this.orderInfo.goods_info.forEach((item, index) => {
            productArr.push(item)
          })
          this.afterDialog.product_json.map(item => {
            productArr.forEach(it => {
              if (it.id === item) {
                products.push({
                  logistics_cost: it.logistics_cost,
                  cost: it.purchase_price,
                  sku_num: it.sku_num,
                  sku_name: it.third_goods_name,
                  sku_image: it.sku_image,
                  sale_money: it.sale_money,
                  sku_id: it.shopify_sku_id,
                  id: item
                })
              }
            })
          })
          const formData = {
            vendor: this.orderInfo.vendor.service_name,
            state: '',
            order_no: this.orderInfo.order_no,
            total: this.orderInfo.total_price,
            store_url: this.orderInfo.store_url,
            third_order_no: this.orderInfo.thirdParty_order_on,
            order_name: this.orderInfo.order_name,
            import_people: this.orderInfo.import_people,
            receive_json: {
              address: this.orderInfo.address1,
              city: this.orderInfo.city,
              country: this.orderInfo.country,
              consignee: this.orderInfo.consignee,
              first_name: this.orderInfo.first_name,
              last_name: this.orderInfo.last_name,
              mobile: this.orderInfo.mobile,
              email: this.orderInfo.email
            },
            shipping_json: {
              logistics_company: this.orderInfo.logistics_company,
              logistics_no: this.orderInfo.logistics_no,
              logistics_status: this.orderInfo.logistics_status
            },
            server_id: this.orderInfo.service_id,
            customer_name: decodeURI(this.getCookie('name')),
            product_json: products,
            order_create: this.orderInfo.order_create_time,
            after_model: this.afterDialog.after_model,
            after_type: this.afterDialog.after_type
          }
          const after_type = this.typeList[this.afterDialog.after_type]
          const after_model = this.modeList[this.afterDialog.after_model]
          const product_json = this.getValueOfLabel(this.afterDialog.product_json, this.productsList)
          afterSalesCreate(formData).then(res => {
            this.$message({ message: res.message, type: 'success' })
            this.$router.push({ name: 'after-create', query: { id: this.order_id, order_no: this.$route.query.order_no, after_type: after_type, after_model: after_model, product_json: product_json, after_id: res.data.id, server_name: res.data.vendor, after_create_time: res.data.after_create_time }})
            this.handleClose()
          }).catch(e => {
            console.log(e)
          })
        } else {
          this.$message.warning('Please complete the required fields first!')
        }
      })
    },
    // 转换product_json
    getValueOfLabel(num, sum) {
      let obj = {}
      let arr = []
      num.map(it => {
        obj = sum.find(item => item.id === it)
      })
      if (obj) {
        arr.push(obj.third_goods_name)
      } else {
        arr = num
      }
      return arr
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
