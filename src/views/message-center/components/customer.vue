<template>
  <div class="customer-box">
    <div v-for="(item, index) in systemList" :key="index" class="list-box" @click="handleClick(item)">
      <div class="flexbox">
        <h4 class="title-style">{{ item.msg_json.update_name }}<img v-if="item.is_read === '2'" :src="NewIcon" class="imgIcon" /></h4>
        <span>{{ item.create_time }}</span>
      </div>
      <p>{{ item.content }}</p>
      <el-divider/>
    </div>
  </div>
</template>

<script>
import { getMessageList, transferUnreadMessage } from '@/api/notice'
export default {
  name: 'customer',
  data() {
    return {
      systemList: [],
      NewIcon: require('@/assets/home/new.png') // 我的消息new图标
    }
  },
  created() {
    this.init()
  },
  methods: {
    handleClick(val) {
      const ids = []
      ids.push(val.id)
      transferUnreadMessage({ id: ids }).then(res => {
        if (res.code === 200) {
          // console.log(res.data)
        }
      })
      if (val.type === '1') {
        this.$router.push({ name: 'channelDetails', query: { list: val }})
      } else {
        this.$router.push({ name: 'priceDetails', query: { list: val }})
      }
    },
    // 消息列表
    init() {
      getMessageList({ type: ['2'] }).then(res => {
        if (res.code === 200) {
          this.systemList = res.data
          this.systemList.map(item => {
            if (item.type === '2') {
              item.content = 'Changes in commodity prices'
            } else {
              item.content = 'Regular channel price change'
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.customer-box {
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
