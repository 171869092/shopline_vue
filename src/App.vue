<template>
  <div id="app">
    <router-view />
    <div v-if="unreadCount" id="dragBtn" v-drag class="un_read_icon" @click="openNotice">
      <div v-if="dragFlag" class="dragText">
        <span v-html="dragText" />
        <i class="el-icon-close dragClose" @click="handleClickDragClose"/>
      </div>
      <i class="el-icon-message-solid dragIcon" />
    </div>
  </div>
</template>

<script>
import { getCookies } from '@/utils/cookies'

export default {
  name: 'app',
  data() {
    return {
      unreadCount: 9999,
      webSock: null,
      dragText: '',
      dragFlag: false
    }
  },
  created() {
    this.initWebSocket()
  },
  methods: {
    openNotice() {},
    // 初始化weosocket
    initWebSocket() {
      const wsuri = 'wss://ts.fbali.co/wss/notifation'
      this.webSock = new WebSocket(wsuri)
      this.webSock.onmessage = this.websocketonmessage
      this.webSock.onopen = this.websocketonopen
      this.webSock.onerror = this.websocketonerror
      this.webSock.onclose = this.websocketclose
    },
    websocketonmessage(e) { // 数据接收
      const redata = JSON.parse(e.data)
      console.log('e.code', redata.code)
      if (redata.code !== -1) {
        this.dragText = redata.data
        this.dragFlag = true
      } else {
        this.websocketclose()
      }
    },
    websocketonopen() { // 连接建立之后执行send方法发送数据
      const uid = getCookies('uid')
      const actions = { uid: uid }
      this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror() { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketsend(Data) { // 数据发送
      this.webSock.send(Data)
      console.log(Data)
    },
    websocketclose(e) { // 关闭
      console.log('断开连接', e)
    },
    handleClickDragClose() {
      this.dragFlag = false
    }
  }
}
</script>

<style scoped lang="scss">
.un_read_icon {
  position: absolute;
  width: 350px;
  height: 46px;
  right: 35px;
  bottom: 10%;
  display: flex;
  justify-content: flex-end;
  z-index: 9999;
  .dragText {
    width: 300px;
    height: 46px;
    border: 1px solid #a1a1a1;
    position: relative;
    .dragClose {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 18px;
      color: #a1a1a1;
    }
  }
  .dragIcon {
    font-size: 38px;
    color: #a1a1a1;
    margin-left: 10px;
  }
}
</style>
