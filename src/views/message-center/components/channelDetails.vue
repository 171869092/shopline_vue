<template>
  <div class="channel-details-box">
    <div class="box-card p20">
      <el-button class="mr30" size="small" icon="el-icon-back" @click="handleBack" />
      <span><span class="regular">Regular channel price change：</span>{{ channelDetails.name }}</span>
    </div>
    <el-card class="m20 mt0">
      <el-form :model="channelDetails" label-width="200px" inline label-position="left">
        <div class="content-box">
          <el-form-item label="Rule name" prop="rule_name">
            <span class="w-400 big">{{ channelDetails.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Rule name" prop="rule_name">
            <span class="w-400">{{ channelDetails.rule_name }}</span>
          </el-form-item>
          <el-form-item label="Original delivery channel" prop="original_delivery_channel">
            <span class="w-400">{{ channelDetails.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Original delivery channel" prop="original_delivery_channel">
            <span class="w-400">{{ channelDetails.original_delivery_channel }}</span>
          </el-form-item>
          <el-form-item label="Original channel price" prop="original_channel_price">
            <span class="w-400">{{ channelDetails.original_channel_price }}</span>
          </el-form-item>
          <el-form-item label="Original change price" prop="original_change_price">
            <span class="w-400">{{ channelDetails.original_change_price }}</span>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'channel-details',
  data() {
    return {
      channelDetails: {
        name: '',
        rule_name: '',
        original_delivery_channel: '',
        original_channel_price: '',
        original_change_price: ''
      }
    }
  },
  created() {
    this.channelDetails = this.$route.query.list
  },
  methods: {
    handleBack() {
      this.$router.push({ name: 'messages', query: { paneName: 'customer' }})
    }
  }
}
</script>

<style scoped lang="scss">
.channel-details-box {
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
