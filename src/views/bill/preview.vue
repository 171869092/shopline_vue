<template>
  <div class="previewBill">
    <div class="box-card">
      <div class="btn-box p20">
        <div>
          <el-button class="mr30" size="small" icon="el-icon-back" @click="$router.back()" />
          <span class="mr30">{{ '【'+ billDetail.bill_name + '】' }}</span>
          <span class="mr30">{{ billDetail.bill_no }}</span>
        </div>
        <export-import :set-export-data="setExportData">
          <template slot="export">
            <el-button type="primary" size="small">Export</el-button>
          </template>
        </export-import>
      </div>
    </div>
    <el-card class="box-card m20 mt0">
      <el-form :model="previewForm" label-width="120px" inline>
        <el-input type="text" v-model="previewForm.search" placeholder="please enter" class="w-300 mb20" size="small" clearable @change="filterBill"></el-input>
      </el-form>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        fit
        border
        stripe
        :header-cell-style="{background:'#e9f1ff',color:'#606266'}"
      >
        <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
          <template slot-scope="scope">
            <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
            <span v-if="item.type =='goodsSku'" v-html="handleWarp(scope.row[item.value])"></span>
            <span v-if="item.type == 'status'">
              <span>{{ getValueOfLabel(scope.row.settlement_status,previewFormStatusList) }}</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :pageSizes="pageSize" @pagination="Inquire" />
    </el-card>
  </div>
</template>

<script>
import { OrderBillDetail } from '@/api/bill'
import exportImport from '@/components/exportImport/index'
import { debounce } from '@/utils'
export default {
  name: 'preview-bill',
  components: {
    Pagination: () => import('@/components/Pagination'),
    exportImport
  },
  data() {
    return {
      previewForm: {
        bill_id: '',
        search: ''
      },
      billDetail: {
        bill_name: '',
        bill_no: ''
      },
      createDate: [],
      previewFormStatusList: [
        {
          value: '1',
          label: 'Settled'
        },
        {
          value: '2',
          label: 'Refunded'
        },
        {
          value: '3',
          label: 'Processed'
        },
        {
          value: '4',
          label: 'Cancelled'
        }
      ],
      // 列表数据
      tableData: [],
      // 列表表头
      labelList: [
        { label: 'Order', value: 'order_name', width: '260' },
        { label: 'Store', value: 'store_url' },
        { label: 'Order goods and quantity', type: 'goodsSku', value: 'goods_sku', width: '220' },
        { label: 'Product price', value: 'product_total_amount', width: '220' },
        { label: 'Logistics cost', value: 'logistics_cost', width: '220' },
        { label: 'Service fee', value: 'service_fee', width: '220' },
        { label: 'Amount', value: 'total_amount', width: '220' },
        { label: 'State', type: 'status', value: 'settlement_status', width: '220' }
      ],
      loading: false,
      // 分页
      listQuery: {
        page: 1,
        limit: 10,
        total: 0
      },
      pageSize: [10, 30, 50, 100]
    }
  },
  created() {
    this.previewForm.bill_id = this.$route.query.bill_id
    this.billDetail = this.$route.query.billSomeThing
    this.Inquire()
  },
  methods: {
    // 筛选
    search() {
      this.listQuery.page = 1
      this.listQuery.limit = 10
      this.Inquire()
    },
    // 重置
    resetClick() {
      this.previewForm.search = ''
      this.Inquire()
    },
    // 搜索
    Inquire() {
      this.loading = true
      const formData = JSON.parse(JSON.stringify(this.previewForm))
      formData.iDisplayLength = this.listQuery.limit
      formData.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      OrderBillDetail(formData).then(res => {
        if (res.code === 200) {
          setTimeout(() => {
            this.tableData = res.data
            this.listQuery.total = parseInt(res.total)
            this.loading = false
          }, 300)
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    // 导出
    setExportData() {
      return {
        // excelTitle: {},
        excelData: this.tableData
      }
    },
    getValueOfLabel(num, sum) {
      const arr = sum.filter(e => e.value === num)
      if (arr.length > 0) {
        return arr[0].label
      } else {
        return num
      }
    },
    filterBill: debounce(function() {

      this.search()
    }, 500),
    handleWarp(content) {
      content = content.replace(/,/g, '</br>')
      return content
    }
  }
}
</script>

<style scoped lang="scss">
.previewBill {
  .box-card {
    .btn-box {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
