<template>
  <div class="productDetails">
     <el-form :model="formData" :rules="formRule" ref="formData" label-width="140px">
        <div class="box-card"> 
            <el-button size="small" class="button-border" icon="el-icon-back" @click="productBack"></el-button>
            <label class="ml20">{{$route.query.title}}</label>
            <el-button type="primary" class="f-r" @click="Submit" :loading="SubmitLoading">Submit</el-button>
        </div>
        <el-card class="box-card" style="margin-top:500px">
              <el-form-item label="Title:" prop="title">
                <el-input v-model="formData.title" placeholder="Title" />
              </el-form-item>
              <el-form-item label="Product status:" prop="status">
                 <el-select v-model="formData.status" class="w-480"> 
                   <el-option  v-for="(item,idx) in statusOptions" :key="idx" :label="item" :value="String(idx + 1)"></el-option>
                 </el-select>
              </el-form-item>    
              <el-form-item label="Description:" prop="describe">
                  <tinymce v-model="formData.describe" :height="250" ref="tinymces"/>
              </el-form-item>
        </el-card>

        <!-- 橱窗图库： -->
        <el-card class="box-card mt5">
          <div slot="header" class="clearfix hidden">
            <label class="step-jump"><span style="color:red">*</span>Media:</label>
            <div class="f-r">
              <el-button size="mini" type="primary" @click="openUploadPrint">Add image</el-button>
            </div>
          </div>
          <print-popover :list="formData.images" ref="window_img" @delImg="delImg" :popoverStyle="{width:'650px',height:'650px'}"></print-popover>
          
        </el-card>
        <!-- 商品 -->
        <el-card class="box-card mt10">
                <div slot="header" class="clearfix">
                   <div class="f-l"><span style="color:red">*</span><label>Variants:</label></div>
                  <el-button class="f-r" type="primary" icon="el-icon-plus" size="small" @click="addSkuData()">Add SKU</el-button>
                </div>
                <el-table
                  ref="multipleTable"
                  :data="formData.sku_list"
                  border
                  stripe
                  :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
                  style="width: 100%">
                  <el-table-column type="index" width="120" label="Serial number" />
                   <el-table-column label="Picture" prop="sku_image">
                    <template slot-scope="scope">
                      <el-popover v-if="scope.row.sku_image" placement="top" trigger="hover">
                        <el-image slot="reference" :src="scope.row.sku_image" @click="openPrint(scope.row,scope.$index)" alt="加载失败..." style="height: 50px;width:50px"></el-image>
                        <el-image :src="scope.row.sku_image" style="height: 200px;width: 200px"></el-image>
                      </el-popover>
                    </template>
                  </el-table-column> 
                  <el-table-column label="Color" prop="sku_color">
                    <template slot-scope="scope">
                      <el-form-item class="mb0" label-width="0">
                        <el-input v-model="scope.row.sku_color"  size="mini" class="p5_input" placeholder="Color" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="Size" prop="sku_size">
                    <template slot-scope="scope">
                      <el-form-item class="mb0" label-width="0" :prop="`sku_list.${scope.$index}.sku_size`">
                        <el-input v-model="scope.row.sku_size" clearable size="mini" class="p5_input" placeholder="Size" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="Price" prop="sku_price">
                    <template slot-scope="scope">
                      <el-form-item class="mb0" label-width="0" :prop="`sku_list.${scope.$index}.sku_price`" :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                        <el-input v-model="scope.row.sku_price" clearable size="mini" class="p5_input" placeholder="Price">
                           <template slot="prepend">€</template>
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="Quantity" prop="sku_number">
                    <template slot-scope="scope">
                      <el-form-item class="mb0" label-width="0" :prop="`sku_list.${scope.$index}.sku_number`" :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                        <el-input-number v-model="scope.row.sku_number" class="p5_input" size="mini"  :min="1" controls-position="right"></el-input-number>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="SKU" prop="sku">
                    <template slot-scope="scope">
                      <el-form-item class="mb0" label-width="0" :prop="`sku_list.${scope.$index}.sku`" :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                        <el-input v-model="scope.row.sku" size="mini" clearable class="p5_input" placeholder="SKU" />
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column label="Operation" width="120px">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini"  @click="delSkuData(scope.$index, scope.row)">delete</el-button>
                    </template>
                  </el-table-column>
                </el-table>
        </el-card>
   </el-form>
   <edit-print :visible="printvisible" @close="closePrint" :isUpload="editPrintUpload"></edit-print>
   <upload-print :visible="uploadPrintvisible" @close="closeUploadPrint"></upload-print>
  </div>
