<template>
  <div class="message-details-box">
    <div class="box-card p20">
      <el-button class="mr30" size="small" icon="el-icon-back" @click="handleBack" />
      <span v-if="type === 'Product'"><span class="regular">Regular channel price change：</span>{{ detailFrom.name }}</span>
      <span v-if="type === 'Order'"><span class="regular">Order</span></span>
      <span v-if="type === 'AfterSale'"><span class="regular">After Sale</span></span>
      <span v-if="type === 'Quoted'"><span class="regular">Product Quoted：</span>{{ detailFrom.name }}</span>
      <span v-if="type === 'Bill'"><span class="regular">Bill：</span>{{ detailFrom.name }}</span>
    </div>
    <el-card v-if="type === 'Product'" class="m20 mt0">
      <el-form :model="detailFrom" label-width="200px" inline label-position="left">
        <div class="content-box">
          <el-form-item label="Product name" prop="rule_name">
            <span class="w-400">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Product name" prop="rule_name">
            <span class="w-400">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Original price" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Change price" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Service" prop="original_channel_price">
            <span class="w-400">{{ detailFrom.original_channel_price }}</span>
          </el-form-item>
          <el-form-item label="Service change" prop="original_change_price">
            <span class="w-400">{{ detailFrom.original_change_price }}</span>
          </el-form-item>
        </div>
        <div class="btn-box">
          <el-button type="primary" style="background-color:#ce3131;">Refuse</el-button>
          <el-button type="primary" style="background-color:#f68a1d;">Agree</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card v-if="type === 'Quoted'" class="m20 mt0">
      <div class="content-box">
        <el-form :model="detailFrom" label-width="200px" label-position="left">
          <el-form-item label="Quotation complete" prop="rule_name">
            <span class="w-400">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Vendor name:" prop="rule_name">
            <span class="w-400">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Product name:" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="text">Click on me for details</el-button>
        </div>
      </div>
    </el-card>
    <el-card v-if="type === 'AfterSale'" class="m20 mt0">
      <p class="detail-title">Customer applies for after-sales service</p>
      <div class="content-box">
        <el-form :model="detailFrom" label-width="200px" label-position="left">
          <el-form-item label="Customer:" prop="rule_name">
            <span class="w-400">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Order Number:" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Store Name:" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="After sales type:" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="After sales mode:" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="After sales products:" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="text">Click on me for details</el-button>
        </div>
      </div>
    </el-card>
    <el-card v-if="type === 'Order'" class="m20 mt0">
      <p class="detail-title">Apply for refund, Please handle these problems as soon as possible</p>
      <div class="content-box">
        <el-form :model="detailFrom" label-width="200px" label-position="left">
          <el-form-item label="Store Name:" prop="rule_name">
            <span class="w-400">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Order Number:" prop="rule_name">
            <span class="w-400">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Customer:" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Refund products:" prop="original_delivery_channel">
            <div>
              <el-image src="" style="width: 50px; height: 50px"/>
              <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
            </div>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="text">Click on me for details</el-button>
        </div>
      </div>
    </el-card>
    <el-card v-if="type === 'Bill'" class="m20 mt0">
      <p class="detail-title">Here is your bill, Please check</p>
      <div class="content-box">
        <el-form :model="detailFrom" label-width="200px" label-position="left">
          <el-form-item label="Bill name:" prop="rule_name">
            <span class="w-400">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Bill number:" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Order quantity:" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="text">Click on me for details</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      detailFrom: {}
    }
  },
  computed: {
    type() {
      return this.$route.query.type
    }
  },
  methods: {
    handleBack() {
      this.$router.push({ name: 'messages', query: { paneName: 'vendor' }})
    }
  }
}
</script>

<style scoped lang="scss">
.message-details-box {
  .box-card {
    .regular {
      color: rgb(239, 111, 56);
    }
  }
  .detail-title {
    padding-left: 40px;
    margin-bottom: 20px;
    color: #606266;
    font-weight: 500;
  }
  .content-box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding-left: 40px;
  }
  .btn-box {
    text-align: right;
  }
}
</style>
