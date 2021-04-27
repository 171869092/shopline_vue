<template>
  <div class="bill-box">
    <el-card class="box-card">
      <el-tabs v-model="formQuery.bill_status" @tab-click="handleClick">
        <div class="flexbox justify-space-between">
          <div class="filter-control flexbox mb20">
            <div class="filter-item">
              <el-input
                v-model="formQuery.search"
                clearable
                class="w-400"
                prefix-icon="el-icon-search"
                placeholder="please enter"
                @change="filterBill"
              />
            </div>
            <div class="filter-item w-250 ml20">
              <el-select
                v-model="formQuery.bill_status"
                collapse-tags
                placeholder="Ship status"
                style="width:100%"
                @change="filterBillStatus"
              >
                <el-option
                  v-for="(item, key) in orderStatus"
                  :key="key"
                  :label="item"
                  :value="key"
                />
              </el-select>
            </div>
          </div>
        </div>
        <el-button type="primary" size="small" @click="settlement" class="mr10 mb10">Settlement</el-button>
        <export-import :set-export-data="setExportData" class="mb10">
          <template slot="export">
            <el-button type="primary" size="small">Export</el-button>
          </template>
        </export-import>
        <el-tab-pane v-for="(tab, key) in tabList" :key="key" :label="tab.label" :name="tab.name">
          <el-table
            ref="multipleTable"
            v-loading="loading"
            v-sticky="{top: 0, parent: '#app_main' }"
            :data="tableData"
            style="width: 100%"
            highlight-current-row
            fit
            stripe
            :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}"
            @select="shiftMultiple"
            @select-all="selectAll"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="Bill number">
              <template slot-scope="scope">
                <span class="primary pointer" @click="handleView(scope.row)">{{ scope.row.bill_no }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Bill name">
              <template slot-scope="scope">
                <div>{{ scope.row.bill_name }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Order quantity">
              <template slot-scope="scope">
                <div>{{ scope.row.order_num }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Creation time">
              <template slot-scope="scope">
                <span>{{ scope.row.creat_time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Completion time">
              <template slot-scope="scope">
                <span>{{ scope.row.update_time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="State">
              <template slot-scope="scope">
                <span>{{ orderStatus[scope.row.bill_status] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Operation">
              <template slot-scope="scope">
                <span class="primary pointer" @click="handleView(scope.row)">See</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { getOrderBillFinish, getOrderBillList } from '@/api/bill'
import Sticky from '@/directive/fix-table-header'
import exportImport from '@/components/exportImport/index'

export default {
  name: 'index',
  directives: { Sticky },
  components: {
    Pagination: () => import('@/components/Pagination'),
    exportImport
  },
  created() {
    this.Inquire()
  },
  data() {
    return {
      formQuery: {
        search: '',
        bill_status: ''
      },
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      orderStatus: { 0: 'ALL', 1: 'Unsettled', 2: 'Settled' },
      loading: false,
      tabList: [
        { label: 'ALL', name: '0' },
        { label: 'Unsettled', name: '1' },
        { label: 'Settled', name: '2' }
      ],
      tableData: [],
      selOrderIds: []
    }
  },
  methods: {
    // 筛选
    filterBill: debounce(function() {
      this.resetPageLimit()
      this.Inquire()
    }, 500),
    filterBillStatus: debounce(function() {
      this.resetPageLimit()
      this.Inquire()
    }, 500),
    // 搜索
    resetPageLimit() {
      this.listQuery.page = 1
      this.listQuery.limit = 10
    },
    // 切换
    handleClick() {
      this.resetPageLimit()
      this.Inquire()
    },
    // 分页
    Inquire() {
      this.loading = true
      this.selOrderIds = []
      this.formQuery.iDisplayLength = this.listQuery.limit
      this.formQuery.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      getOrderBillList(this.formQuery).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.map((item, index) => {
            item.index = index
            return item
          })
          this.listQuery.total = +res.total
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },
    // select事件
    shiftMultiple(selection, row) {
      const tableIndex = this.formQuery.bill_status
      const data = this.$refs.multipleTable[tableIndex].tableData // 获取所以数据
      const origin = this.origin // 起点数 从-1开始
      const endIdx = row.index // 终点数
      if (this.pin && selection.includes(data[origin])) { // 判断按住
        const sum = Math.abs(origin - endIdx) + 1// 这里记录终点
        const min = Math.min(origin, endIdx)// 这里记录起点
        let i = 0
        while (i < sum) {
          const index = min + i
          const item = data[index]
          this.$refs.multipleTable[tableIndex].toggleRowSelection(data[index], true) // 通过ref打点调用toggleRowSelection方法，第二个必须为true
          if (!this.selOrderIds.includes(item.id)) {
            this.selOrderIds.push(data[index].id)
          }
          i++
        }
      } else {
        if (selection.length > 0) {
          this.selOrderIds = selection.map(item => item.id)
        } else {
          this.selOrderIds = []
        }
        this.origin = row.index // 没按住记录起点
      }
    },
    selectAll(selection) {
      if (selection.length > 0) {
        this.selOrderIds = selection.map(item => item.id)
      } else {
        this.selOrderIds = []
      }
    },
    handleView(row) {
      this.$router.push({ name: 'bill-detail', query: { bill_id: row.id }})
    },
    // 完成账单
    settlement() {
      if (this.selOrderIds.length > 0) {
        getOrderBillFinish({ id: this.selOrderIds }).then(res => {
          if (res.code === 200) {
            this.$message.success('The bill is settled successfully!')
            this.Inquire()
          } else {
            this.$message.error('Order settlement failed!')
          }
        })
      } else {
        this.$message.warning('Please check the order that will be settled first!')
      }
    },
    // 导出
    setExportData() {
      return {
        // excelTitle: {},
        excelData: this.tableData
      }
    }
  }
}
</script>

<style scoped>

</style>