</template>
<script>
import { getProductEdit,getProductSave,getProductDelete} from '@/api/product'
export default {
  name: 'productDetails',
  components: {
     Tinymce:()=>import("@/components/Tinymce"),
     EditPrint:()=>import("./component/editPrint"),
     PrintPopover:()=>import("./component/printPopover"),
     UploadPrint:()=>import("./component/uploadPrint"),
  },
  data() {
    return {
      formData:{
        sku_list:[
          { 
            sku_image:'',
            sku_color:'',
            sku_size:'',
            sku_price:'',
            sku_number:'',
            sku:''
          }
        ],
        images:[]
      },
      formRule:{
         title: [
            { required: true, message: 'Please enter a title', trigger: 'blur' },
          ],
          status:[
              { required: true, message: 'Please select Product status', trigger: 'change' }
          ]
      },
      statusOptions:['Active','Draft'],
      dialogImageUrl: '',
      SubmitLoading:false,
      dialogVisible: false,
      printvisible:false,
      editPrintUpload:false,
      uploadPrintvisible:false
    }
  },
  created() {
      if (this.$route.query.type == 'edit') {
        this.getForm()
      }
  },
  methods:{
    // 获取草稿数据
    getForm(){
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
       getProductEdit({id:this.$route.query.id}).then(res =>{
          if (res.code == 200) {
            this.formData = res.data
            this.formData.images = res.data.images.map(item =>{
              return {
                  img_url:item.url,
                  is_hover:false
                }
            })
            loading.close();
          }
       })
    },
    //保存数据
    Submit(){
        this.$refs.formData.validate((valid) => {
          if (valid) {
            this.SubmitLoading = true
            getProductSave(this.formData).then(res =>{
              if (res.code == 200) {
                  this.$message({message: res.message,type: 'success'});
                  this.$router.push({ name: 'product'})
              }
            }).finally(()=>{
               this.SubmitLoading = false
            })  
          }
       });
    },
    //新增
    addSkuData() {
      // console.log(num)
      this.formData.sku_list.push(
        this.$options.data().formData.sku_list[0]
      )
    },
    // 删除
    delSkuData(index, row) {
      console.log(row);
      this.$confirm(`请确认是否删除SKU-${index + 1}，删除后无法恢复，请小心操作`, '删除SKU', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (row.id) {
             getProductDelete({id:row.id}).then(res =>{
                if (res.code == 200) {
                   this.$message({message: res.message,type: 'success'});
                    this.formData.sku_list.splice(index, 1)
                }
             })
          }else{
             this.formData.sku_list.splice(index, 1)
          }
        })
        .catch(() => {})
    },
    //返回
    productBack(){
       this.$router.push({ name: 'product'})
    },
     // 关闭  图片编辑
    closePrint(type){
      if(type == 1) return this.printvisible = false 
      // this.$set(this.formData.goods_sku[this.editPrintIdx],'image',type)
      this.printvisible = false
      
    },
    // 打开  图片编辑
    openPrint(item,idx){
      // this.editPrintIdx = idx
      // this.editPrintSku = item.sku
      this.editPrintUpload = true
      // this.formData.goods_sku.image = this.formData.goods_base.image.map(item => item.img_url)
      this.printvisible = true
    },
    // 打开本地上传
    openUploadPrint(){
      this.uploadPrintvisible = true
    },
     // 关闭本地上传
    closeUploadPrint(type){
      if(type == 1) return this.uploadPrintvisible = false
       this.uploadPrintvisible = false
       let list = type.map(item =>{
         return {
            img_url:item,
            is_hover:false
         }
       })
       this.formData.image.push(...list)
    },
      // 删除图片
    delImg(idx){
      this.formData.image.splice(idx,1)
    },
  }
}
</script>
<style lang="scss">
.productDetails{
   .box-card{
      margin: 20px 10%!important;
    }
    .el-form-item__label{
      font-size: 16px!important;
      color: #000!important;
    }
    .button-border{
      border: 1px solid #ef6f38;
      color:  #ef6f38;
    }
}
</style>
