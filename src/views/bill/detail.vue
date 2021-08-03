<template>
  <div class="billDetail" id="pdfCentent">
    <div class="box-card">
      <div class="btn-box p20">
        <div>
          <el-button class="mr30" size="small" icon="el-icon-back" @click="$router.back()" />
          <span class="mr30">{{ '【'+ billDetailForm.bill_name + '】' }}</span>
          <span class="mr30">{{ billDetailForm.bill_no }}</span>
        </div>
        <div>
          <el-button type="primary" size="small" @click="ExportSavePdf(htmlTitle, nowTime)">ExportDetails</el-button>
          <el-button v-throttle="[settlement]" type="primary" size="small">Settlement</el-button>
        </div>
      </div>
    </div>
    <el-card class="m20 mt0">
      <el-form :model="billDetailForm" label-width="100px" inline label-position="left" class="form-box">
        <div class="box-card create-box ml20 mr20 mb20">
          <div class="form-data-box">
            <div class="left">
              <div class="upload-logo">
<!--                <el-image :src="billDetailForm.enterprise_logo" style="height: 200px;width: 250px" />-->
                <el-image :src="logImg" style="height: 200px;width: 250px" />
              </div>
              <el-form-item label="" prop="enterprise_info">
                <div class="mv-calc">{{ billDetailForm.enterprise_info }}</div>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="Bill To" prop="bill_to">
                    <div class="bill-calc">{{ billDetailForm.bill_to }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Ship To" prop="ship_to">
                    <div class="bill-calc">{{ billDetailForm.ship_to }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="right">
              <el-form-item label=" " prop="bill_info">
                <span class="w-400 big">{{ billDetailForm.bill_info }}</span>
              </el-form-item>
              <el-form-item label="#" prop="bill_name">
                <span class="w-400">{{ billDetailForm.bill_name }}</span>
              </el-form-item>
              <el-form-item label="Date" prop="date">
                <span class="w-400">{{ billDetailForm.date }}</span>
              </el-form-item>
              <el-form-item label="Due Date" prop="due_date">
                <span class="w-400">{{ billDetailForm.due_date }}</span>
              </el-form-item>
              <el-form-item label="Balance Due" prop="balance_due">
                <span class="w-400">US${{ billDetailForm.balance_due }}</span>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="box-card create-box ml20 mr20 mb20">
          <el-table :data="billDetailForm.order_list" empty-text="No Data" class="material-table">
            <el-table-column prop="ltem" label="ltem" min-width="320" />
            <el-table-column prop="quantity" label="Quantity" width="260" />
            <el-table-column prop="rate" label="Rate" width="260"></el-table-column>
            <el-table-column prop="amount" label="Amount" width="260"></el-table-column>
          </el-table>
          <el-button type="primary" size="small" icon="el-icon-view" class="mt20" @click="iViews">Details</el-button>
        </div>
        <div class="box-card create-box ml20 mr20 mb20">
          <div class="notes-form">
            <div class="notes-box">
              <el-form-item label="Notes" prop="notes">
                <div class="notesTerms">{{ billDetailForm.notes }}</div>
              </el-form-item>
              <el-form-item label="Terms" prop="terms">
                <div class="notesTerms">{{ billDetailForm.terms }}</div>
              </el-form-item>
            </div>
            <div class="product-details">
              <el-form-item label="Subtotal" prop="subtotal">
                <span>US${{ billDetailForm.subtotal }}</span>
              </el-form-item>
              <el-form-item label="Discount(%)" prop="discount">
                <span>{{ billDetailForm.discount }}</span>
              </el-form-item>
              <el-form-item label="Tax(%)" prop="tax">
                <span>{{ billDetailForm.tax }}</span>
              </el-form-item>
              <el-form-item label="Total" prop="total">
                <span>US${{ billDetailForm.total }}</span>
              </el-form-item>
              <el-form-item label="Refunded" prop="refund_price">
                <span>${{ billDetailForm.refunded }}</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getOrderBillDetail, getOrderBillFinish } from '@/api/bill'
import axios from 'axios'

export default {
  name: 'bill-detail',
  data() {
    return {
      billDetailForm: {
        bill_id: '',
        bill_name: '',
        bill_no: '',
        bill_status: '',
        enterprise_logo: '',
        date: '',
        due_date: '',
        refunded: '',
        amount_paid: '',
        balance_due: '',
        enterprise_name: '',
        business_address: '',
        contact_number: '',
        mailbox: '',
        bill_to: '',
        ship_to: '',
        order_list: []
      },
      bill_id: '',
      htmlTitle: 'detail--',
      nowTime: new Date(),
      logImg: ''
    }
  },
  created() {
    this.billDetailForm.bill_id = this.$route.query.bill_id
    this.bill_id = this.$route.query.bill_id
    this.handleInit()
  },
  methods: {
    // 完成账单
    settlement() {
      if (this.billDetailForm.bill_status === '2') {
        this.$message.warning('The order has been settled, please do not submit it repeatedly!')
      } else {
        const ids = []
        ids.push(this.bill_id)
        getOrderBillFinish({ id: ids }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.$router.push({
              name: 'bill'
            })
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    // 查看
    iViews() {
      const billDetail = {
        bill_name: this.billDetailForm.bill_name,
        bill_no: this.billDetailForm.bill_no
      }
      this.$router.push({
        name: 'bill-preview',
        query: { bill_id: this.bill_id, billSomeThing: billDetail }
      })
    },
    // 初始化
    handleInit() {
      getOrderBillDetail({ bill_id: this.billDetailForm.bill_id }).then(res => {
        if (res.code === 200) {
          this.billDetailForm = res.data
          this.$set(this.billDetailForm, 'order_list', res.data.billLtem)
          this.getBase64Image(this.billDetailForm.enterprise_logo, (baseUrl) => {
            this.logImg = baseUrl
          })
        }
      })
    },
    getBase64Image(src, callback, outputFormat) {
      axios.get(src, { responseType: 'arraybuffer' }).then((res) => {
        if (res.status === 200) {
          // console.log("res返回参数：", res)
          var uInt8Array = new Uint8Array(res.data)
          var i = uInt8Array.length
          var binaryString = new Array(i)
          while (i--) {
            binaryString[i] = String.fromCharCode(uInt8Array[i])
          }
          var data = binaryString.join('')
          var base64 = window.btoa(data)
          var dataUrl = 'data:' + (outputFormat || 'image/png') + ';base64,' + base64
          callback.call(this, dataUrl)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.billDetail {
  height: 100%;
  overflow: auto;
  .el-card__body {
    background-color: #fff; // 为导出pdf设置
  }
  .form-box { // 为导出pdf设置
    background-color: #fff;
    width: calc(100vm);
    //height: calc(100vh);
  }
  .box-card {
    .create-btn {
      display: flex;
      justify-content: space-between;
    }
    .btn-box {
      display: flex;
      justify-content: space-between;
      .sec {
        display: inline-block;
      }
    }
  }
  .create-box {
    background-color: #fff;  // 为导出pdf设置
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 30px 30px 15px;
    .mv-calc {
      width: calc(100vw - 70vw)!important;
      height: 130px;
      word-wrap: break-word;
      word-break: normal;
    }
    .bill-calc {
      width: calc(100vw - 80vw)!important;
      height: 130px;
      word-wrap: break-word;
      word-break: normal;
    }
    .form-data-box {
      display: flex;
      justify-content: space-between;
      .left {
        flex: 3;
        padding-left: 20px;
        .upload-logo {
          width: 250px;
          height: 200px;
          background-color: #eee;
          margin-bottom: 20px;
          .img-line {
            line-height: 200px;
            padding-left: 10px;
            font-size: 22px;
          }
        }
      }
      .right {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        .big {
          font-size: 28px;
          font-weight: 700;
        }
      }
      .form-preview {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding-left: 40px;
      }
    }
    .notes-form {
      display: flex;
      justify-content: space-between;
      .notes-box {
        flex: 3;
        margin-right: 40px;
        display: flex;
        flex-direction: column;
      }
      .product-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
      }
    }
  }
}
</style>
