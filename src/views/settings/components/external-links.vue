<template>
  <div class="external-links-box">
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      fit
      stripe
      :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}">
      <el-table-column label="Title">
        <template slot-scope="scope">
          <div>{{ scope.row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Links">
        <template slot-scope="scope">
          <span>{{ scope.row.store_url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation">
        <template slot-scope="scope">
          <span>{{ scope.row.operation }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'external-links',
  data() {
    return {
      tableData: [
        {
          title: '物流查询',
          store_url: 'www.dkwuliuchaxun.com',
          operation: 'copy'
        },
        {
          title: '售后申请',
          store_url: 'www.dkshoushenqing.com',
          operation: 'copy'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.external-links-box {
  min-height: 800px;
  background-color: #fff;
  padding: 20px;
}
</style>
