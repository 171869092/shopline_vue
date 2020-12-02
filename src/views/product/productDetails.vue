<template>
  <div class="productDetails">
     <el-form :model="formData" :rules="formRule" ref="formData" label-width="80px">
       <div class="box-card">
           <el-button size="small" class="" icon="el-icon-back" @click="productBack"></el-button>
           <label class="ml20">{{$route.query.name}}</label>
            <el-button type="primary" class="f-r mr50">Submit</el-button>
       </div>
        <el-card class="box-card">
              <el-form-item label="title:" prop="title">
                <el-input v-model="formData.title" placeholder="产品标题" />
              </el-form-item>
              <el-form-item label="describe:" prop="title">
                  <tinymce v-model="formData.description" :height="250" ref="tinymces"/>
              </el-form-item>
        </el-card>
        <el-card class="box-card mt5">
              <div slot="header" class="clearfix hidden">
                <div class="f-l"><span style="color:red">*</span><label>media:</label></div>
              </div>
              <el-upload
                action="https://getman.cn/echo"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
        </el-card> 
        <!-- 商品 -->
        <el-card class="box-card mt10">
                <div slot="header" class="clearfix">
                   <div class="f-l"><span style="color:red">*</span><label>sku:</label></div>
                  <el-button class="f-r" type="primary" icon="el-icon-plus" size="small" @click="addSkuData()">Add SKU</el-button>
                </div>
                <el-table
                  ref="multipleTable"
                  :data="formData.sub_sku"
                  border
                  stripe
                  style="width: 100%">
                  <el-table-column type="index" width="120" label="Serial number" />
                  <el-table-column label="Color" prop="Color">
                    <template slot-scope="scope">
                      <el-form-item class="mb0" label-width="0">
                        <el-input v-model="scope.row.Color"  size="mini" class="p5_input" placeholder="Color" />
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column label="Size" prop="Size">
                    <template slot-scope="scope">
                      <el-form-item class="mb0" label-width="0" :prop="`sub_sku.${scope.$index}.Size`" :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                        <el-input v-model="scope.row.Size" clearable size="mini" class="p5_input" placeholder="Size" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="Price" prop="Price">
                    <template slot-scope="scope">
                      <el-form-item class="mb0" label-width="0" :prop="`sub_sku.${scope.$index}.Price`" :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                        <el-input v-model="scope.row.Price" clearable size="mini" class="p5_input" placeholder="Price" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="Number" prop="sku_weight">
                    <template slot-scope="scope">
                      <el-form-item class="mb0" label-width="0" :prop="`sub_sku.${scope.$index}.Number`" :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                        <el-input-number v-model="scope.row.Number" class="p5_input" size="mini"  :min="1" controls-position="right"></el-input-number>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="SKU" prop="SKU">
                    <template slot-scope="scope">
                      <el-form-item class="mb0" label-width="0" :prop="`sub_sku.${scope.$index}.SKU`" :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                        <el-input v-model="scope.row.SKU" size="mini" clearable class="p5_input" placeholder="SKU" />
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
  </div>
</template>
<script>
export default {
  name: 'productDetails',
  components: {
     Tinymce:()=>import("@/components/Tinymce"),
  },
  data() {
    return {
      formData:{
        sub_sku:[
          {
            Price:'',
            Color:'',
            SKU:'',
            Size:'',
            Number:''
          }
        ]
      },
      formRule:{},
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created() {
  },
  methods:{
    //新增
    addSkuData() {
      // console.log(num)
      this.formData.sub_sku.push(
        this.$options.data().formData.sub_sku[0]
      )
    },
    // 删除
      delSkuData(index, row) {
      this.$confirm(`请确认是否删除SKU-${index + 1}，删除后无法恢复，请小心操作`, '删除SKU', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.formData.sub_sku.splice(index, 1)
        })
        .catch(() => {})
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },
    //返回
    productBack(){
       this.$router.push({ name: 'product'})
    }
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
}
</style>
