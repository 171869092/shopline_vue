<template>
  <div class="system-box">
    <div v-for="(item, index) in systemList" :key="index" class="list-box" @click="handleClick(item)">
      <h4 class="title-style">{{ item.name }}<img :src="NewIcon" class="imgIcon" v-if="item.status === '1'" /></h4>
      <p>{{ item.content }}</p>
      <el-divider/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'system',
  data() {
    return {
      systemList: [
        {
          name: 'Administrators',
          content: 'hello,we will launch new functions on january 1, 2020. Please pay attention to our official website',
          status: '0'
        },
        {
          name: 'Administrators',
          content: 'hello,we will launch new functions on january 1, 2020. Please pay attention to our official website',
          status: '1'
        },
        {
          name: 'Administrators',
          content: 'hello,we will launch new functions on january 1, 2020. Please pay attention to our official website',
          status: '0'
        }
      ],
      NewIcon: require('@/assets/home/new.png') // 我的消息new图标
    }
  },
  methods: {
    handleClick(val) {
      this.$router.push({ name: 'notification', query: { list: val }})
    }
  }
}
</script>

<style scoped lang="scss">
.system-box {
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
