<template>
  <div class="quoted-box">
    <el-card class="box-card">
      <div class="flexbox mb20">
        <div>
          <el-input
            v-model="formInline.product_title"
            prefix-icon="el-icon-search"
            placeholder="Filter products"
            clearable
            class="w-570"
            @input="filterOrders"
          />
        </div>
        <div>
          <el-select v-model="formInline.status" placeholder="Status" clearable class="ml20" @change="filterOrders">
            <el-option
              v-for="(item,idx) in statusOptions"
              :key="item"
              :label="item"
              :value="idx"
            />
          </el-select>
        </div>
        <div>
          <el-select v-model="formInline.server_id" placeholder="service id" clearable class="ml20" @change="filterOrders">
            <el-option
              v-for="(item,idx) in storeList"
              :key="idx"
              :label="item.service_name"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        empty-text="No Data"
        style="width: 100%"
        highlight-current-row
        fit
        :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
        @selection-change="productChange"
      >
        <el-table-column type="selection" />
        <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
          <template slot-scope="scope">
            <span v-if="item.type === undefined">{{ scope.row[item.value] }}</span>
            <span v-if="item.type === 'image'" @click="productDetails('edit',scope.row)">
              <el-image class="sku_image" style="width: 50px; height: 50px" :src="scope.row.img" fit="cover">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" style="font-size: 30px;" />
                </div>
              </el-image>
            </span>
            <div v-if="item.type === 'product'" style="color:#ef6f38" class="pointer" @click="productDetails('edit',scope.row)">
              <span>{{ scope.row.product_title }}</span>
            </div>
            <div v-if="item.type === 'shop'">
              <span>{{ scope.row.server_id.toString() }}</span>
            </div>
            <div v-if="item.type === 'Operation'">
              <span style="color: #c45354;cursor: pointer;" @click="handleDelete(scope.row)">Delete</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
    </el-card>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { getServiceList, getQuotedList, getQuotedLabel, deleteQuoted } from '@/api/product'

export default {
  name: 'quoted',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  data() {
    return {
      formInline: {
        product_title: '',
        status: '',
        server_id: ''
      },
      statusOptions: [],
      storeList: [],
      productSelection: [],
      // List header
      labelList: [
        { label: '', value: 'img', type: 'image', width: '200' },
        { label: 'Product', value: 'product_title', type: 'product', width: '500' },
        { label: 'Status', value: 'status' },
        { label: 'service', value: 'server_id', type: 'shop' },
        { label: 'Operation', type: 'Operation' }
      ],
      tableData: [],
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.initData()
    this.Inquire()
  },
  methods: {
    // search
    filterOrders: debounce(function() {
      this.listQuery.page = 1
      this.Inquire()
    }, 1000),
    // Get a list of stores
    initData() {
      getServiceList().then(res => {
        if (res.code === 200) {
          this.storeList = res.data
        }
      })
      getQuotedLabel().then(res => {
        if (res.code === 200) {
          this.statusOptions = res.data
        }
      })
    },
    // Multiple choice
    productChange(val) {
      this.productSelection = val
    },
    // Product details page
    productDetails(type, row) {
      this.$router.push({ name: 'quoted-detail', query: { type: type, id: row.id, product_id: row.product_id, storeList: this.storeList }})
    },
    // init list
    Inquire() {
      this.loading = true
      const formData = JSON.parse(JSON.stringify(this.formInline))
      formData.iDisplayLength = this.listQuery.limit
      formData.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      getQuotedList(formData).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.listQuery.total = +res.total
          this.loading = false
        }
      })
    },
    // 根据value获取label
    getLabelOfValue(val, list) {
      const obj = list.find(it => it.value === val)
      if (obj) {
        return obj.label
      } else {
        return val
      }
    },
    // 删除
    handleDelete(row) {
      let server_id = ''
      this.storeList.map(it => {
        if (it.service_name === row.server_id[0]) {
          server_id = it.id
        }
      })
      const arr = []
      arr.push(Number(server_id))
      deleteQuoted({ id: row.id, server_id: arr }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.Inquire()
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.quoted-box {
  margin: 20px 30px !important;
}
</style>
