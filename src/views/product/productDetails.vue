<template>
  <div class="productDetails">
     <el-form :model="formData" :rules="formRule" ref="formData" label-width="140px">
        <div class="box-card"> 
            <el-button size="small" class="button-border" icon="el-icon-back" @click="productBack"></el-button>
            <label class="ml20">{{$route.query.title}}</label>
            <el-button type="primary" class="f-r" @click="Submit" :loading="SubmitLoading">Submit</el-button>
            <el-button  class="f-r mr20 button-border" v-if="$route.query.type == 'edit'" @click="ProductDelete">Delete product</el-button>
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
                  <tinymce v-model="formData.describe" :height="300" ref="tinymces"/>
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
          <print-popover :list="formData.images" ref="window_img" @delImg="delImg"></print-popover>
          
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
                       <el-image :src="scope.row.sku_image" @click.native="openPrint(scope.row,scope.$index)" style="height: 50px;width:50px"></el-image>
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
import { getProductEdit,getProductSave,getProductDelete,getDeleteSku} from '@/api/product'
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
      uploadPrintvisible:false,
      editPrintIdx:''
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
                  url:item.url,
                  is_hover:false,
                  id:item.id
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
    // 删除sku
    delSkuData(index, row) {
      console.log(row);
      this.$confirm(`Are you sure you want to delete SKU-${index + 1}？`, 'Delete SKU', {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          if (row.id) {
             getDeleteSku({id:row.id}).then(res =>{
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
     // 删除商品
    ProductDelete() {
      this.$confirm(`Are you sure you want to delete this product？`, 'Delete Product', {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
             getProductDelete({prodcut_list:[{id:this.$route.query.id}]}).then(res =>{
                if (res.code == 200) {
                   this.$message({message: res.message,type: 'success'});
                    this.$router.push({ name: 'product'})
                }
             })
        })
        .catch(() => {
          console.log('出错')
        })
    },
    //返回
    productBack(){
       this.$router.push({ name: 'product'})
    },
     // 关闭  图片编辑 sku
    closePrint(type){
      if (type == 1) return this.printvisible = false
      this.formData.images = type.list.map(item =>{
          return {
            url:item.url,
            is_hover:false,
          }
      })
      this.printvisible = false
      this.$set(this.formData.sku_list[this.editPrintIdx],'sku_image',type.check[0].url)
    },
    // 打开  图片编辑 sku
    openPrint(item,idx){
      this.editPrintIdx = idx
      this.editPrintUpload = true
      this.printvisible = true
    },
    // 打开本地上传 橱窗
    openUploadPrint(){
      this.uploadPrintvisible = true
    },
     // 关闭本地上传 橱窗
    closeUploadPrint(type){
      if(type == 1) return this.uploadPrintvisible = false
       this.uploadPrintvisible = false
       let list = type.map(item =>{
         return {
            url:item,
            is_hover:false
         }
       })
       this.formData.sku_list.push(...list)
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
