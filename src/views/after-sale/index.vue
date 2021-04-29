<template>
  <div class="after-sale">
    <el-card class="box-card">
      <el-tabs v-model="formQuery.status" @tab-click="handleClick">
        <div class="flexbox justify-space-between">
          <div class="filter-control flexbox mb20">
            <div class="filter-item">
              <el-input
                v-model="formQuery.order_name"
                clearable
                class="w-400"
                prefix-icon="el-icon-search"
                placeholder="Filter After Sale"
                @change="filterAfter"
              />
            </div>
            <div class="filter-item w-250">
              <el-select
                v-model="formQuery.status"
                collapse-tags
                placeholder="Ship status"
                style="width:100%"
                @change="filterAfterStatus"
              >
                <el-option
                  v-for="(item, key) in afterStatus"
                  :key="key"
                  :label="item"
                  :value="key"
                />
              </el-select>
            </div>
            <div class="filter-item w-250">
              <el-select
                v-model="formQuery.store_url"
                clearable
                style="width:100%"
                placeholder="Select Store"
                @change="filterStoreUrl"
              >
                <el-option
                  v-for="(item, key) in storeList"
                  :key="key"
                  :label="item.store_url"
                  :value="item.store_url"
                />
              </el-select>
            </div>
          </div>
        </div>
        <el-button type="primary" size="small" class="mb10" @click="complete">After sales</el-button>
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
            <el-table-column label="Order">
              <template slot-scope="scope">
                <span class="primary pointer" @click="toLink(scope.row)">{{ scope.row.order_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Store">
              <template slot-scope="scope">
                <div>{{ scope.row.store_url }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Total">
              <template slot-scope="scope">
                <div>{{ scope.row.total }}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="Cost">
              <template slot-scope="scope">
                <div>{{ scope.row.cost }}</div>
              </template>
            </el-table-column> -->
            <el-table-column label="State">
              <template slot-scope="scope">
                <span>{{ scope.row.state }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Status">
              <template slot-scope="scope">
                <span>{{ scope.row.status }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Vendor">
              <template slot-scope="scope">
                <span>{{ scope.row.vendor }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Payment Time">
              <template slot-scope="scope">
                <span>{{ scope.row.payment_time }}</span>
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
import Sticky from '@/directive/fix-table-header'
import { getStoreList } from '@/api/product'
import { afterSalesList, afterSalesChanngedStatus } from '@/api/after'
export default {
  name: 'after-sale',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  directives: { Sticky },
  props: {},
  data() {
    return {
      queryForm: {
        order_name: '',
        store_url: '',
        order_status: [],
        logistics_status: []
      },
      formQuery: {
        // order_name: '',
        // order_status_client: '',
        status: '',
        store_url: '',
        iDisplayStart: 0,
        iDisplayLength: 10
      },
      listQuery: {
        total: 0,
        page: 0,
        limit: 10
      },
      afterStatus: { 0: 'ALL',1: 'Pending', 2: 'In Processing', 3: 'Completed' },
      tabList: [
        { label: 'ALL', name: '0' },
        { label: 'Pending', name: '1' },
        { label: 'In Processing', name: '2' },
        { label: 'Completed', name: '3' }
      ],
      labelList: [
        { label: 'Third Party Order Number', value: 'thirdParty_order_on', type: 'order_no' }
      ],
      tableData: [],
      selectRows: [],
      selectAfter: [],
      loading: false,
      storeList: []
    }
  },
  computed: {},
  created() {
    this.init()
    this.Inquire()
  },
  mounted() {},
  methods: {
    init() {
      getStoreList().then(res => {
        if (res.code === 200) {
          this.storeList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    Inquire() {
      this.loading = true
      this.formQuery.iDisplayLength = this.listQuery.limit
      this.formQuery.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      afterSalesList(this.formQuery).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.map((item, index) => {
            item.index = index
            return item
          })
          this.listQuery.total = +res.total
        }
        // console.log(this.tableData)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },

    resetPageLimit() {
      this.listQuery.page = 1
      this.listQuery.limit = 10
    },

    handleClick() {
      this.resetPageLimit()
      this.Inquire()
    },

    filterAfter: debounce(function() {
      // this.formQuery.order_name = this.queryForm.order_name
      this.resetPageLimit()
      this.Inquire()
    }, 500),

    filterAfterStatus: debounce(function() {
      // this.formQuery.order_status = this.queryForm.order_status.toString()
      this.resetPageLimit()
      this.Inquire()
    }, 500),

    filterStoreUrl: debounce(function() {
      // this.formQuery.store_url = this.queryForm.store_url
      this.resetPageLimit()
      this.Inquire()
    }, 500),

    shiftMultiple(selections, row) {
      this.selectAfter = selections.map(item => (item.id))
    },

    // . 选择框数据
    selectAll(selecttion) {
      if (selecttion.length > 0) {
        this.selectAfter = selecttion.map(item => (item.id))
      } else {
        this.selectAfter = []
      }
      console.log('all selectAfter:', this.selectAfter)
    },

    // selectOne(selecttion) {
    //     this.selectAfter = selecttion.map(item => (item.id))
    // },

    // . 跳转售后详情
    toLink(row) {
      this.$router.push({ name: 'after-detail', query: { type: 'edit', id: row.id, order_no: row.order_name }})
    },

    //. complete
    complete() {
        if (this.selectAfter.length < 1){
            this.$message.error('Please select a piece of data')
            return false
        }
        afterSalesChanngedStatus({id: this.selectAfter}).then ( res => {
            let type = ''
            if (res.code == 200){
                type = 'success'
            }else{
                type = 'error'
            }
            this.$message({ message: res.message, type: type })
            // this.$router.go(0)
        }).catch( err => {
            console.log(err)
        }).finally(() => {
            
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.after-sale {
  padding: 30px;
}
.logistics-timeline {
  padding-left: 20px;
}
.filter-control {
  .filter-item {
    &:first-child {
      margin-left: 0;
    }
    margin-left: 15px;
  }
}
</style>
