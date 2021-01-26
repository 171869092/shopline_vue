<template>
  <div class="edit-faq">
    <div class="mt20 mr30">
      <div class="flexbox justify-flex-end">
        <el-button type="primary" icon="el-icon-plus" size="small" class="f-r mr50 mt20 mb20" @click="productAdd('add')">Add FAQ</el-button>
      </div>
    </div>
    <el-card v-loading="tabloading" class="dataloading box-card min_height">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        fit
        :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
      >
        <el-table-column v-for="(item,idx) in labelList" :key="idx" :index="idx" :label="item.label" :prop="item.value" :width="item.width">
          <template slot-scope="scope">
            <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
            <span v-if="item.type === 'Operating'">
              <el-button type="primary" size="small" icon="el-icon-edit" />
              <el-button type="danger" size="small" icon="el-icon-delete" />
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'edit-faq',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  data() {
    return {
      // 列表表头
      labelList: [
        { label: 'Product', value: 'id' },
        { label: 'Status', value: 'status' },
        { label: 'Inventory', value: 'stock' },
        { label: 'Operating', type: 'Operating' }
      ],
      tableData: [
        { id: '111' }
      ],
      productSelection: [],
      loading: false,
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      formInline: {
        store_url: '',
        title: '',
        status: ''
      }
    }
  },
  created() {
    this.storeList()
  },
  methods: {
    // 查询
    Inquire() {
      this.loading = true
      const formData = JSON.parse(JSON.stringify(this.formInline))
      formData.iDisplayLength = this.listQuery.limit
      formData.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      // getStoreProductList(formData).then(res => {
      //   if (res.code === 200) {
      //     this.tableData = res.data
      //     this.listQuery.total = +res.iTotalRecords
      //     this.loading = false
      //   }
      // })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
