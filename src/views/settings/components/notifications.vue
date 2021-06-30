
<template>
  <div class="notifications-box">
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column label="Store name" prop="store_name" show-overflow-tooltip />
      <el-table-column label="Store Url" prop="store_url" />
      <el-table-column label="Platform" prop="platform" />
      <el-table-column label="Notifation Customer" prop="notifation_customer">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.notifation_customer == '2' ? 'Enabled' : 'Disabled'" placement="top">
            <el-switch
              v-model="scope.row.notifation_customer"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="2"
              inactive-value="1"
              @change="(value) => statusChange(value, scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
  </div>
</template>
<script>
import { notifationstore } from '@/api/notifications'
import { shopList } from '@/api/shop'
export default {
  name: 'notifications',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  props: {},
  data() {
    return {
      formQuery: {},
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      tableData: [],
      loading: false
    }
  },
  computed: {},
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
    statusChange(is_use, row) {
      console.log(is_use)
      notifationstore({ id: row.id, notifation_customer: is_use }).then(res => {
        console.log(res.data)
        if (res.code === 200) {
          this.$message.success('Change Status Success!')
          // this.Inquire()
        } else {
          this.$message.error('Change error, please try again later!')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped>
.notifications-box {
  padding: 20px;
}
</style>
