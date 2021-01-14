<template>
  <el-dialog
    class="dialog-border"
    width="1200px"
    :visible.sync="dialogVisible"
    :title="title"
    :append-to-body="true"
    :modal-append-to-body="true"
    @open="handleOpen"
    @close="handleClosed"
  >
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      height="500"
      style="width: 100%"
      :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="img" label="Pic" width="100">
        <template slot-scope="scope">
          <el-image class="sku_image" :src="scope.row.img" @click.native="openPrint(row, rowIndex)">
            <div slot="error" class="image-slot">
              <i class="error-icon el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="Products" />
      <el-table-column prop="variants" label="Variants" align="center" width="90" />
      <el-table-column prop="store_name" label="Store" align="center" width="150" />
      <el-table-column prop="sku_price" label="Price" align="center" width="100" />
      <el-table-column prop="service_name" label="Vendor" align="center" width="120" />
      <el-table-column prop="country" label="Country" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.country | formatString }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination
        :total="listQuery.total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="Inquire"
      /> -->
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="hosting()">Hosting</el-button>
      <el-button size="small" @click="handleClosed()">Cancel</el-button>
      <el-button size="small" type="primary" :loading="submitLoading" @click="submit('goodsForm')">Done</el-button>
    </span>
    <hosting :visible.sync="hostingVisible" @select="selectProducts" />
  </el-dialog>
</template>
<script>
import { getOrderGoods, orderJoinQueue } from '@/api/orders'
// import Pagination from '@/components/Pagination'
import Hosting from './hosting'
export default {
  name: 'unhosting-products',
  components: {
    // Pagination,
    Hosting
  },
  filters: {
    formatString(val) {
      if (Array.isArray(val)) {
        return val.toString()
      }
    }
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
    ordersId: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formInline: {},
      tableData: [],
      tableSelected: '',
      listQuery: {
        page: 1,
        limit: 10,
        total: 0
      },
      loading: false,
      hostingVisible: false,
      selectedProduct: [],
      submitLoading: false
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
      // formData.orders_id = '13669,13668,13666,13665,13664,13663'
      // console.log(this.ordersId)
      formData.orders_id = this.ordersId.toString()
      formData.iDisplayLength = this.listQuery.limit
      formData.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      getOrderGoods(formData)
        .then((res) => {
          if (res.code === 200) {
            setTimeout(() => {
              this.loading = false
              this.tableData = res.data
              this.listQuery.total = +res.total.totalCount
            }, 300)
          }
        })
        .catch((err) => {
          console.log(err)
        }).finally(() => {
          this.loading = false
        })
    },
    handleSelectionChange(val) {
      // this.selectedProduct = val.map(i => i.id)
      this.selectedProduct = val
      console.log(this.selectedProduct)
    },
    hosting() {
      if (this.selectedProduct.length > 0) {
        this.hostingVisible = true
      } else {
        this.$message.warning('Please choose product first!')
      }
    },
    selectProducts(data) {
      console.log(data)
      this.selectedProduct.forEach(ele => {
        this.$set(ele, 'service_id', data.service_id)
        this.$set(ele, 'service_name', data.service_name)
        this.$set(ele, 'country', data.country)
        // ele.service_id = data.service_id
        // ele.service_name = data.service_name
        // ele.country = data.country
      })
      console.log('tableData', this.tableData)
    },
    submit() {
      if (this.selectedProduct.length > 0) {
        this.submitLoading = true
        orderJoinQueue({ goods: this.selectedProduct, orders_id: this.ordersId.toString() }).then(res => {
          console.log(res.data)
          if (res.code === 200) {
            this.submitLoading = false
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.submitLoading = false
        })
      } else {
        this.$message.warning('Please select the product after hosting!')
      }
    },
    handleClosed() {
      // this.$refs['formInline'].resetFields()
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
