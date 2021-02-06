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
      <el-button size="small" type="primary" @click="selectProducts()">Hosting</el-button>
      <el-button size="small" @click="handleClosed()">Cancel</el-button>
      <el-button size="small" type="primary" :loading="submitLoading" @click="done()">Done</el-button>
    </span>
    <hosting :visible.sync="hostingVisible" @select="hosting" />
    <el-dialog title="Hosting products" :visible.sync="tipDialogVisible" :append-to-body="true" width="30%" class="dialog-border">
      <div>
        The following are the products that will be hosted:
      </div>
      <ul class="confirm-del-list mt20">
        <li v-for="(item, k) in selectedProduct" :key="k">
          <strong>{{ item.title }}</strong> hosted to <strong>{{ item.service_name }}</strong>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="tipDialogVisible = false">Cancel</el-button>
        <el-button size="small" type="primary" @click="submit()">OK</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { orderJoinQueue } from '@/api/orders'
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
    list: {
      type: Array,
      default: () => []
    },
    ordersId: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableData: [],
      tableSelected: '',
      selectedProduct: [],
      loading: false,
      isHosting: false,
      hostingVisible: false,
      submitLoading: false,
      tipDialogVisible: false
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
    list: {
      handler(data) {
        this.tableData = data
      },
      deep: true
    }
  },
  methods: {
    handleOpen() {
      // this.Inquire()
    },
    handleSelectionChange(val) {
      console.log(val)
      // this.selectedProduct = val.map(i => i.id)
      if (val.length > 0) {
        this.selectedProduct = val
      } else {
        this.selectedProduct = []
        this.isHosting = false
      }
    },
    hosting(data) {
      this.selectedProduct.forEach(ele => {
        this.$set(ele, 'service_id', data.service_id)
        this.$set(ele, 'service_name', data.service_name)
        this.$set(ele, 'country', data.country)
      })
      this.isHosting = true
    },
    selectProducts() {
      if (this.selectedProduct.length > 0) {
        this.hostingVisible = true
      } else {
        this.$message.warning('Please choose product first!')
      }
    },
    done() {
      if (this.selectedProduct.length > 0) {
        let hasHosting = true
        try {
          this.selectedProduct.forEach(item => {
            if (!item.service_name) {
              hasHosting = false
              throw new Error('There are unmanaged products in the selection.')
            }
          })
        } catch (error) {
          this.$message.warning(error.message)
        }
        if (hasHosting) {
          this.tipDialogVisible = true
        }
      } else {
        this.submitLoading = true
        orderJoinQueue({ orders_id: this.ordersId.toString(), type: '2' }).then(res => {
          console.log(res.data)
          if (res.code === 200) {
            this.$message.success(res.message)
            this.dialogVisible = false
            this.$emit('close', true)
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.submitLoading = false
        })
      }
    },
    submit() {
      this.tipDialogVisible = false
      this.submitLoading = true
      orderJoinQueue({ goods: this.selectedProduct, orders_id: this.ordersId.toString(), type: '1' }).then(res => {
        console.log(res.data)
        if (res.code === 200) {
          this.$message.success(res.message)
          this.dialogVisible = false
          this.$emit('close', true)
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.isHosting = false
        this.submitLoading = false
      })
    },
    handleClosed() {
      // this.$refs['formInline'].resetFields()
      this.dialogVisible = false
      this.isHosting = false
    }
  }
}
</script>
<style lang="scss" scoped>
.rowClass {
  cursor: pointer;
}
</style>
