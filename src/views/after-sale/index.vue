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
        <el-button type="primary" size="small" class="mb10" @click="complete">Completed</el-button>
        <el-button type="primary" size="small" class="mb10 father" :disabled="!unreadCount" @click="handleNew">New information <span v-if="unreadCount" class="son">{{ unreadCount }}</span></el-button>
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
            empty-text="No Data"
            :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}"
            @select="shiftMultiple"
            @select-all="selectAll"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="Order">
              <template slot-scope="scope">
                <span class="primary pointer" @click="toLink(scope.row)">
                  {{ scope.row.order_name }}
                  <img v-if="!scope.row.is_read" class="imgIcon" :src="NewIcon">
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Products">
              <template slot-scope="scope">
                <div>{{ scope.row.product_json }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Update time">
              <template slot-scope="scope">
                <div>{{ scope.row.update_time }}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="Cost">
              <template slot-scope="scope">
                <div>{{ scope.row.cost }}</div>
              </template>
            </el-table-column> -->
<!--            <el-table-column label="After Sales Type">
              <template slot-scope="scope">
                <span>{{ salesType[scope.row.after_type] }}</span>
              </template>
            </el-table-column>-->
            <el-table-column label="After Sales Mode">
              <template slot-scope="scope">
                <span>{{ modeList[scope.row.after_model] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Status">
              <template slot-scope="scope">
                <span v-if="scope.row.status_name === 'Pending'" style="color: #e41b1b">{{ scope.row.status_name }}</span>
                <span v-if="scope.row.status_name === 'Completed'" style="color: #50cd83">{{ scope.row.status_name }}</span>
                <span v-if="scope.row.status_name === 'In process'" style="color: #f6cd46">{{ scope.row.status_name }}</span>
              </template>
            </el-table-column>
<!--            <el-table-column label="Vendor">
              <template slot-scope="scope">
                <span>{{ scope.row.vendor }}</span>
              </template>
            </el-table-column>-->
            <el-table-column label="Source">
              <template slot-scope="scope">
                <span v-if="parseInt(scope.row.type) !== 2 || parseInt(scope.row.is_push) === 3">Vendor ({{ scope.row.vendor }})</span>
                <br />
                <span v-if="parseInt(scope.row.type) === 2">Customer ({{ scope.row.consignee }})</span>
              </template>
            </el-table-column>
            <el-table-column label="Timeline">
              <template slot-scope="scope">
                <span style="color: #f69432;cursor: pointer;" @click="handleTrack(scope.row)">Track</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :visible.sync="timelineVisible"
      width="30%"
      :show-close="false"
    >
      <div>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.date_time"
            placement="top"
            :color="'#f68a1d'">
            <p v-if="activity.status_name === 'completed'" style="color: #43c87a">{{ activity.status_name }}</p>
            <p v-if="activity.status_name === 'In process'" style="color: #f6c219">{{ activity.status_name }}</p>
            <p v-if="activity.status_name === 'Pending'" style="color: #ce3333">{{ activity.status_name }}</p>
            <p>{{ activity.info }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
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
  </div>
</template>
<script>
import { debounce } from '@/utils'
import Sticky from '@/directive/fix-table-header'
import { getStoreList } from '@/api/product'
import { afterSalesList, afterSalesChanngedStatus, afterSalesType, afterSalesTimeline } from '@/api/after'
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
      afterStatus: { 0: 'ALL', 1: 'Pending', 2: 'In process', 3: 'Completed' },
      tabList: [
        { label: 'ALL', name: '0' },
        { label: 'Pending', name: '1' },
        { label: 'In process', name: '2' },
        { label: 'Completed', name: '3' }
      ],
      labelList: [
        { label: 'Third Party Order Number', value: 'thirdParty_order_on', type: 'order_no' }
      ],
      tableData: [],
      selectRows: [],
      selectAfter: [],
      selectAfterList: [],
      loading: false,
      storeList: [],
      salesType: [],
      modeList: {"1": 'Resend', "2": 'Refund', "3": 'Return/Refund', "4": 'Other'},
      product: [],
      timelineVisible: false,
      NewIcon: require('@/assets/home/new.png'), // 我的消息new图标
      unreadCount: 0,
      activities: [],
      dialogVisible: false
    }
  },
  computed: {},
  created() {
    this.init()
    this.Inquire()
    this.getAfterSalesType()
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
            item.product_json = item.product_json.map((da,ik) => {
              return da.sku_name
            }).join(',')
            item.index = index
            return item
          })
          this.listQuery.total = +res.total.totalCount
          this.unreadCount = res.total.unreadCount

          // if (res.data.product_json && res.data.product_json.length > 0) {
          //   console.log(1111)
          //   this.product = res.data.product_json.map((item,idx) => {
          //     console.log('item: ',item)
          //     return item.sku_name
          //   })
          // }else{
          //   this.product = []
          // }
          console.log('product:', this.tableData)
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(() => {
        this.loading = false
      })
    },

    getAfterSalesType() {
      afterSalesType().then(res => {
        if (res.code === 200) {
          this.salesType = res.data
        }
      }).catch(err => {
        console.log(err)
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
      this.selectAfterList = selections
    },

    // . 选择框数据
    selectAll(selecttion) {
      if (selecttion.length > 0) {
        this.selectAfter = selecttion.map(item => (item.id))
        this.selectAfterList = selecttion
      } else {
        this.selectAfter = []
        this.selectAfterList = []
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

    // complete
    complete() {
      if (this.selectAfter.length < 1) {
        this.$message.error('Please select a piece of data')
      } else {
        let isVendor = false,isConsignee = false
        this.selectAfterList.map(item => {
          if (parseInt(item.type) === 2) {
            // 真实买家发起处理
            if (parseInt(item.client_status) !== 3) {
              isConsignee = true
            }
            if (parseInt(item.is_push) === 3 && parseInt(item.status) !== 3) {
              isVendor = true
            }
          } else {
            // C端发起处理
            if (parseInt(item.status) !== 3) {
              isVendor = true
            }
          }
        })
        // const isVendor = vendorList.every(it => it === '')
        // const isConsignee = consigneeList.every(it => it === '')
        if (isVendor === true && isConsignee === true) {
          this.dialogVisible = true
          return
        }
        this.handleComplete(isVendor ? 3 : 4)
      }
    },
    handleComplete(type) {
      afterSalesChanngedStatus({ id: this.selectAfter, status: type }).then(res => {
        let type = ''
        if (res.code === 200) {
          type = 'success'
        } else {
          type = 'error'
        }
        this.dialogVisible = false
        this.$message({ message: res.message, type: type })
        this.selectAfter = []
        this.selectAfterList = []
        this.Inquire()
      }).catch(err => {
        console.log(err)
      }).finally(() => {

      })
    },
    handleNew() {
      this.loading = true
      const formQuery = {
        unread: '1',
        status: this.formQuery.status,
        store_url: this.formQuery.store_url,
        iDisplayLength: this.listQuery.limit,
        iDisplayStart: (this.listQuery.page - 1) * this.listQuery.limit
      }
      afterSalesList(formQuery).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.map((item, index) => {
            item.product_json = item.product_json.map((da, ik) => {
              return da.sku_name
            }).join(',')
            item.index = index
            return item
          })
          this.listQuery.total = +res.total.totalCount
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(() => {
        this.loading = false
      })
    },
    handleTrack(row) {
      const formData = {
        after_id: row.id
      }
      afterSalesTimeline(formData).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.activities = res.data
            this.timelineVisible = true
          } else {
            this.$message.warning('No timeline')
          }
        }
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
.father {
  position: relative;
  .son {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    border-radius: 50%;
    background-color: #f60d0f;
  }
}
.imgIcon {
  width: 30px;
  height: 30px;
  margin-left: 10px;
  margin-top: -8px;
}
</style>
