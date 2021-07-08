<template>
  <div v-loading="loading" class="after-create-box p30">
    <div class="top-box">
      <div class="order-header flexbox">
        <el-button
          size="small"
          class="button-border"
          icon="el-icon-back"
          @click="handleRouteBack"
        />
        <div class="order-id ml20">
          Order No：<span class="primary">{{ order_no }}</span>
        </div>
      </div>
      <div>
        <el-button size="small" type="primary" @click="complete">Completed</el-button>
      </div>
    </div>
    <div class="order-cell">
      <!-- After Sales Information -->
      <el-card class="box-card mt20">
        <div slot="header">
          <div class="detail-block-title">
            <div><h2>After Sales Information</h2></div>
          </div>
        </div>
        <div class="detail-block-title custul">
          <el-form>
            <el-row :gutter="77">
              <el-col :span="8">
                <el-form-item label="After Sales Type:" prop="after_type" class="custItem">
                  <span class="inx_text">{{ after_type }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="After Sales Mode:" prop="after_model">
                  <span class="inx_text">{{ after_model }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="After Sales Products:" prop="product_json">
                  <span v-for="(item, idx) in product_json" :key="idx" class="inx_text">{{ item }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <div class="mt20">
        <el-button size="small" type="primary" class="w-300" @click="isCustomer = false">Vendor(服务商名称)</el-button>
      </div>
      <!-- After Sales Message record -->
      <el-card class="box-card mt20">
        <div v-if="isMessageRecord" id="h_message_record" class="message_record">
          <div v-for="(item, idx) in afterSaleInfo.reply" :key="idx" class="message-box" :class="[item.reply_user === user_id ? 'right' : 'left']">
            <div class="title">
              <el-image
                v-if="item.reply_user !== user_id"
                class="avatar"
                :src="item.reply_user_image"
                :preview-src-list="[item.reply_user_image]"
              />
              <div class="title-text">
                <p class="title-user-name">{{ item.reply_user_name }}</p>
                <p class="title-time">{{ item.reply_time }}</p>
              </div>
              <el-image
                v-if="item.reply_user === user_id"
                class="avatar"
                :src="item.reply_user_image"
                :preview-src-list="[item.reply_user_image]"
              />
            </div>
            <div class="line" :class="[item.reply_user === user_id ? 'line-right' : 'line-left']">
              <el-divider />
            </div>
            <div class="contain">
              <div class="mb10" v-html="item.reply_info" />
              <div>
                <el-image
                  v-for="(it,i) in item.reply_img"
                  :key="i"
                  class="image"
                  :src="it"
                  :preview-src-list="[it]"
                />
              </div>
            </div>
            <div class="line" :class="[item.reply_user === user_id ? 'line-right' : 'line-left']">
              <el-divider />
            </div>
          </div>
        </div>
      </el-card>
      <!-- After Sales Reply -->
      <el-card class="chat_box mt20">
        <tinymce ref="tinymces" v-model="afterChat.reply_info" menubar :height="250" @reply="handleReply" />
        <div class="upload-box">
          <el-upload
            ref="upload"
            accept="image/png, image/jpeg"
            class="upload-photos"
            action
            :show-file-list="false"
            :http-request="Upload"
            :before-upload="handleBeforeUpload"
            :on-change="handleChange"
          >
            <div class="el-upload__text">
              <i class="el-icon-picture" />
            </div>
          </el-upload>
        </div>
        <div class="tick-box">{{ message }}</div>
        <div class="image-box">
          <el-image
            v-for="(fit, key) in afterChat.reply_img"
            :key="key"
            class="image"
            :src="fit"
            :preview-src-list="[fit]"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { afterSalesType } from '@/api/after'
import { getCookies } from '@/utils/cookies'
import { uploadImage } from '@/api/product'
import { getToken } from '@/utils/auth'
export default {
  name: 'after-create',
  components: {
    Tinymce: () => import('../components/tinymce')
  },
  data() {
    return {
      loading: false,
      dataType: [],
      saleMode: ['Resend', 'Refund', 'Return/Refund', 'Other'],
      SubmitLoading: false,
      isMessageRecord: true,
      user_id: '',
      afterSaleInfo: {
        customer_name: '',
        order_no: '',
        after_type: '',
        product_json: '',
        shipping_json: {
          logistics_status: ''
        },
        after_create_time: '',
        sku_name: '',
        id: '',
        third_order_no: '',
        reply: []
      },
      afterChat: {
        after_id: '',
        reply_info: '',
        reply_img: []
      },
      socket: null,
      socketType: 1,
      message: '',
      bInformation: {},
      HSocket: false,
      msg: ''
    }
  },
  computed: {
    order_no() {
      return this.$route.query.order_no
    },
    order_id() {
      return this.$route.query.order_id
    },
    after_type() {
      return this.$route.query.after_type
    },
    after_model() {
      return this.$route.query.after_model
    },
    product_json() {
      return this.$route.query.product_json
    },
    after_id() {
      return this.$route.query.after_id
    }
  },
  updated() {
    this.$nextTick(() => {
      const scr = document.getElementById('h_message_record')
      if (scr !== null) {
        scr.scrollTop = scr.scrollHeight
      }
    })
  },
  mounted() {
    this.getAfterSalesType()
    this.user_id = getCookies('uid')
    this.initWebSocket()
    this.socket.emit('after-read', { after_id: this.after_id, type: this.socketType })
  },
  methods: {
    // 获取售后类型
    getAfterSalesType() {
      afterSalesType().then(res => {
        if (res.code === 200) {
          this.dataType = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // complete
    complete() {
    },
    handleReply() {
      this.isMessageRecord = false
      const date = new Date()
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const d = date.getDate()
      const H = date.getHours()
      const M = date.getMinutes()
      const S = date.getSeconds()
      const FormatDate = y + '/' + m + '/' + d + ' ' + H + ':' + M + ':' + S
      const obj = {
        type: this.bInformation.type,
        after_id: this.after_id,
        reply_user: this.bInformation.user_id.toString(),
        reply_user_image: this.bInformation.icon,
        reply_user_name: this.bInformation.username,
        time: FormatDate,
        reply_info: this.afterChat.reply_info,
        reply_img: this.afterChat.reply_img
      }
      this.$set(this.afterChat, 'after_id', this.after_id)
      this.$set(this.afterChat, 'type', this.socketType)
      this.socket.emit('after-reply', this.afterChat)
      this.socket.on('send-error', (e) => {
        if (e.code === 400) {
          console.log('消息发送失败', e.msg)
          this.msg = e.msg
          this.HSocket = true
          this.socket.emit('join-after', { after_id: this.after_id })
        }
      })
      if (this.HSocket === true) {
        this.$message.warning(this.msg)
      } else {
        this.isMessageRecord = false
        this.afterSaleInfo.reply.push(obj)
        this.$nextTick(() => {
          this.isMessageRecord = true
        })
        this.afterChat = this.$options.data().afterChat
        this.reply_img = []
      }
    },
    Upload(fileObj) {
      const file = { showProgress: true, url: '', percent: 0 }
      const formData = new FormData()
      formData.append('file', fileObj.file)
      uploadImage(formData, (progress) => {
        file.percent = Math.round((progress.loaded / progress.total) * 100)
      }).then(res => {
        if (res.code === 200) {
          const data = JSON.parse(JSON.stringify(res.data))
          file.url = data['data-service-file']
          file.showProgress = false
          this.afterSaleInfo.template_image.push(data['data-service-file'])
          this.showImg = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleBeforeUpload(file, fileList) {
      // console.log('change', file)
    },
    handleChange(file) {
      const isSize = new Promise((resolve, reject) => {
        const isLt2M = file.size / 1024 / 1024 < 2
        isLt2M ? resolve() : reject(new Error('Error'))
      }).then(
        () => {
          return file
        },
        () => {
          this.$message.error('The uploaded image size exceeds 2M！')
          return Promise.reject(new Error('Error'))
        }
      )
      return isSize
    },
    initWebSocket() {
      const url = 'wss://m.fbali.co/?type=1&user_id=' + this.user_id + '&token=' + getToken()
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
      this.socket.on('connect', (e) => {
        this.message = '正在建立链接，请稍后...'
        console.log('建立链接', e)
        this.socket.emit('join-after', { after_id: this.after_id })
      })
      this.socket.on('join-after', (e) => {
        if (e.code === 200) {
          this.message = ''
          e.data.user_id = e.data.user_id.toString()
          if (this.user_id === e.data.user_id) {
            this.bInformation = e.data
          }
        }
      })
      this.socket.on('after-reply', (e) => {
        if (e.code === 200) {
          console.log('e---', e)
          this.afterSaleInfo.reply.push(e.data)
          this.isMessageRecord = false
          this.$nextTick(() => {
            this.isMessageRecord = true
          })
        }
      })
      this.socket.on('send-error', (e) => {
        if (e.code === 400) {
          this.socket.emit('join-after', { after_id: this.after_id })
        }
      })
      this.socket.on('connect_timeout', () => {
        console.log('连接超时')
      })
      this.socket.on('disconnect', () => {
        console.log('连接断开，尝试重新链接')
        this.message = '连接断开，尝试重新链接...'
        this.socket.emit('join-after', { after_id: this.after_id })
      })
    },
    handleRouteBack() {
      this.socket.emit('leave-after', { after_id: this.after_id })
      this.$router.push({ name: 'after' })
    }
  }
}
</script>
<style scoped lang="scss">
.after-create-box {
  .top-box {
    display: flex;
    justify-content: space-between;
  }
  .custul li{
    float: left;
    padding-right: 300px;
    list-style:none;
  }
  .detail-block-title {
    h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }
  }
  .message_record {
    height: 45vh;
    overflow-y: auto;
    .message-box {
      padding: 20px 30px 0;
      .title {
        display: flex;
        .avatar {
          margin-top: 15px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .title-text {
          margin: 0 20px;
          .title-user-name {
            font-weight: 500;
          }
          .title-time {
            font-size: 14px;
          }
        }
      }
      .line {
        width: 95%;
        ::v-deep.el-divider--horizontal {
          margin: 0!important;
        }
      }
      .line-right {
        margin-right: 60px;
      }
      .line-left {
        margin-left: 60px;
      }
      .contain {
        padding: 20px 70px;
        .image {
          width: 80px;
          height: 80px;
          margin-right: 20px;
        }
        .info-image {
          width: 30px;
          height: 30px;
        }
      }
    }
    .right {
      text-align: right;
      .title {
        justify-content: flex-end;
        .title-user-name {
          color: #f6c31f;
        }
      }
    }
    .left {
      text-align: left;
      .title-user-name {
        color: #f6902c;
      }
    }
  }
  .chat_box {
    position: relative;
    ::v-deep.el-card__body {
      padding: 0!important;
      height: 250px;
    }
    .upload-box {
      z-index: 99999;
      width: 20px;
      height: 20px;
      position: absolute;
      top: 6px;
      left: 267px;
      background-color: #fff;
      .upload-photos {
        font-size: 18px;
        position: absolute;
        top: 0;
        left: 0;
        color: #585858;
      }
    }
    .image-box {
      width: 100%;
      height: 60px;
      position: absolute;
      bottom: 0;
      right: 0;
      text-align: right;
      .image {
        width: 50px;
        height: 50px;
        margin: 0 10px;
      }
    }
  }
}
</style>
