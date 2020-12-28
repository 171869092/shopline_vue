<template>
  <div v-loading="loading" class="productDetails p30">
    <el-row :gutter="20">
      <el-col :span="20" :offset="2">
        <el-form ref="formData" :model="formData" :rules="formRule" label-width="140px" label-position="top">
          <div class="product-header mb20 flexbox justify-space-between">
            <div>
              <el-button size="small" class="button-border" icon="el-icon-back" @click="productBack" />
              <label class="ml20">{{ $route.query.title }}</label>
            </div>
            <div>
              <el-button size="small" type="primary" :loading="SubmitLoading" @click="Submit">Submit</el-button>
              <el-button v-if="$route.query.type == 'edit' && $route.query.stroeType == 'all'" size="small" class="button-border" @click="ProductDelete">Delete product</el-button>
            </div>
          </div>
          <el-card class="box-card">
            <el-form-item label="Title:" prop="title">
              <el-input v-model="formData.title" placeholder="Title" />
            </el-form-item>
            <el-form-item label="Product status:" prop="status">
              <el-select v-model="formData.status" class="w-480">
                <el-option v-for="(item,idx) in statusOptions" :key="idx" :label="item" :value="String(idx + 1)" />
              </el-select>
            </el-form-item>
            <el-form-item label="Description:" prop="describe">
              <tinymce ref="tinymces" v-model="formData.describe" :height="300" />
            </el-form-item>
          </el-card>

          <!-- 橱窗图库： -->
          <el-card class="box-card">
            <div slot="header" class="clearfix hidden">
              <label class="step-jump"><span style="color:red">*</span>Media:</label>
              <div class="f-r">
                <el-button size="mini" type="primary" @click="openUploadPrint">Add image</el-button>
              </div>
            </div>
            <print-popover ref="window_img" :list="formData.images" @delImg="delImg" @update="updateimg" />

          </el-card>
          <!-- 商品 -->
          <el-card class="box-card mt10">
            <div slot="header" class="clearfix">
              <div class="f-l"><span style="color:red">*</span><label>Variants:</label></div>
              <!-- <el-button class="f-r" type="primary" icon="el-icon-plus" size="small" @click="addSkuData()">Add SKU</el-button> -->
            </div>
            <div v-if="$route.query.type === 'add'">
              <el-checkbox v-model="variantsEheck" @change="variantsChage">This product has multiple options, like different sizes or colors</el-checkbox>
              <el-button class="f-r" type="primary" icon="el-icon-plus" size="small" @click="addOption()" v-if="variantsEheck && formData.optionsList.length < 3 ">Add another option</el-button>
            </div>
            <!-- 新增属性 -->
              <el-table
              ref="optionsTable"
              :data="formData.optionsList"
              :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
              style="width: 60%"
              v-if="variantsEheck"
              class="mt20 variantsTabel"
            >
              <el-table-column type="index" width="120" />
              <el-table-column  prop="option" label="Option">
                <template slot-scope="scope">
                  <el-form-item class="mb0" label-width="0" :prop="`optionsList.${scope.$index}.option`">
                  <el-autocomplete
                    class="inline-input"
                     v-model="scope.row.option"
                    :fetch-suggestions="querySearch"
                  ></el-autocomplete>
                    <!-- <el-select v-model="scope.row.option" size="mini" filterable>
                      <el-option  v-for="(item,key) in options" :key="key" :label="item" :value="item"></el-option>
                    </el-select> -->
                  </el-form-item>
                </template>
              </el-table-column>
     
              <el-table-column  prop="optionVlue">
                <template slot-scope="scope">
                  <el-form-item class="mb0" label-width="0" :prop="`optionsList.${scope.$index}.optionVlue`">
                    <el-input-tag  v-model="scope.row.tags" @change="tagsChange"></el-input-tag>
                    <!-- <el-input v-model="scope.row.optionVlue" size="mini" clearable class="p5_input" placeholder="Separate options with a comma"  type="textarea" :rows="2"/> -->
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="Operating" width="120px">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" v-if="formData.optionsList.length > 1" @click="RemoveOption(scope.$index, scope.row)">Remove</el-button>
                </template>
              </el-table-column>
            </el-table>
  <!-- 生成属性 -->
            <div class="f-l mt20"  v-if="variantsEheck && Variantslist.length > 0 && $route.query.type === 'add'"><label>Preview</label></div>
            <el-table
              ref="multipleTable"
              :data="formData.sku_list"
              border
              stripe
              class="mt20"
              :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
              style="width: 100%"
              v-if="variantsEheck && Variantslist.length > 0 ||  $route.query.type === 'edit'"
            >
              <el-table-column type="index" width="120" label="Serial number" />
              <el-table-column label="Picture" prop="sku_image">
                <template slot-scope="scope">
                  <el-image class="sku_image" :src="scope.row.sku_image" @click.native="openPrint(scope.row,scope.$index)">
                    <div slot="error" class="image-slot">
                      <i class="error-icon el-icon-picture-outline" />
                    </div>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column v-for="(d,idx) in Variantslist" :key="idx" :prop="d" :label="d">
                <template slot-scope="scope">
                  <el-form-item :prop="'sku_list.' + scope.$index + '.option.' + d">
                    <el-input v-model="scope.row.option[d]" size="mini" clearable :disabled="$route.query.type === 'add'" class="p5_input" />
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
                    <el-input-number v-model="scope.row.sku_number" class="p5_input" size="mini" :min="1" controls-position="right" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="SKU" prop="sku">
                <template slot-scope="scope">
                  <el-form-item class="mb0" label-width="0" :prop="`sku_list.${scope.$index}.sku`">
                    <el-input v-model="scope.row.sku" size="mini" clearable class="p5_input" placeholder="SKU" />
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column label="Operating" width="120px">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="delSkuData(scope.$index, scope.row)">delete</el-button>
                </template>
              </el-table-column>
            </el-table>
            
          </el-card>
        </el-form>
      </el-col>
    </el-row>
    <edit-print :visible.sync="printvisible" :is-upload="editPrintUpload" :sku-img="skuImage" @close="closePrint" />
    <upload-print :visible.sync="uploadPrintvisible" @close="closeUploadPrint" />
  </div>
