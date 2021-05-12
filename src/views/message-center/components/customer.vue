<template>
  <div class="customer-box">
    <div v-for="(item, index) in systemList" :key="index" class="list-box" @click="handleClick(item)">
      <h4 class="title-style">{{ item.name }}<img :src="NewIcon" class="imgIcon" v-if="item.status === '1'" /></h4>
      <p>{{ item.content }}</p>
      <el-divider/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'customer',
  data() {
    return {
      systemList: [
        {
          name: 'masy',
          content: 'Changes in commodity prices',
          status: '1',
          content_status: '1'
        },
        {
          name: 'masymasy',
          content: 'Regular channel price change',
          status: '0',
          content_status: '2'
        },
        {
          name: 'masy',
          content: 'Changes in commodity prices',
          status: '0',
          content_status: '1'
        }
      ],
      NewIcon: require('@/assets/home/new.png') // 我的消息new图标
    }
  },
  methods: {
    handleClick(val) {
      if (val.content_status === '1') {
        this.$router.push({ name: 'channelDetails', query: { list: val }})
      } else {
        this.$router.push({ name: 'priceDetails', query: { list: val }})
      }
    }
  }
}
</script>

<style scoped lang="scss">
.customer-box {
  padding: 5px 30px;
  .list-box {
    cursor: pointer;
    .title-style {
      .imgIcon {
        width: 30px;
        height: 28px;
        margin-left: 10px;
        margin-top: -15px;
      }
    }
  }
}
</style>
