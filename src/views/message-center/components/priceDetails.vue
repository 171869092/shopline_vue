<template>
  <div class="price-details-box">
    <div class="box-card p20">
      <el-button class="mr30" size="small" icon="el-icon-back" @click="handleBack" />
      <span><span class="regular">Regular channel price change：</span>{{ priceDetails.msg_json.update_name }}</span>
    </div>
    <el-card class="m20 mt0">
      <el-form :model="priceDetails" label-width="140px" inline label-position="left">
        <div class="content-box">
          <el-form-item label="Trade name" prop="trade_name">
            <span class="w-400 big">{{ priceDetails.msg_json.update_name }}</span>
          </el-form-item>
          <el-form-item label="Trade name" prop="trade_name">
            <span class="w-400">{{ priceDetails.msg_json.update_name }}</span>
          </el-form-item>
          <el-form-item label="Original price" prop="original_price">
            <span class="w-400">{{ priceDetails.msg_json.old_price }}</span>
          </el-form-item>
          <el-form-item label="Change price" prop="change_price">
            <span class="w-400">{{ priceDetails.msg_json.new_price }}</span>
          </el-form-item>
          <el-form-item label="Service charge" prop="old_service_fee">
            <span class="w-400">{{ priceDetails.msg_json.old_service_fee }}</span>
          </el-form-item>
          <el-form-item label="Service charge" prop="new_service_fee">
            <span class="w-400">{{ priceDetails.msg_json.new_service_fee }}</span>
          </el-form-item>
        </div>
      </el-form>
      <div class="btn-box">
        <el-button type="primary" size="small" class="btn" @click="handleAgree">Agree</el-button>
        <el-button type="primary" size="small" class="btn" @click="handleRefuse">Refuse</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { agreeToChangeThePrice, refuseToChangeThePrice } from '@/api/notice'
export default {
  name: 'price-details',
  props: {
    pane: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      priceDetails: {
        id: '',
        is_del: '',
        is_read: '',
        server_id: '',
        type: '',
        u_id: '',
        msg_json: {
          update_name: '',
          old_price: '',
          new_price: '',
          new_service_fee: '',
          old_service_fee: ''
        }
      }
    }
  },
  created() {
    this.priceDetails = this.$route.query.list
    console.log('this.priceDetails', this.priceDetails)
  },
  methods: {
    handleRefuse() {
      const formData = {
        product_id: this.priceDetails.msg_json.product_id,
        store_url: this.priceDetails.msg_json.store_url
      }
      refuseToChangeThePrice(formData).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.handleBack()
        }
      })
    },
    handleAgree() {
      const formData = {
        server_id: this.priceDetails.server_id,
        s_id: this.priceDetails.msg_json.s_id,
        new_price: this.priceDetails.msg_json.new_price
      }
      agreeToChangeThePrice(formData).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.handleBack()
        }
      })
    },
    handleBack() {
      this.$router.push({ name: 'messages', query: { paneName: 'customer' }})
    }
  }
}
</script>

<style scoped lang="scss">
.price-details-box {
  .box-card {
    .regular {
      color: rgb(239, 111, 56);
    }
  }
  .content-box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding-left: 40px;
  }
  .btn-box {
    overflow: hidden;
    margin-top: 40px;
    .btn {
      float: right;
      margin: 0 10px;
    }
  }
}
</style>
