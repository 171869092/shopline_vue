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
        <div class="filter-control flexbox mb20 mr20">
          <div class="filter-item">
            <el-select
              v-model="formQuery.type"
              collapse-tags
              placeholder="Ship status"
              style="width:100%"
              @change="filterBill"
            >
              <el-option
                v-for="(item, key) in typeList"
                :key="key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <div class="filter-control flexbox mb20">
          <div class="filter-item">
            <el-date-picker v-model="formQuery.data" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="startDate" end-placeholder="endDate" />
          </div>
        </div>
      </div>
      <el-button type="primary" size="small" class="mr10 mb10" @click="dialogVisible = true">Add</el-button>
      <el-button type="primary" size="small" class="mr10 mb10" @click="handleInvite">Invite</el-button>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        empty-text="No Data"
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
        <el-table-column label="Type">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
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
            <el-input v-model="item.code" type="text" placeholder="Please input activation code" clearable class="mb20"></el-input>
            <el-button v-if="index !== 0" icon="el-icon-circle-close" type="text" class="btn" @click="handleIconClose(index)"></el-button>
          </div>
        </div>
        <div>
          <el-button icon="el-icon-circle-plus-outline" type="text" class="btn" @click="handleAdd"></el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleDetermine">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Invitation link"
      :visible.sync="inviteVisible"
      width="30%"
      :before-close="handleInviteClose">
      <div style="text-align: center">
        <a :href="invite.url" style="font-weight: bold; font-size: 22px;">https://dongketech.com/#/registered</a>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button id="copy_url" type="primary" :data-clipboard-text="invite.url" @click="handleCopy">Copy</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import { debounce } from '@/utils'
import { getGoodsServiceList, getGoodsActivationByCode, getGk } from '@/api/service'

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
        type: '1',
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
      inviteVisible: false,
      codeList: [{
        code: ''
      }],
      invite: {
        url: 'https://dongketech.com/#/registered?' + window.btoa('type')
      },
      typeList: [
        {
          value: '1',
          label: 'ALL'
        },
        {
          value: '2',
          label: 'Invitation'
        },
        {
          value: '3',
          label: 'Binding'
        }
      ]
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
    handleClose() {
      this.handleCancel()
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
    },
    // 关闭invite弹框
    handleInviteClose() {
      this.inviteVisible = false
    },
    // 复制链接
    handleCopy() {
      const clipboard = new Clipboard('#copy_url')
      clipboard.on('success', e => {
        this.$message.success('Copy successfully！')
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        this.$message.warning('This browser does not support automatic copy！')
        clipboard.destroy()
      })
    },
    handleInvite() {
      this.inviteVisible = true
      getGk().then(res => {
        if (res.code === 200) {
          const key = res.data.key1 + '-' + res.data.key2
          this.invite.url += key
        } else {
          this.$message.error(res.message)
        }
      })
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
    max-height: 560px;
    overflow-y: auto;
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
