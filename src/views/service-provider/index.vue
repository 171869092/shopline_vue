<template>
  <div class="service-provider">
    <el-card class="box-card">
      <div class="flexbox">
        <div class="filter-control flexbox mb20 mr20">
          <div class="filter-item">
            <el-input
              v-model="formQuery.name"
              clearable
              class="w-300"
              prefix-icon="el-icon-search"
              placeholder="please enter"
              @change="filterBill"
            />
          </div>
        </div>
        <div class="filter-control flexbox mb20">
          <div class="filter-item">
            <el-date-picker v-model="formQuery.data" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="startDate" end-placeholder="endDate" />
          </div>
        </div>
      </div>
      <el-button type="primary" size="small" @click="dialogVisible = true" class="mr10 mb10">Newly Added</el-button>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        fit
        stripe
        :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}">
        <el-table-column label="Name">
          <template slot-scope="scope">
            <div>{{ scope.row.service_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Activation code">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Time">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
    </el-card>
    <el-dialog
      title="Activation code"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div class="dialog-box">
        <div class="mr20">
          <div v-for="(item,index) in codeList" :key="index" class="code-box">
            <el-input type="text" v-model="item.code" placeholder="Please input activation code" clearable class="mb20"></el-input>
            <el-button v-if="index !== 0" icon="el-icon-circle-close" type="text" class="btn" @click="handleIconClose(index)"></el-button>
          </div>
        </div>
        <div>
          <el-button icon="el-icon-circle-plus-outline" type="text" class="btn" @click="handleAdd"></el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleDetermine">Determine</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { getGoodsServiceList, getGoodsActivationByCode } from '@/api/service'

export default {
  name: 'service-provider',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  mounted() {
    this.Inquire()
  },
  data() {
    return {
      formQuery: {
        name: '',
        data: ''
      },
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      tableData: [],
      loading: false,
      dialogVisible: false,
      codeList: [{
        code: ''
      }]
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
    // 分页
    Inquire() {
      this.loading = true
      this.selOrderIds = []
      this.formQuery.iDisplayLength = this.listQuery.limit
      this.formQuery.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      getGoodsServiceList(this.formQuery).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.map((item, index) => {
            item.index = index
            return item
          })
          this.listQuery.total = +res.total.totalCount
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },
    // 关闭弹框
    handleClose(done) {
      this.$confirm('Confirm close？')
        .then(_ => {
          this.handleCancel()
          done()
        })
        .catch(_ => {})
    },
    // 增加激活码
    handleAdd() {
      this.codeList.push({ code: '' })
    },
    // 确认激活码
    handleDetermine() {
      const list = []
      this.codeList.map(it => {
        list.push(Object.values(it).toString())
      })
      getGoodsActivationByCode({ code: list }).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.Inquire()
        }
      })
    },
    // 取消
    handleCancel() {
      this.codeList = [{ code: '' }]
      this.dialogVisible = false
    },
    // 删除不为第一条的激活码
    handleIconClose(val) {
      this.codeList.splice(val, 1)
    }
  }
}
</script>

<style scoped lang="scss">
.service-provider {
  margin: 30px;
  .dialog-box {
    padding: 0 30px;
    display: grid;
    grid-template-columns: 3fr 1fr;
    .code-box {
      position: relative;
      .btn {
        position: absolute;
        top: 3px;
        right: -46px;
        font-size: 24px;
        color: #999;
        padding: 0;
      }
    }
    .btn {
      font-size: 24px;
      color: #999;
      padding: 0;
    }
  }
}
</style>
