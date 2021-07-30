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
import { getToken } from '@/utils/auth'
import io from 'socket.io-client'

export default {
  name: 'app',
  data() {
    return {
      unreadCount: 9999,
      webSock: null,
      dragText: '',
      dragFlag: false,
      user_id: 147,
      socket: null,
    }
  },
  created() {
    this.user_id = getCookies('uid')
    if (this.user_id !== undefined && this.user_id) {
       console.log('uid有值')
       this.initWebSocket()
    }
  },
  methods: {
    openNotice() {},
    // 初始化weosocket
    initWebSocket() {
      // const url = 'ws://localhost:9592/notifation/?type=1&user_id=' + this.user_id + '&token=' + getToken()
      const url = process.env.VUE_APP_BASE_AFTER_SOCKET + '/notifation/?type=1&user_id=' + this.user_id + '&token=' + getToken()
      this.socket = io.connect(url, {
        timeout: 60000,
        reconnectionDelayMax: 1000,
        reconnectionDelay: 500,
        httpCompress: false,
        wsEngine: 'wss',
        origins: '*',
        transports: ['websocket'],
        allowRequest: true,
        allowUpgraders: true,
        forcenew:true
      })
      this.socket.on('connect', (e) => {
        this.message = '正在建立链接，请稍后...'
        console.log('建立链接', e)
        //. 2代表client, C端
        this.socket.emit('join-notifation', { value: this.user_id, root_type: 2 })
      })
      this.socket.on('join-notifation', (e) => {
        if (e.code === 200) {
          console.log('加入房间')
        }
      })
      //. 收到消息
      this.socket.on('send-msg', (e) => {
        console.log('加入房间')
        const data = JSON.parse(e.data)
        if (e.code === 200 && data) {
          this.dragText = data.msg_json
          this.dragFlag = true
        }
      })
      this.socket.on('connect_timeout', () => {
        console.log('连接超时')
      })
      this.socket.on('disconnect', () => {
        console.log('连接断开，尝试重新链接')
        this.message = '连接断开，尝试重新链接...'
        this.socket.emit('exit-notifation', { value: this.user_id, root_type : 2 })
      })
    },
    // websocketonmessage(e) { // 数据接收
    //   const redata = JSON.parse(e.data)
    //   if (redata.code !== -1) {
    //     if(redata != undefined && redata.data.msg_json){
    //       this.dragText = redata.data.msg_json
    //       this.dragFlag = true
    //     } 
    //   } else {
    //     console.log('我在关闭这里')
    //     this.dragFlag = false
    //     this.websocketclose()
    //   }
    },
    websocketonerror() { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketsend(Data) { // 数据发送
      this.webSock.send(Data)
      console.log(Data)
    },
    websocketclose(e) { // 关闭
      console.log('app 断开连接', e)
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
