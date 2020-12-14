<template>
  <div class="my-shop">
    <div class="shop-btn-group">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="ConnectShop">Connect New Shop</el-button>
    </div>
    <el-card class="box-card">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        fit
        stripe
        :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}"
      >
        <el-table-column label="Shop ID">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Shop Url">
          <template slot-scope="scope">
            <div>{{ scope.row.store_url }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Create Time">
          <template slot-scope="scope">
            <div>{{ scope.row.create_time | parseTime }}</div>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
    </el-card>
  </div>
</template>
<script>
import { shopList } from '@/api/shop'
// import { install } from '@/api/user'
export default {
  name: 'shop',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  props: {},
  data() {
    return {
      tableData: [],
      formQuery: {
        iDisplayStart: 0,
        iDisplayLength: 10
      },
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      loading: false
    }
  },
  computed: {
    uid() {
      return this.$store.getters.uid
    }
  },
  created() {
    this.Inquire()
  },
  methods: {
    Inquire() {
      this.loading = true
      this.formQuery.iDisplayLength = this.listQuery.limit
      this.formQuery.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      shopList(this.formQuery).then(res => {
        console.log(res.data)
        if (res.code === 200) {
          this.tableData = res.data.data
          this.listQuery.total = +res.data.pagination.totalCount
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // loading.close()
        this.loading = false
      })
    },
    ConnectShop() {
      // https://fdapi.dongketech.com/site/install?shop=live-by-test.myshopify.com
      this.$prompt('Shopify Store URL', 'Connect New Shop', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        inputPattern: /.myshopify.com/,
        inputErrorMessage: 'The entered store url is incorrect',
        inputPlaceholder: 'xxxx.myshopify.com'
      }).then(({ value }) => {
        window.open(`https://fdapi.dongketech.com/l?shop=${value}&uid=${this.uid}`)
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.my-shop {
  padding: 30px;
}
.shop-btn-group {
  margin-bottom: 20px;
}
</style>
