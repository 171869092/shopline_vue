<template>
  <el-dialog
    class="dialog-border"
    :visible.sync="dialogVisible"
    width="1000px"
    :title="title"
    :append-to-body="true"
    :modal-append-to-body="true"
    @open="handleOpen"
    @close="handleClosed"
  >
    <div>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        height="500"
        style="width: 100%"
        class="cursor_p"
        row-class-name="cursor_p"
        @current-change="clickChange"
        @row-dblclick="dblclickChange"
      >
        <el-table-column label="选择" width="55">
          <template slot-scope="scope">
            <el-radio v-model="tableSelected" :label="scope.row"><i /></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="sku" label="SKU编码" header-align="center" align="center" />
        <el-table-column prop="sku_name" label="SKU别名" header-align="center" align="center" />
        <el-table-column prop="url" label="SKU图片" header-align="center" align="center">
          <template slot-scope="scope">
            <el-image class="sku_image" :src="scope.row.url">
              <div slot="error" class="image-slot">
                <i class="error-icon el-icon-picture-outline" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="sale_price" label="售卖价格" header-align="center" align="center" />
        <el-table-column prop="service_fee" label="服务费" header-align="center" align="center" />
      </el-table>
      <!-- <pagination
        :total="listQuery.total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="Inquire"
      /> -->
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="handleClosed()">Hosting</el-button>
      <el-button size="small" @click="handleClosed()">Cancel</el-button>
      <el-button size="small" type="primary" @click="submit('goodsForm')">Done</el-button>
    </span>
  </el-dialog>
</template>
<script>
// import { productSku } from '@/api/commodity'
// import Pagination from '@/components/Pagination'
export default {
  name: 'unhosting-products',
  components: {
    // Pagination
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Unhosting Products'
    },
    flag: {
      type: String,
      default: 'view'
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formInline: {
        sku: '',
        sku_name: ''
      },
      tableData: [],
      tableSelected: '',
      listQuery: {
        page: 1,
        limit: 10,
        total: 0
      },
      loading: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(newVal, oldVal) {
        this.$emit('update:visible', newVal)
      }
    }
  },
  watch: {
    flag: {
      handler(type) {
        if (type === 'edit') {
          this.isDisabled = false
          this.showClose = true
        } else {
          this.isDisabled = true
          this.showClose = false
        }
      },
      immediate: true
    },
    formData: {
      handler(data) {
        this.form = data
      },
      deep: true
    }
  },
  mounted() {
    // this.Inquire()
  },
  methods: {
    handleOpen() {
      this.Inquire()
    },
    onSearch() {
      this.Inquire()
    },
    // 查询
    Inquire() {
      this.loading = true
      const formData = {
        ...this.formInline
      }
      formData.iDisplayLength = this.listQuery.limit
      formData.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      // productSku(formData)
      //   .then((res) => {
      //     if (res.code === 200) {
      //       setTimeout(() => {
      //         this.loading = false
      //         this.tableData = res.data
      //         this.listQuery.total = +res.total.totalCount
      //       }, 300)
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //   })
    },
    clickChange(item) {
      this.tableSelected = item
    },
    dblclickChange(row, column, event) {
      const data = Object.assign({}, row)
      this.$emit('close', data)
      this.dialogVisible = false
    },
    submit() {
      const data = Object.assign({}, this.tableSelected)
      this.$emit('close', data)
      this.dialogVisible = false
    },
    handleClosed() {
      // this.$refs['formInline'].resetFields()
      this.formInline = {
        sku: '',
        sku_name: ''
      }
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.rowClass {
  cursor: pointer;
}
</style>
