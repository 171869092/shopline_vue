<template>
  <div class="product">
    <div class="clearfix">
       <el-button type="primary" size="small" class="f-r mr50 mt20" @click="productAdd('add')">Add products</el-button>
       <el-button size="small" class="f-r mr50 mt20 button-border" @click="providerClick">Vendor</el-button>     
    </div>
    <el-card class="box-card">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        fit
        :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
        @selection-change="productChange"
      >
        <el-table-column type="selection" />
        <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
          <template slot-scope="scope">
            <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
            <span v-if="item.type == 'product'" @click="productAdd('edit',scope.row.title,scope.row.id)" style="color:#ef6f38" class="pointer">
              <img :src="scope.row.img_url" width="50px" alt="">
              <span class="ml20">{{ scope.row.title }}</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
    </el-card>
       <provider :visible="providerVisible" @providerAdd="closeprovider" />
  </div>
</template>
<script>
import { getProductList } from '@/api/product'
export default {
  name: 'product',
  components: {
    Pagination: () => import('@/components/Pagination'),
    provider: () => import('./component/provider'),
  },
  data() {
    return {
      // 列表表头
      labelList: [
        { label: 'Product', value: 'id', type: 'product' ,width:'500'},
        { label: 'State', value: 'status' },
        { label: 'Inventory', value: 'stock' },
        { label: 'Type', value: 'type' },
        { label: 'Manufacturer', value: 'manufacturer' },
        { label: 'Operation', type: 'operation' }
      ],
      tableData: [],
      productSelection: [],
      loading: false,
      providerVisible: false,
      providerTitle: 'Vendor',
      listQuery:{
        total:0,
        page:1,
        limit:10
      },
      formInline:{}
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
      getProductList(formData).then(res => {
        if (res.code == 200) {
            res.data.map(item =>{
              item.status = item.status == '1' ? 'Active' : 'Draft'
            })
            this.tableData = res.data
            this.listQuery.total = +res.iTotalRecords
            this.loading = false
        }
      })
    },
    productChange(val) {
        this.productSelection = val;
    },
    productAdd(type,title,id){
       this.$router.push({ name: 'productDetails', query: { type: type,title:title,id:id}})
    },
   
    //选择服务商
    providerClick(type) {
      this.providerVisible = true
    },
    closeprovider(type) {
      if (type != 1) {
        this.Inquire()
      }
      this.providerVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.product{
   .box-card{
      margin: 20px 30px!important;
    }
    .button-border{
      border: 1px solid #ef6f38;
      color:  #ef6f38;
    }
}
</style>
