<template>
  <div class="product">
    <div class="clearfix">
       <el-button type="primary" size="small" class="f-r mr50 mt20" @click="productAdd('add')">Add products</el-button>
    </div>
    <el-card class="box-card">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        fit
        @selection-change="productChange"
      >
        <el-table-column type="selection" />
        <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
          <template slot-scope="scope">
            <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
            <span v-if="item.type == 'product'" @click="productAdd('edit')" style="color:#ef6f38" class="pointer">
              <img :src="scope.row.image" width="50px" alt="">
              <span class="ml20">{{ scope.row.name }}</span>
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
  name: 'product',
  components: {
    Pagination: () => import('@/components/Pagination'),
  },
  data() {
    return {
      // 列表表头
      labelList: [
        { label: '产品', value: 'id', type: 'product' ,width:'300'},
        { label: '状态', value: 'supplier_name' },
        { label: '库存', value: 'mobile' },
        { label: '类型', value: 'wechat_num' },
        { label: '厂商', value: 'address' },
        { label: '操作', type: 'operation' }
      ],
      tableData: [
        { name: 'Autocollant mural décalcomanies', image: 'https://cdn.shopifycdn.net/s/files/1/0482/2024/2081/products/product-image-1526136290_350x350.jpg?v=1602045440' },
        { name: 'Autocollant mural décalcomanies', image: 'https://cdn.shopifycdn.net/s/files/1/0482/2024/2081/products/product-image-1526136290_350x350.jpg?v=1602045440' },
        { name: 'Autocollant mural décalcomanies', image: 'https://cdn.shopifycdn.net/s/files/1/0482/2024/2081/products/product-image-1526136290_350x350.jpg?v=1602045440' },
        { name: 'Autocollant mural décalcomanies', image: 'https://cdn.shopifycdn.net/s/files/1/0482/2024/2081/products/product-image-1526136290_350x350.jpg?v=1602045440' },
        { name: 'Autocollant mural décalcomanies', image: 'https://cdn.shopifycdn.net/s/files/1/0482/2024/2081/products/product-image-1526136290_350x350.jpg?v=1602045440' }

      ],
      productSelection: [],
      loading: false,
      listQuery:{
        total:0,
        page:1,
        limit:10
      }
    }
  },
  created() {
    // this.Inquire()
  },
  methods: {
    // 查询
    Inquire() {
      // this.loading = true
      // const formData = JSON.parse(JSON.stringify(this.formInline))
      // formData.iDisplayLength = this.listQuery.limit
      // formData.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      // supplierDataList(formData).then(res => {
      //   if (res.code == 200) {
      //     setTimeout(() => {
      //       res.data.map(item => {
      //         item.status = item.status == '1' ? '正常' : '暂停'
      //       })
      //       this.tableData = res.data
      //       this.listQuery.total = parseInt(res.total)
      //       this.loading = false
      //     }, 300)
      //   }
      // })
    },
    productChange(val) {
        this.productSelection = val;
    },
    productAdd(type){
       this.$router.push({ name: 'productDetails', query: { type: type,}})
    }
  }
}
</script>
<style lang="scss" scoped>
.product{
   .box-card{
      margin: 20px 30px!important;
    }
}
</style>
