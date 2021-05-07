<template>
  <div v-loading="loading" class="order-detail p30">
    <el-row :gutter="20">
      <el-col :span="20" :offset="2">
        <div class="top-box">
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
          </div>
          <el-button size="small" type="primary" :loading="SubmitLoading" @click="submit">Submit</el-button>
        </div>
        <div class="order-cell">
          <el-form ref="formData" :model="formData" :rules="formRule" label-width="140px" label-position="top">
            <!-- After Sales Information -->
            <el-card class="box-card mt20">
              <div slot="header">
                <div class="detail-block-title">
                  <div><h2>After Sales Information</h2></div>
                </div>
              </div>
              <div class="detail-block-title custul">
                <el-col :span="8">
                  <el-form-item label="After Sales Type:" prop="after_type" class="custItem">
                    <el-select v-model="formData.after_type" class="w-180 custSel" prop="after_type">
                      <el-option v-for="(item,idx) in dataType" :key="idx" :label="item" :value="idx" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="After Sales Mode:" prop="after_model">
                    <el-select v-model="formData.after_model" class="w-180 custSel">
                      <el-option v-for="(item,idx) in saleMode" :key="idx" :label="item" :value="String(idx + 1)" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="After Sales Products:" prop="product_json">
                    <el-select v-model="formData.product_json" multiple class="w-180 custSel">
                      <el-option v-for="item in productArr" :key="item.id" :label="item.third_goods_name" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </div>
            </el-card>
            <!-- Text Content -->
            <el-card class="box-card mt20">
              <div slot="header">
                <div class="detail-block-title">
                  <div><h2>Text Content</h2></div>
                </div>
              </div>
              <el-input v-model="formData.content" :rows="8" style="margin: 20px 0;" type="textarea" placeholder="请输入内容" />
            </el-card>
            <!-- Picture Content -->
            <el-card class="box-card mt20">
              <div slot="header">
                <div class="detail-block-title">
                  <div><h2>Picture Content</h2></div>
                </div>
              </div>
              <div slot="header" class="flexbox justidfy-space-between align-center">
                <!-- <div><span style="color:red">*</span><span style="font-weight: 600;">Media:</span></div> -->
                <!-- <div>
                                   <el-button size="mini" type="primary" @click="openUploadPrint">Add image</el-button>
                               </div> -->
              </div>
              <!-- <print-popover ref="window_img" :list="formData.images" @delImg="delImg" @update="updateimg" /> -->
              <shop-window ref="shopWindow" :img-list="formData.images" @update="updateImgList" @delete="deleteImg" />
            </el-card>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { afterSalesType, afterSalesCreate } from '@/api/after'
export default {
  name: 'after-create',
  components: {
    ShopWindow: () => import('./shop-window')
  },
  data() {
    return {
      formData: {
        third_order_no: '',
        order_name: '',
        store_url: '',
        total: '',
        cost: '',
        product_json: '',
        shipping_json: '',
        receive_json: '',
        state: '',
        vendor: '',
        payment: '',
        after_type: null,
        after_model: null,
        image: [],
        order_create: '',
        server_id: '',
        content: '',
        customer_name: '',
        order_no: '',
        images: [],
        import_people: ''
      },
      loading: false,
      detailInfo: [],
      dataType: [],
      saleMode: ['Return/exchange', 'Return and refund', 'Refund only'],
      productArr: [],
      imgList: [],
      orderInfo: [],
      SubmitLoading: false,
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
    order_no() {
      return this.$route.query.order_no
    },
    order_id() {
      return this.$route.query.order_id
    },
    isShowProductIndex() {
      return this.detailInfo.length > 1
    }
  },

  created() {
    this.detailInfo = this.$route.query.detailInfo
    this.detailInfo.goods_info.forEach((item, index) => {
      this.productArr.push(item)
    })
    this.orderInfo = this.detailInfo
    console.log('orderInfo: ', this.orderInfo)
    // console.log('detailInfo: ',this.detailInfo)
    // console.log('productArr:', this.productArr)
    this.getAfterSalesType()
  },
  methods: {
    // . 获取售后类型
    getAfterSalesType() {
      afterSalesType().then(res => {
        if (res.code === 200) {
          this.dataType = res.data
          // console.log('dataType:' , res.data)
        }
      }).catch(error => {
        console.log(error)
      })
    },

    deleteImg() {

    },

    openUploadPrint() {

    },
    delImg() {

    },

    updateimg() {

    },

    updateImgList(list) {
      this.imgList = list
      this.formData.images = this.imgList
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

    // .save
    submit() {
      this.formData.vendor = this.orderInfo.vendor.service_name
      this.formData.order_no = this.orderInfo.order_no
      this.formData.total = this.orderInfo.total_price
      this.formData.store_url = this.orderInfo.store_url
      // this.cost = this.orderInfo
      this.formData.third_order_no = this.orderInfo.thirdParty_order_on
      this.formData.order_name = this.orderInfo.order_name
      this.formData.import_people = this.orderInfo.import_people
      this.formData.receive_json = {
        address: this.orderInfo.address1,
        city: this.orderInfo.city,
        country: this.orderInfo.country,
        consignee: this.orderInfo.consignee,
        first_name: this.orderInfo.first_name,
        last_name: this.orderInfo.last_name,
        mobile: this.orderInfo.mobile,
        email: this.orderInfo.email
      }
      this.formData.shipping_json = {
        logistics_company: this.orderInfo.logistics_company,
        logistics_no: this.orderInfo.logistics_no,
        logistics_status: this.orderInfo.logistics_status
      }

      // let getName = this.getCookie('name')

      this.formData.server_id = this.orderInfo.service_id
      this.formData.customer_name = this.getCookie('name')
      console.log('formData', this.formData)
      const products = []
      this.formData.product_json.map(item => {
        this.productArr.forEach(it => {
          if (it.id === item) {
            products.push({
              logistics_cost: it.logistics_cost,
              cost: it.purchase_price,
              sku_num: it.sku_num,
              sku_name: it.third_goods_name,
              sku_image: it.sku_image,
              sale_money: it.sale_money,
              sku_id: it.shopify_sku_id
            })
          }
        })
      })
      this.formData.product_json = products
      const imgs = []
      this.formData.image = this.formData.images.map(item => {
        imgs.push(item.url)
        // return {url: item.url}
      })
      this.formData.image = imgs
      // console.log(this.formData)
      // return false
      this.$refs.formData.validate((validate) => {
        if (validate) {
          this.SubmitLoading = true
          afterSalesCreate(this.formData).then(res => {
            this.$message({ message: res.message, type: 'success' })
            this.$router.push({ name: 'after' })
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.SubmitLoading = false
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.top-box {
  display: flex;
  justify-content: space-between;
}
    .custul li{
        float: left;
        padding-right: 300px;
        list-style:none;
    }
</style>
