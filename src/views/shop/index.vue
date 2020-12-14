<template>
  <div class="my-shop">
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
        <el-table-column label="Shop Type">
          <template slot-scope="scope">
            <span class="primary pointer" @click="toLink(scope.row)">{{ scope.row.thirdParty_order_on }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Shop url">
          <template slot-scope="scope">
            <div>{{ scope.row.total_price }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <div>{{ orderStatus[scope.row.order_status] }}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: '',
  props: {},
  data() {
    return {
      tableData: [],
      loading: false
    }
  },
  computed: {},
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.my-shop {
  padding: 30px;
}
</style>
