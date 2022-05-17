<template>
  <div class="vendors">
    <el-card class="box-card">
      <div class="flexbox mb20">
        <div>
          <el-input
            v-model="formInline.title"
            prefix-icon="el-icon-search"
            placeholder="Filter vendors"
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
              :value="String(idx + 1)"
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
      >
        <!-- <el-table-column type="selection" /> -->
        <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
          <template slot-scope="scope">
            <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
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
import { getAllProductList } from '@/api/product'
export default {
  name: 'vendors',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  data() {
    return {
      // 列表表头
      labelList: [
        { label: 'vendor', value: 'id', width: '500' },
        { label: 'phone', value: 'status' },
        { label: 'address', value: 'stock' }
      ],
      tableData: [],
      statusOptions: ['Active', 'Draft'],
      loading: false,
      submitLoading: false,
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      formInline: {
        title: '',
        status: ''
      }
    }
  },
  created() {
    this.Inquire()
  },
  methods: {
    // 查询
    Inquire() {
      this.loading = true
      const formData = JSON.parse(JSON.stringify(this.formInline))
      formData.iDisplayLength = this.listQuery.limit
      formData.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      getAllProductList(formData).then(res => {
        if (res.code === 200) {
          res.data.map(item => {
            item.status = item.status === '1' ? 'Active' : 'Draft'
          })
          this.tableData = res.data
          this.listQuery.total = +res.iTotalRecords
          this.loading = false
        }
      })
    },
    filterOrders: debounce(function() {
      this.listQuery.page = 1
      this.Inquire()
    }, 1000)
  }
}
</script>
<style lang="scss" scoped>
.vendors{
   margin: 20px 30px!important;
    .button-border{
      border: 1px solid #ef6f38;
      color:  #ef6f38;
    }
}
</style>
