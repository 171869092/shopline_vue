<template>
  <div class="price-details-box">
    <div class="box-card p20">
      <el-button class="mr30" size="small" icon="el-icon-back" @click="handleBack" />
      <span><span class="regular">Regular channel price change：</span>{{ priceDetails.name }}</span>
    </div>
    <el-card class="m20 mt0">
      <el-form :model="priceDetails" label-width="140px" inline label-position="left">
        <div class="content-box">
          <el-form-item label="Trade name" prop="trade_name">
            <span class="w-400 big">{{ priceDetails.trade_name }}</span>
          </el-form-item>
          <el-form-item label="Trade name" prop="trade_name">
            <span class="w-400">{{ priceDetails.trade_name }}</span>
          </el-form-item>
          <el-form-item label="Original price" prop="original_price">
            <span class="w-400">{{ priceDetails.original_price }}</span>
          </el-form-item>
          <el-form-item label="Change price" prop="change_price">
            <span class="w-400">{{ priceDetails.change_price }}</span>
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
        name: '',
        trade_name: '',
        original_price: '',
        change_price: ''
      }
    }
  },
  created() {
    this.priceDetails = this.$route.query.list
  },
  methods: {
    handleRefuse() {
    },
    handleAgree() {
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