</template>
<script>
import { getAllProductEdit, getStoreProductEdit, getAllProductSave, getStoreProductSave, allProductDelete, getDeleteSku } from '@/api/product'
export default {
  name: 'product-details',
  components: {
    ElInputTag: () => import('@/components/ElInputTag'),
    Tinymce: () => import('@/components/Tinymce'),
    EditPrint: () => import('./component/editPrint'),
    PrintPopover: () => import('./component/printPopover'),
    UploadPrint: () => import('./component/uploadPrint')
  },
  data() {
    return {
      formData: {
        status: '2',  
        sku_list: [
          {
            sku_image: '',
            sku_price: '',
            sku_number: '',
            sku: '',
            id: '',
            option: {}
          }
        ],
        images: [],
        optionsList:[
          {option:'',tags:[]}
        ],
      },
      formRule: {
        title: [
          { required: true, message: 'Please enter a title', trigger: 'blur' }
        ],
        status: [
          { required: true, message: 'Please select Product status', trigger: 'change' }
        ]
      },

      variantsEheck:false,
       options:[
         {value:'Size'},
         {value:'Color'},
         {value:'Material'},
         {value:'Style'},
         {value:'Title'},
       ],
      Variantslist: [],
      statusOptions: ['Active', 'Draft'],
      dialogImageUrl: '',
      SubmitLoading: false,
      loading: false,
      dialogVisible: false,
      printvisible: false,
      editPrintUpload: false,
      uploadPrintvisible: false,
      skuIndex: '',
      skuImage: '',
    }
  },
  created() {
    if (this.$route.query.type === 'edit') {
      this.getForm()
    }
  },
  methods: {
    // 获取草稿数据
    getForm() {
      // const loading = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      this.loading = true
      if (this.$route.query.stroeType === 'all') {
        getAllProductEdit({ id: this.$route.query.id }).then(res => {
          if (res.code === 200) {
            if (res.data.sku_list.length > 0) {
              const objHead = JSON.parse(res.data.sku_list[0].option)
              this.Variantslist = Object.keys(objHead)
            }
            res.data.sku_list.forEach(item => {
              item.option = JSON.parse(item.option)
              console.log(item.option)
            })
            this.formData = res.data
            this.formData.images = res.data.images.map(item => {
              return {
                url: item.url,
                is_hover: false,
                id: item.id
              }
            })
            this.loading = false
          }
        }).finally(() => {
          // loading.close()
          this.loading = false
        })
      } else {
        getStoreProductEdit({ id: this.$route.query.id }).then(res => {
          if (res.code === 200) {
            if (res.data.sku_list.length > 0) {
              const objHead = JSON.parse(res.data.sku_list[0].option)
              this.Variantslist = Object.keys(objHead)
            }
            res.data.sku_list.forEach(item => {
              item.option = JSON.parse(item.option)
              console.log(item.option)
            })
            this.formData = res.data
            this.formData.images = res.data.images.map(item => {
              return {
                url: item.url,
                is_hover: false,
                id: item.id
              }
            })
            this.loading = false
          }
        }).finally(() => {
          // loading.close()
          this.loading = false
        })
      }
    },
    // 拖拽监听list
    updateimg(list) {
      this.formData.images = list
    },
    // 保存数据
    Submit() { 
      // console.log(this.formData)
      // return
      if (this.formData.sku_list.length === 0) return this.$message({ message: 'Fill in at least one line of variation', type: 'warning' })
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.SubmitLoading = true
          if (this.$route.query.stroeType === 'all') {
            delete this.formData.optionsList
            getAllProductSave(this.formData).then(res => {
              if (res.code === 200) {
                this.$message({ message: res.message, type: 'success' })
                this.$router.push({ name: 'product' })
              }
            }).finally(() => {
              this.SubmitLoading = false
            })
          } else {
            getStoreProductSave(this.formData).then(res => {
              if (res.code === 200) {
                this.$message({ message: res.message, type: 'success' })
                this.$router.push({ name: 'storeProduct' })
              }
            }).finally(() => {
              this.SubmitLoading = false
            })
          }
        }
      })
    },
    // 新增
    addSkuData() {
      this.formData.sku_list.push(
        this.$options.data().formData.sku_list[0]
      )
    },
    //选择框
     querySearch(queryString, cb) {
        var restaurants = this.options;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
    //新增属性
    addOption(){
      this.formData.optionsList.push(
        this.$options.data().formData.optionsList[0]
      )
    },
    //属性清空
    variantsChage(val){
      if (!val) {
        this.formData.sku_list = []
        this.formData.optionsList = [
          {option:'',tags:[]}
        ]
        this.variantsEheck = false
      }
    },
    // 删除属性
    RemoveOption(idx){
      this.formData.optionsList.splice(idx, 1)
      this.tagsChange()
    },

     //属性交叉
    whatever(...arrs) { 
        return arrs.reduce((arr1, arr2) => arr1.flatMap(e => arr2.map(e2 => `${e}/${e2}`))) 
    },
    //属性
    tagsChange(){
      this.Variantslist = this.formData.optionsList.map(item =>item.option)
      let arr = this.formData.optionsList.map(item =>item.tags)
      let result = this.whatever(...arr)
      const newArr = result.map(item => ({
          obj:item,
          sku_image: '',
          sku_color: '',
          sku_size: '',
          sku_price: '',
          sku_number: '',
          sku: '',
          id: '',
      }))    
      newArr.forEach((val,y) =>{
          val.option = {}
          val.obj = val && val.obj.split('/')
          this.Variantslist.forEach((item,i) =>{
            val.option[this.Variantslist[i]] = val.obj[i];
          })
      })
      console.log(newArr)
      this.formData.sku_list = newArr
    },
    // 删除sku
    delSkuData(index, row) {
      this.$confirm(`Are you sure you want to delete SKU-${index + 1}？`, 'Delete SKU', {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          if (row.id) {
            getDeleteSku({ id: row.id }).then(res => {
              if (res.code === 200) {
                this.$message({ message: res.message, type: 'success' })
                this.formData.sku_list.splice(index, 1)
              }
            })
          } else {
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
          allProductDelete({ product_list: [{ id: this.$route.query.id }] }).then(res => {
            if (res.code === 200) {
              this.$message({ message: res.message, type: 'success' })
              this.$router.push({ name: 'product' })
            }
          })
        })
        .catch(() => {
          console.log('出错')
        })
    },
    // 返回
    productBack() {
      this.$router.go(-1)
    },
    // 关闭  图片编辑 sku
    closePrint(type) {
      if (type === 1) {
        this.printvisible = false
        return
      }
      this.formData.images = type.list.map(item => {
        return {
          url: item.url,
          is_hover: false,
          id: ''
        }
      })
      this.$set(this.formData.sku_list[this.skuIndex], 'sku_image', type.checked)
      this.printvisible = false
    },
    // 打开  sku图片编辑
    openPrint(item, idx) {
      this.skuIndex = idx
      this.skuImage = item.sku_image
      this.editPrintUpload = true
      this.printvisible = true
    },
    // 打开本地上传 橱窗
    openUploadPrint() {
      this.uploadPrintvisible = true
    },
    // 关闭本地上传 橱窗
    closeUploadPrint(type) {
      if (type === 1) {
        this.uploadPrintvisible = false
        return
      }
      this.uploadPrintvisible = false
      const list = type.map(item => {
        return {
          url: item,
          is_hover: false,
          id: ''
        }
      })
      //  this.formData.sku_list.push(...list)
      this.formData.images.push(...list)
    },
    // 删除图片
    delImg(idx) {
      const url = this.formData.images[idx].url
      this.formData.sku_list.forEach(item => {
        if (item.sku_image === url) {
          item.sku_image = ''
        }
      })
      this.formData.images.splice(idx, 1)
    }
  }
}
</script>
<style lang="scss">
.productDetails{
  .variantsTabel{
    // border-bottom: 1px solid #EBEEF5;
    margin-bottom: 30px;
  }
  .box-card {
    margin-top: 20px;
  }
  .el-form-item {
    margin-bottom: 10px
  }
  .el-form-item__label{
    font-size: 16px!important;
    color: #000!important;
    padding: 0;
  }
  .button-border{
    border: 1px solid #ef6f38;
    color:  #ef6f38;
  }
}
.sku_image {
  width: 50px;
  height: 50px;
  border-radius: 3px;
  border: 1px solid rgba(201, 204, 207, 1);
  background: #f9fafb;
}
.image-slot {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
 .error-icon  {
    font-size: 35px;
  }
  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
}
</style>
