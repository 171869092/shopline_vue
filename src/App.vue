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
        allowUpgraders: true
      })
      // console.log('sett', this.socket)
      this.socket.on('connect', (e) => {
        this.message = '正在建立链接，请稍后...'
        console.log('建立链接', e)
        //. 2代表client, C端
        this.socket.emit('join-notifation', { value: this.user_id, root_type: 2 })
      })
      this.socket.on('join-notifation', (e) => {
        if (e.code === 200) {
          console.log('成功加入房间')
        }
        // if (e.code === 200) {
        //   this.message = ''
        //   e.data.user_id = e.data.user_id.toString()
        //   if (this.user_id === e.data.user_id) {
        //     this.bInformation = e.data
        //   }
        // }
      })
      //. 收到消息
      this.socket.on('send-msg', (e) => {
        if (e.code === 200) {
          this.dragText = e.data
          this.dragFlag = true
        }
      })
      
      // this.socket.on('after-reply', (e) => {
      //   if (e.code === 200) {
      //     this.vendorAfterSaleInfo.reply.push(e.data)
      //     this.socket.emit('after-read', { after_id: this.after_id, type: this.socketType })
      //     this.isMessageRecord = false
      //     this.$nextTick(() => {
      //       this.isMessageRecord = true
      //     })
      //   }
      // })
      // this.socket.on('send-error', (e) => {
      //   if (e.code === 400) {
      //     this.socket.emit('join-after', { after_id: this.after_id })
      //   }
      // })
      this.socket.on('connect_timeout', () => {
        console.log('连接超时')
      })
      this.socket.on('disconnect', () => {
        console.log('连接断开，尝试重新链接')
        this.message = '连接断开，尝试重新链接...'
        this.socket.emit('exit-notifation', { value: this.user_id })
      })
    }
    // initWebSocket() {
    //   const wsuri = process.env.VUE_APP_BASE_NOTIFATION_SOCKET +'/wss/notifation'
    //   this.webSock = new WebSocket(wsuri)
    //   this.webSock.onmessage = this.websocketonmessage
    //   this.webSock.onopen = this.websocketonopen
    //   this.webSock.onerror = this.websocketonerror
    //   this.webSock.onclose = this.websocketclose
    // }
    ,
    websocketonmessage(e) { // 数据接收
      const redata = JSON.parse(e.data)
      if (redata.code !== -1) {
        if(redata != undefined && redata.data.msg_json){
          this.dragText = redata.data.msg_json
          this.dragFlag = true
        } 
      } else {
        console.log('我在关闭这里')
        this.dragFlag = false
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
