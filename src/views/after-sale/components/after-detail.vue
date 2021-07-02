<template>
  <div v-loading="loading" class="after-detail-box p30">
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
        <el-button size="small" type="primary" @click="isForward = true">Forward</el-button>
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
        <el-button size="small" :type="isCustomer ? 'primary' : ''" class="w-300" @click="isCustomer = true">Customer</el-button>
        <el-button v-if="isForward" size="small" :type="isCustomer ? '' : 'primary'" class="w-300" style="margin-left: 0" @click="isCustomer = false">Vendor</el-button>
      </div>
      <div v-show="isCustomer" class="mt20 HMain">
        <!-- After Sales Message record -->
        <el-card class="box-card mt20">
          <div v-if="isCustomerMessageRecord" class="message_record">
            <div v-for="(item, idx) in customerAfterSaleInfo.messageList" :key="idx" class="message-box" :class="[item.user_id === user_id ? 'right' : 'left']">
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
          <tinymce ref="tinymces" v-model="customerAfterSaleInfo.template_content" menubar :height="250" @reply="handleCustomerReply" />
        </el-card>
      </div>
      <div v-show="isForward && !isCustomer" class="mt20 HMain">
        <!-- After Sales Message record -->
        <el-card class="box-card mt20">
          <div v-if="isVendorMessageRecord" class="message_record">
            <div v-for="(item, idx) in vendorAfterSaleInfo.messageList" :key="idx" class="message-box" :class="[item.user_id === user_id ? 'right' : 'left']">
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
          <tinymce ref="tinymces" v-model="vendorAfterSaleInfo.template_content" menubar :height="250" @reply="handleVendorReply" />
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import { afterSalesChanngedStatus, afterSalesDetail } from '@/api/after'
import { getCookies } from '@/utils/cookies'
export default {
  name: 'after-detail',
  components: {
    Tinymce: () => import('../components/tinymce')
  },
  data() {
    return {
      user_id: '',
      isCustomerMessageRecord: true,
      isVendorMessageRecord: true,
      loading: false,
      tableData: {
        id: '',
        after_model: '',
        after_type: '',
        product_json: []
      },
      type: '1',
      isCustomer: true,
      isForward: false,
      dialogVisible: false,
      customerAfterSaleInfo: {
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
        template_content: ''
      },
      vendorAfterSaleInfo: {
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
        template_content: ''
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
  created() {
    this.user_id = getCookies('uid')
    if (this.$route.query.type === 'edit') {
      this.getAfterSalesDetail()
    }
  },
  methods: {
    getAfterSalesDetail() {
      this.loading = true
      afterSalesDetail({ id: this.$route.query.id }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.type = res.data.type
          this.customerAfterSaleInfo.messageList = [
            {
              user_id: '132',
              avatar: 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728',
              user_name: 'LISA',
              time: '2020/11/18 20:28:57',
              message_info: 'La La La La La La La La La La La La ~~',
              message_img: ['https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728']
            },
            {
              user_id: '147',
              avatar: 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728',
              user_name: 'TOM',
              time: '2020/11/18 20:28:57',
              message_info: 'I want to become rich',
              message_img: ['https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728']
            },
            {
              user_id: '132',
              avatar: 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728',
              user_name: 'LISA',
              time: '2020/11/17 20:28:57',
              message_info: 'La La La La La La La La La La La La ~~',
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
              user_id: '132',
              avatar: 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728',
              user_name: 'LISA',
              time: '2020/11/16 20:28:57',
              message_info: 'La La La La La La La La La La La La ~~',
              message_img: ['https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728']
            },
            {
              user_id: '147',
              avatar: 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728',
              user_name: 'TOM',
              time: '2020/11/16 20:28:57',
              message_info: 'I want to become rich',
              message_img: ['https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728', 'https://cdn.shopify.com/s/files/1/0503/0137/0529/products/202101120848112159e02a875670f10fc0407846a04af687a_35bee0ab-acdb-4d2e-9948-43c51aa579bb.jpg?v=1610447728']
            }
          ]
          this.vendorAfterSaleInfo.messageList = [
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
      afterSalesChanngedStatus({ id: ids }).then(res => {
        let type = ''
        if (res.code === 200) {
          type = 'success'
        } else {
          type = 'error'
        }
        this.$message({ message: res.message, type: type })
      }).catch(err => {
        console.log(err)
      }).finally(() => {

      })
    },
    handleCustomerReply() {
      this.isCustomerMessageRecord = false
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
        message_info: this.customerAfterSaleInfo.template_content,
        message_img: []
      }
      this.customerAfterSaleInfo.messageList.push(obj)
      this.$nextTick(() => {
        this.isCustomerMessageRecord = true
      })
    },
    handleVendorReply() {
      this.isVendorMessageRecord = false
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
        message_info: this.vendorAfterSaleInfo.template_content,
        message_img: []
      }
      this.vendorAfterSaleInfo.messageList.push(obj)
      this.$nextTick(() => {
        this.isVendorMessageRecord = true
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
      ::v-deep.el-card__body {
        padding: 0!important;
        height: 250px;
      }
    }
  }
}
</style>
