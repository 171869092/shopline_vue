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
          <el-form-item label="Rule name" prop="rule_name">
            <span class="w-400 big">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Rule name" prop="rule_name">
            <span class="w-400">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Original delivery channel" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Original delivery channel" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Original channel price" prop="original_channel_price">
            <span class="w-400">{{ detailFrom.original_channel_price }}</span>
          </el-form-item>
          <el-form-item label="Original change price" prop="original_change_price">
            <span class="w-400">{{ detailFrom.original_change_price }}</span>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <el-card v-if="type === 'Order'" class="m20 mt0">
      <el-form :model="detailFrom" label-width="200px" inline label-position="left">
        <div class="content-box">
          <el-form-item label="Rule name" prop="rule_name">
            <span class="w-400 big">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Rule name" prop="rule_name">
            <span class="w-400">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Original delivery channel" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Original delivery channel" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Original channel price" prop="original_channel_price">
            <span class="w-400">{{ detailFrom.original_channel_price }}</span>
          </el-form-item>
          <el-form-item label="Original change price" prop="original_change_price">
            <span class="w-400">{{ detailFrom.original_change_price }}</span>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <el-card v-if="type === 'AfterSale'" class="m20 mt0">
      <el-form :model="detailFrom" label-width="200px" inline label-position="left">
        <div class="content-box">
          <el-form-item label="Rule name" prop="rule_name">
            <span class="w-400 big">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Rule name" prop="rule_name">
            <span class="w-400">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Original delivery channel" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Original delivery channel" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Original channel price" prop="original_channel_price">
            <span class="w-400">{{ detailFrom.original_channel_price }}</span>
          </el-form-item>
          <el-form-item label="Original change price" prop="original_change_price">
            <span class="w-400">{{ detailFrom.original_change_price }}</span>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <el-card v-if="type === 'Quoted'" class="m20 mt0">
      <el-form :model="detailFrom" label-width="200px" inline label-position="left">
        <div class="content-box">
          <el-form-item label="Rule name" prop="rule_name">
            <span class="w-400 big">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Rule name" prop="rule_name">
            <span class="w-400">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Original delivery channel" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Original delivery channel" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Original channel price" prop="original_channel_price">
            <span class="w-400">{{ detailFrom.original_channel_price }}</span>
          </el-form-item>
          <el-form-item label="Original change price" prop="original_change_price">
            <span class="w-400">{{ detailFrom.original_change_price }}</span>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <el-card v-if="type === 'Bill'" class="m20 mt0">
      <el-form :model="detailFrom" label-width="200px" inline label-position="left">
        <div class="content-box">
          <el-form-item label="Rule name" prop="rule_name">
            <span class="w-400 big">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Rule name" prop="rule_name">
            <span class="w-400">{{ detailFrom.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Original delivery channel" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Original delivery channel" prop="original_delivery_channel">
            <span class="w-400">{{ detailFrom.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Original channel price" prop="original_channel_price">
            <span class="w-400">{{ detailFrom.original_channel_price }}</span>
          </el-form-item>
          <el-form-item label="Original change price" prop="original_change_price">
            <span class="w-400">{{ detailFrom.original_change_price }}</span>
          </el-form-item>
        </div>
      </el-form>
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
  .content-box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding-left: 40px;
  }
}
</style>
