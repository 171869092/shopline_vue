<template>
  <div class="billDetail">
    <div class="box-card">
      <div class="btn-box p20">
        <div>
          <el-button class="mr30" size="small" icon="el-icon-back" @click="$router.back()" />
          <span class="mr30">{{ '【'+ billDetailForm.bill_name + '】' }}</span>
          <span class="mr30">{{ billDetailForm.bill_no }}</span>
        </div>
        <el-button type="primary" size="small" @click="settlement">Settlement</el-button>
      </div>
    </div>
    <el-card class="m20 mt0">
      <el-form :model="billDetailForm" label-width="100px" inline label-position="left">
        <div class="box-card create-box form-wrap ml20 mr20 mb20">
          <el-form-item label="Bill name" prop="bill_name">
            <span class="w-300">{{ billDetailForm.bill_name }}</span>
          </el-form-item>
          <el-form-item label="Date" prop="date">
            <span class="w-300">{{ billDetailForm.date }}</span>
          </el-form-item>
          <el-form-item label="Due Date" prop="due_date">
            <span class="w-300">{{ billDetailForm.due_date }}</span>
          </el-form-item>
          <el-form-item label="Refunded" prop="refunded">
            <span class="w-300">{{ billDetailForm.refunded }}</span>
          </el-form-item>
          <el-form-item label="Amount Paid" prop="amount_paid">
            <span class="w-300">{{ billDetailForm.amount_paid }}</span>
          </el-form-item>
          <el-form-item label="Balance Due" prop="balance_due">
            <span class="w-300">{{ billDetailForm.balance_due }}</span>
          </el-form-item>
        </div>
        <div class="box-card create-box ml20 mr20 mb20">
          <div class="form-data-box">
            <div class="upload-logo">
              <el-image :src="billDetailForm.enterprise_logo" style="height: 200px;width: 200px" />
            </div>
            <div class="form-preview">
              <el-form-item label="Enterprise name" prop="enterprise_name">
                <span class="w-400">{{ billDetailForm.enterprise_name }}</span>
              </el-form-item>
              <el-form-item label="contact number" prop="contact_number">
                <span class="w-400">{{ billDetailForm.contact_number }}</span>
              </el-form-item>
              <el-form-item label="Business address" prop="business_address">
                <span class="w-400">{{ billDetailForm.business_address }}</span>
              </el-form-item>
              <el-form-item label="Enterprise mailbox" prop="mailbox">
                <span class="w-400">{{ billDetailForm.mailbox }}</span>
              </el-form-item>
            </div>
          </div>
          <el-divider />
          <el-row>
            <el-col :span="12">
              <el-form-item label="Bill To" prop="bill_to">
                <el-input v-model="billDetailForm.bill_to" type="textarea" size="small" :rows="6" class="mv-calc" readonly resize="none" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Ship To" prop="ship_to">
                <el-input v-model="billDetailForm.ship_to" type="textarea" size="small" :rows="6" class="mv-calc" readonly resize="none" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="box-card create-box ml20 mr20 mb20">
          <el-table :data="billDetailForm.order_list" class="material-table">
            <el-table-column prop="ltem" label="ltem" min-width="320" />
            <el-table-column prop="price" label="Price" width="260" />
            <el-table-column prop="quantity" label="Quantity" width="260" />
            <el-table-column prop="total_price" label="Total price" width="260" />
          </el-table>
          <el-button type="primary" size="small" icon="el-icon-view" class="mt20" @click="iViews">Details</el-button>
        </div>
        <div class="box-card create-box ml20 mr20 mb20">
          <div class="notes-form">
            <div>
              <el-form-item label="Notes" prop="notes">
                <el-input v-model="billDetailForm.notes" type="textarea" size="small" :rows="6" class="w-730" readonly resize="none" />
              </el-form-item>
              <el-form-item label="Terms" prop="terms">
                <el-input v-model="billDetailForm.terms" type="textarea" size="small" :rows="6" class="w-730" readonly resize="none" />
              </el-form-item>
            </div>
            <div class="product-details">
              <el-form-item label="Subtotal" prop="subtotal">
                <span>{{ billDetailForm.subtotal }}</span>
              </el-form-item>
              <el-form-item label="Discount(%)" prop="discount">
                <span>{{ billDetailForm.discount }}</span>
              </el-form-item>
              <el-form-item label="Tax(%)" prop="tax">
                <span>{{ billDetailForm.tax }}</span>
              </el-form-item>
              <el-form-item label="Total" prop="total">
                <span>{{ billDetailForm.total }}</span>
              </el-form-item>
              <el-form-item label="Refunded" prop="refunded">
                <span>{{ billDetailForm.refunded }}</span>
              </el-form-item>
              <el-form-item label="Amount Paid" prop="amount_paid">
                <span>{{ billDetailForm.amount_paid }}</span>
              </el-form-item>
              <el-form-item label="Balance Due" prop="balance_due">
                <span>{{ billDetailForm.balance_due }}</span>
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

export default {
  name: 'bill-detail',
  data() {
    return {
      bill_status: '',
      billDetailForm: {
        bill_id: '',
        bill_name: '',
        bill_no: '',
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
      bill_id: ''
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
      const ids = []
      ids.push(this.bill_id)
      getOrderBillFinish({ id: ids }).then(res => {
        if (res.code === 200) {
          this.$message.success('The bill is settled successfully!')
          this.$router.push({
            name: 'bill'
          })
        } else {
          this.$message.error('Order settlement failed!')
        }
      })
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
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.billDetail {
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
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 30px 30px 15px;
    .mv-calc {
      width: calc(100vw - 70vw)!important;
    }
    .form-data-box {
      display: flex;
      .upload-logo {
        height: 200px;
        background-color: #eee;
        flex: 0 0 200px;
        .img-line {
          line-height: 200px;
          padding-left: 10px;
          font-size: 22px;
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
      .product-details {
        flex: 0 0 400px;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
      }
    }
  }
  .form-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 30px;
    padding: 16px 24px;
  }
}
</style>
