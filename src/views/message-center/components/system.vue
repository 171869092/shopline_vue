<template>
  <div class="system-box">
    <div v-for="(item, index) in systemList" :key="index" class="list-box" @click="handleClick(item)">
      <div class="flexbox">
        <h4 class="title-style">{{ item.name }}<img v-if="item.status === '1'" :src="NewIcon" class="imgIcon" /></h4>
        <span>{{ item.time }}</span>
      </div>
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
          status: '0',
          time: '2021-05-13 10:34:46'
        },
        {
          name: 'Administrators',
          content: 'hello,we will launch new functions on january 1, 2020. Please pay attention to our official website',
          status: '1',
          time: '2021-05-13 10:34:46'
        },
        {
          name: 'Administrators',
          content: 'hello,we will launch new functions on january 1, 2020. Please pay attention to our official website',
          status: '0',
          time: '2021-05-13 10:34:46'
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
    .flexbox {
      display: flex;
      justify-content: space-between;
    }
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
