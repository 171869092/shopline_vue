<template>
  <div v-loading="loading" class="after-detail-box p30">
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
        <el-button v-if="type === 2 && is_push !== 3" size="small" type="primary" @click="confirmAfterSales">Forward</el-button>
<!--        <el-button size="small" type="primary" @click="confirmAfterSales">Forward</el-button>-->
        <el-button v-if="client_status !== 3 || status !== 3" size="small" type="primary" @click="complete">Completed</el-button>
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
            <el-col :span="8">
              <el-form-item label="After Sales Type:">
                <span class="inx_text">{{ tableData.after_type }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="After Sales Mode:">
                <span class="inx_text">{{ tableData.after_model }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="After Sales Products:">
                <span v-for="(item,ids) in tableData.product_json" :key="ids" class="inx_text">{{ item.sku_name }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </el-card>
      <div class="mt20">
        <el-button v-if="client_reply.length > 0" size="small" :type="isCustomer ? 'primary' : ''" class="w-300" @click="handleCustomer">Customer ({{ client_name }})</el-button>
        <el-button v-if="is_push === 3" size="small" :type="isCustomer ? '' : 'primary'" class="w-300" style="margin-left: 0" @click="handleVendor">Vendor ({{ server_name }})</el-button>
      </div>
      <div v-show="isCustomer" class="mt20 HMain">
        <!-- After Sales Message record -->
        <el-card class="box-card mt20">
          <div v-if="isCustomerMessageRecord" id="hc_message_record" class="message_record">
            <div v-for="(item, idx) in customerAfterSaleInfo.reply" :key="idx" class="message-box" :class="[item.reply_user === user_id ? 'right' : 'left']">
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
              <div class="contain">
                <div v-if="item.reply_info" class="mb10">
                  <span :class="[item.reply_user === user_id ? 'reply-right' : 'reply-left']">
                    <p v-html="item.reply_info" />
                  </span>
                </div>
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
            </div>
          </div>
        </el-card>
        <!-- After Sales Reply -->
        <el-card v-if="client_status !== 3" class="chat_box mt20">
          <tinymce ref="tinymces" v-model="customerAfterChat.reply_info" menubar :height="250" @reply="handleCustomerReply" />
          <div class="upload-box">
            <el-upload
              ref="upload"
              accept="image/png, image/jpeg"
              class="upload-photos"
              action
              :show-file-list="false"
              :http-request="customerUpload"
              :before-upload="handleCustomerBeforeUpload"
              :on-change="handleCustomerChange">
              <div class="el-upload__text">
                <i class="el-icon-picture"/>
              </div>
            </el-upload>
          </div>
          <div class="tick-box">{{ message }}</div>
          <div class="image-box">
            <el-image
              v-for="(fit, key) in customerAfterChat.reply_img"
              :key="key"
              class="image"
              :src="fit"
              :preview-src-list="[fit]"
            />
          </div>
        </el-card>
      </div>
      <div v-show="is_push === 3 && !isCustomer" class="mt20 HMain">
        <!-- After Sales Message record -->
        <el-card class="box-card mt20">
          <div v-if="isVendorMessageRecord" id="hv_message_record" class="message_record">
            <div v-for="(item, idx) in vendorAfterSaleInfo.reply" :key="idx" class="message-box" :class="[item.reply_user === user_id ? 'right' : 'left']">
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
              <div class="contain">
                <div v-if="item.reply_info" class="mb10">
                  <span :class="[item.reply_user === user_id ? 'reply-right' : 'reply-left']">
                    <p v-html="item.reply_info"/>
                  </span>
                </div>
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
            </div>
            <div v-if="status === 3" class="service-tips"><i class="el-icon-warning-outline" /> The service provider applies to complete the current after-sales service</div>
          </div>
        </el-card>
        <!-- After Sales Reply -->
        <el-card v-if="status !== 3" class="chat_box mt20">
          <tinymce ref="tinymces" v-model="vendorAfterChat.reply_info" menubar :height="250" @reply="handleVendorReply" />
          <div class="upload-box">
            <el-upload
              ref="upload"
              accept="image/png, image/jpeg"
              class="upload-photos"
              action
              :show-file-list="false"
              :http-request="vendorUpload"
              :before-upload="handleVendorBeforeUpload"
              :on-change="handleVendorChange">
              <div class="el-upload__text">
                <i class="el-icon-picture"/>
              </div>
            </el-upload>
          </div>
          <div class="tick-box">{{ message }}</div>
          <div class="image-box">
            <el-image
              v-for="(fit, key) in vendorAfterChat.reply_img"
              :key="key"
              class="image"
              :src="fit"
              :preview-src-list="[fit]"
            />
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog
      title="Tips"
      :visible.sync="dialogVisible"
      width="30%">
      <p style="text-align: center">Are you sure to complete the current after sales information ?</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="background-color:#2c7fdd;border: 0 none;" @click="handleComplete(3)">Vendor</el-button>
        <el-button type="primary" style="background-color:#f6be02;border: 0 none;" @click="handleComplete(4)">Customer</el-button>
        <el-button type="primary" style="background-color:#f68a1d;border: 0 none;" @click="handleComplete(5)">All</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="After sales"
      :visible.sync="forwardVisible"
      width="30%"
    >
      <el-form ref="afterDialog" label-position="right" label-width="100px" :model="afterDialog" :rules="formRule">
        <el-form-item label="Type" prop="after_type">
          <el-select v-model="afterDialog.after_type" style="width: 95%">
            <el-option v-for="(item,idx) in typeList" :key="idx" :label="item" :value="idx" />
          </el-select>
        </el-form-item>
        <el-form-item label="Mode" prop="after_model">
          <el-select v-model="afterDialog.after_model" style="width: 95%">
            <el-option v-for="(item,idx) in modeList" :key="idx" :label="item" :value="String(idx + 1)" />
          </el-select>
        </el-form-item>
        <el-form-item label="Products" prop="product_json">
          <el-select v-model="afterDialog.product_json" multiple style="width: 95%">
            <el-option v-for="item in productsList" :key="item.id" :label="item.sku_name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="forwardVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAfterSales">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import io from 'socket.io-client'
import { getToken } from '@/utils/auth'
import { afterSalesChanngedStatus, afterSalesDetail, afterSalesConfirmSend, afterSalesType } from '@/api/after'
import { getCookies } from '@/utils/cookies'
import { uploadImage } from '@/api/product'
export default {
  name: 'after-detail',
  components: {
    Tinymce: () => import('../components/tinymce')
  },
  data() {
    return {
      user_id: '',
      after_id: '',
      isCustomerMessageRecord: true,
      isVendorMessageRecord: true,
      loading: false,
      tableData: {
        id: '',
        after_model: '',
        after_type: '',
        product_json: []
      },
      type: 1,
      isCustomer: true,
      dialogVisible: false,
      customerAfterSaleInfo: {
        reply: []
      },
      vendorAfterSaleInfo: {
        reply: []
      },
      customerAfterChat: {
        after_id: '',
        reply_info: '',
        reply_img: []
      },
      vendorAfterChat: {
        after_id: '',
        reply_info: '',
        reply_img: []
      },
      socket: null,
      socketType: 4,
      message: '',
      bInformation: {},
      HSocket: false,
      msg: '',
      is_push: 1,
      client_status: 1,
      status: 1,
      client_reply: [],
      client_name: 'Customer',
      server_name: 'Vendor',
      forwardVisible: false,
      afterDialog: {
        after_type: '',
        after_model: '',
        product_json: ''
      },
      typeList: [],
      modeList: ['Resend', 'Refund', 'Return/Refund', 'Other'],
      productsList: [],
      formRule: {
        after_type: [
          { required: true, message: 'Please enter a after type', trigger: 'blur' }
        ],
        after_model: [
          { required: true, message: 'Please enter a after mode', trigger: 'blur' }
        ],
        product_json: [
          { required: true, message: 'Please enter a Products', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    order_no() {
      return this.$route.query.order_no
    },
    order_id() {
      return this.$route.query.order_id
    }
  },
  updated() {
    this.$nextTick(() => {
      if (this.isCustomer) {
        const scr = document.getElementById('hc_message_record')
        if (scr !== null) {
          scr.scrollTop = scr.scrollHeight
        }
      } else {
        const scr = document.getElementById('hv_message_record')
        if (scr !== null) {
          scr.scrollTop = scr.scrollHeight
        }
      }
    })
  },
  mounted() {
    this.user_id = getCookies('uid')
    if (this.$route.query.type === 'edit') {
      this.getAfterSalesDetail()
    }
    this.initWebSocket()
  },
  methods: {
    getAfterSalesDetail() {
      this.loading = true
      afterSalesDetail({ id: this.$route.query.id }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.after_id = res.data.id
          this.type = res.data.type
          this.is_push = res.data.is_push
          this.client_status = res.data.client_status
          this.client_reply = res.data.client_reply
          if (this.client_reply.length === 0) {
            this.handleVendor()
          } else {
            this.client_reply.map(it => {
              if (it.reply_user !== this.user_id) {
                this.client_name = it.reply_user_name
              }
            })
          }
          if (res.data.service_reply.length > 0) {
            res.data.service_reply.map(it => {
              if (it.reply_user !== this.user_id) {
                this.server_name = it.reply_user_name
              }
            })
          }
          this.productsList = res.data.product_json
          this.status = res.data.status
          this.customerAfterSaleInfo.reply = res.data.client_reply ? res.data.client_reply : []
          this.vendorAfterSaleInfo.reply = res.data.service_reply ? res.data.service_reply : []
          this.socket.emit('after-read', { after_id: this.after_id, type: this.socketType })
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },
    // complete
    complete() {
      const ids = []
      ids.push(this.tableData.id)
      if (this.client_status === 3 || this.status === 3) {
        afterSalesChanngedStatus({ id: ids, status: 5 }).then(res => {
          let type = ''
          if (res.code === 200) {
            type = 'success'
          } else {
            type = 'error'
          }
          this.dialogVisible = false
          this.$message({ message: res.message, type: type })
        }).catch(err => {
          console.log(err)
        }).finally(() => {

        })
      } else {
        this.dialogVisible = true
      }
    },
    handleComplete(type) {
      const ids = []
      ids.push(this.tableData.id)
      if (type === 3) {
        afterSalesChanngedStatus({ id: ids, status: type }).then(res => {
          let type = ''
          if (res.code === 200) {
            type = 'success'
          } else {
            type = 'error'
          }
          this.dialogVisible = false
          this.$message({ message: res.message, type: type })
        }).catch(err => {
          console.log(err)
        }).finally(() => {

        })
      } else if (type === 4) {
        afterSalesChanngedStatus({ id: ids, status: type }).then(res => {
          let type = ''
          if (res.code === 200) {
            type = 'success'
          } else {
            type = 'error'
          }
          this.dialogVisible = false
          this.$message({ message: res.message, type: type })
        }).catch(err => {
          console.log(err)
        }).finally(() => {

        })
      } else {
        afterSalesChanngedStatus({ id: ids, status: type }).then(res => {
          let type = ''
          if (res.code === 200) {
            type = 'success'
          } else {
            type = 'error'
          }
          this.dialogVisible = false
          this.$message({ message: res.message, type: type })
        }).catch(err => {
          console.log(err)
        }).finally(() => {

        })
      }
    },
    handleCustomerReply() {
      if (this.customerAfterChat.reply_info === '' && this.customerAfterChat.reply_img.length === 0) {
        this.$message.warning('Please enter the reply content or picture！')
      } else {
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
          reply_user: this.bInformation.user_id,
          reply_user_image: this.bInformation.icon,
          reply_user_name: this.bInformation.username,
          reply_time: FormatDate,
          reply_info: this.customerAfterChat.reply_info,
          reply_img: this.customerAfterChat.reply_img
        }
        this.$set(this.customerAfterChat, 'after_id', this.after_id)
        this.$set(this.customerAfterChat, 'type', this.socketType)
        this.socket.emit('after-reply', this.customerAfterChat)
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
          this.isCustomerMessageRecord = false
          this.customerAfterSaleInfo.reply.push(obj)
          this.$nextTick(() => {
            this.isCustomerMessageRecord = true
          })
          this.customerAfterChat = this.$options.data().customerAfterChat
          this.reply_img = []
        }
      }
    },
    handleVendorReply() {
      if (this.vendorAfterChat.reply_info === '' && this.vendorAfterChat.reply_img.length === 0) {
        this.$message.warning('Please enter the reply content or picture！')
      } else {
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
          reply_user: this.bInformation.user_id,
          reply_user_image: this.bInformation.icon,
          reply_user_name: this.bInformation.username,
          reply_time: FormatDate,
          reply_info: this.vendorAfterChat.reply_info,
          reply_img: this.vendorAfterChat.reply_img
        }
        this.$set(this.vendorAfterChat, 'after_id', this.after_id)
        this.$set(this.vendorAfterChat, 'type', this.socketType)
        this.socket.emit('after-reply', this.vendorAfterChat)
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
          this.isVendorMessageRecord = false
          this.vendorAfterSaleInfo.reply.push(obj)
          this.$nextTick(() => {
            this.isVendorMessageRecord = true
          })
          this.vendorAfterChat = this.$options.data().vendorAfterChat
          this.reply_img = []
        }
      }
    },
    customerUpload(fileObj) {
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
          this.customerAfterChat.reply_img.push(data['data-service-file'])
          this.showImg = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleCustomerBeforeUpload(file, fileList) {
      // console.log('change', file)
    },
    handleCustomerChange(file) {
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
    vendorUpload(fileObj) {
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
          this.vendorAfterChat.reply_img.push(data['data-service-file'])
          this.showImg = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleVendorBeforeUpload(file, fileList) {
      // console.log('change', file)
    },
    handleVendorChange(file) {
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
          this.vendorAfterSaleInfo.reply.push(e.data)
          this.socket.emit('after-read', { after_id: this.after_id, type: this.socketType })
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
    handleCustomer() {
      this.isCustomer = true
      this.socketType = 4
    },
    handleVendor() {
      this.isCustomer = false
      this.socketType = 1
    },
    handleRouteBack() {
      this.socket.emit('leave-after', { after_id: this.after_id })
      this.$router.back()
    },
    // 推送到b端
    confirmAfterSales() {
      afterSalesType().then(res => {
        if (res.code === 200) {
          this.typeList = res.data
        }
      })
      this.forwardVisible = true
    },
    handleAfterSales() {
      const products = []
      this.afterDialog.product_json.map(it => {
        this.productsList.map(item => {
          if (it === item.id) {
            products.push(item)
          }
        })
      })
      const formData = {
        id: Number(this.after_id),
        after_type: this.afterDialog.after_type,
        after_model: this.afterDialog.after_model,
        product_json: products
      }
      afterSalesConfirmSend(formData).then(res => {
        if (res.code === 200) {
          this.forwardVisible = false
          this.$message.success(res.message)
          this.getAfterSalesDetail()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.after-detail-box {
  .top-box {
    display: flex;
    justify-content: space-between;
    .order-id {
      line-height: 36px;
      margin-right: 20px;
    }
    .order-header {
      line-height: 30px;
    }
    .button-border {
      border: 1px solid #ef6f38;
      color: #ef6f38;
    }
  }
  .order-cell {
    overflow: auto;
    .detail-block-title {
      h2 {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
      }
      .inx_text {
        color: #777;
      }
    }
    .custul li{
      float: left;
      padding-right: 340px;
      list-style:none;
    }
  }
  .HMain {
    .message_record {
      height: 45vh;
      overflow-y: auto;
      .message-box {
        padding: 20px 30px 0;
        overflow-x: hidden;
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
          .reply-left {
            max-width: 80%;
            position: relative;
            display: inline-block;
            word-wrap: break-word;
            word-break: normal;
            background-color: #4b89bc;
            color: #fff;
            box-sizing: border-box;
            padding: 16px 10px 0;
            border-radius: 8px;
            ::after {
              content: '';
              display: inline-block;
              width: 12px;
              height: 12px;
              background-color: #4b89bc;
              position: absolute;
              top: 50%;
              left: -6px;
              transform: rotate(45deg)  translate(-50%, -50%);
            }
          }
          .reply-right {
            max-width: 80%;
            position: relative;
            display: inline-block;
            word-wrap: break-word;
            word-break: break-all;
            text-align: left;
            background-color: #e56e02;
            color: #fff;
            box-sizing: border-box;
            padding: 16px 10px 0;
            border-radius: 8px;
            ::after {
              content: '';
              display: inline-block;
              width: 12px;
              height: 12px;
              background-color: #e56e02;
              position: absolute;
              top: 50%;
              right: -6px;
              transform: rotate(45deg)  translate(-50%, -50%);
            }
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
      .service-tips {
        width: 700px;
        border-radius: 20px;
        margin: 0 auto;
        text-align: center;
        background-color: #e7e7e7;
        color: #9f9fa0;
        i {
          margin-right: 20px;
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
        width: 40px;
        height: 34px;
        position: absolute;
        top: 2px;
        left: 195px;
        background-color: #fff;
        .upload-photos {
          font-size: 18px;
          position: absolute;
          top: 4px;
          left: 8px;
          color: #585858;
        }
      }
      .tick-box {
        position: absolute;
        top: 43px;
        left: 0;
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
}
</style>
