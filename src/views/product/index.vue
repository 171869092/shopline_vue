<template>
  <div class="product">
    <div class="clearfix">
       <el-button type="primary" icon="el-icon-plus" size="small" class="f-r mr50 mt20" @click="productAdd('add')">Add products</el-button>
       <el-button size="small" type="danger" class="f-r mr30 mt20" @click="CancleHostClick">Cancle Hosting</el-button>    
       <el-button size="small" class="f-r mr30 mt20 button-border" @click="providerClick">Hosting</el-button>   
         
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
            <span v-if="item.type == 'product'" @click="productAdd('edit',scope.row.title,scope.row.id)" style="color:#ef6f38" class="pointer f-l ml50">
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
import { getProductList ,getProductService ,getCancelHosting} from '@/api/product'
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
        { label: 'Status', value: 'status' },
        { label: 'Inventory', value: 'stock' },
        { label: 'Type', value: 'type' },
        { label: 'Hosting', value: 'service_name' },
        // { label: 'Operating', type: 'Operating' }
      ],
      tableData: [],
      productSelection: [],
      loading: false,
      providerVisible: false,
      providerTitle: 'Hosting',
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
   
    //托管
    providerClick(type) {
      if(this.productSelection.length == 0) return  this.$message({message: 'Please check the product before proceeding',type: 'warning'});
      this.providerVisible = true
    },
    closeprovider(type) {
      if (type != 1) {
        this.Inquire()
      }
      this.providerVisible = false
    },
    // 取消托管
    CancleHostClick(){
         if(this.productSelection.length == 0) return  this.$message({message: 'Please check the product before proceeding',type: 'warning'});
         this.$confirm(`Are you sure to cancel hosting？`, 'Cancle Hosting', {
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            type: 'warning'
          })
            .then(() => {
              const productObj = {}
              productObj.product_list = this.productSelection.map(item =>{
                  return {
                    id:item.id,
                  }
                })
                getCancelHosting(productObj).then(res => {
                  if (res.code == 200) {
                    this.$message({ message: res.message, type: 'success' })
                    this.Inquire()
                  }else{
                      this.$message({message: res.message,type: 'warning'});
                    }
                })
            }).catch(() => {})
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
