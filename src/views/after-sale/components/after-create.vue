<template>
  <div v-loading="loading" class="after-create-box p30">
    <div class="top-box">
      <div class="order-header flexbox">
        <el-button
          size="small"
          class="button-border"
          icon="el-icon-back"
          @click="$router.back()"
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
          <div v-for="(item, idx) in afterSaleInfo.messageList" :key="idx" class="message-box" :class="[item.user_id === user_id ? 'right' : 'left']">
            <div class="title">
              <el-image
                v-if="item.user_id !== user_id"
                class="avatar"
                :src="item.avatar"
                :preview-src-list="[item.avatar]"
              />
              <div class="title-text">
                <p class="title-user-name">{{ item.user_name }}</p>
                <p class="title-time">{{ item.time }}</p>
              </div>
              <el-image
                v-if="item.user_id === user_id"
                class="avatar"
                :src="item.avatar"
                :preview-src-list="[item.avatar]"
              />
            </div>
            <div class="line" :class="[item.user_id === user_id ? 'line-right' : 'line-left']">
              <el-divider />
            </div>
            <div class="contain">
              <div class="mb10" v-html="item.message_info" />
              <div>
                <el-image
                  v-for="(it,i) in item.message_img"
                  :key="i"
                  class="image"
                  :src="it"
                  :preview-src-list="[it]"
                />
              </div>
            </div>
            <div class="line" :class="[item.user_id === user_id ? 'line-right' : 'line-left']">
              <el-divider />
            </div>
          </div>
        </div>
      </el-card>
      <!-- After Sales Reply -->
      <el-card class="chat_box mt20">
        <tinymce ref="tinymces" v-model="afterSaleInfo.template_content" menubar :height="250" @reply="handleReply" />
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
        <div class="image-box">
          <el-image
            v-for="(fit, key) in afterSaleInfo.template_image"
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
import { afterSalesType } from '@/api/after'
import { getCookies } from '@/utils/cookies'
import { uploadImage } from '@/api/product'
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
        messageList: [],
        template_content: '',
        template_image: []
      }
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
    }
  },
  updated() {
    this.$nextTick(() => {
      const scr = document.getElementById('h_message_record')
      scr.scrollTop = scr.scrollHeight
    })
  },
  created() {
    this.getAfterSalesType()
    this.user_id = getCookies('uid')
    this.init()
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
    init() {
      this.afterSaleInfo.messageList = [
        {
          user_id: '147',
          avatar: 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728',
          user_name: 'TOM',
          time: '2020/11/18 20:28:57',
          message_info: 'I want to become rich',
          message_img: ['https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728']
        },
        {
          user_id: '206',
          avatar: 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728',
          user_name: 'Little Fairy',
          time: '2020/11/18 20:28:57',
          message_info: '我要变有钱',
          message_img: ['https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728']
        },
        {
          user_id: '147',
          avatar: 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728',
          user_name: 'TOM',
          time: '2020/11/17 20:28:57',
          message_info: 'I want to become rich',
          message_img: ['https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728']
        },
        {
          user_id: '206',
          avatar: 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728',
          user_name: 'Little Fairy',
          time: '2020/11/17 20:28:57',
          message_info: '我要变有钱',
          message_img: ['https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728']
        },
        {
          user_id: '147',
          avatar: 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728',
          user_name: 'TOM',
          time: '2020/11/16 20:28:57',
          message_info: 'I want to become rich',
          message_img: ['https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728']
        },
        {
          user_id: '206',
          avatar: 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728',
          user_name: 'Little Fairy',
          time: '2020/11/16 20:28:57',
          message_info: '我要变有钱',
          message_img: ['https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728']
        }
      ]
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
        user_id: '147',
        avatar: 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728',
        user_name: 'TOM',
        time: FormatDate,
        message_info: this.afterSaleInfo.template_content,
        message_img: this.afterSaleInfo.template_image
      }
      this.afterSaleInfo.messageList.push(obj)
      this.$nextTick(() => {
        this.isMessageRecord = true
      })
      this.afterSaleInfo.template_content = ''
      this.afterSaleInfo.template_image = []
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
