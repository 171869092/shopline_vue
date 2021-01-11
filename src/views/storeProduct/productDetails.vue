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
              <el-button size="small" type="primary" :loading="SubmitLoading" @click="submit">Save</el-button>
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
          <el-card
            class="box-card"
          >
            <div slot="header" class="flexbox justify-space-between align-center">
              <div><span style="color:red">*</span><span style="font-weight: 600;">Media:</span></div>
              <div>
                <el-button size="mini" type="primary" @click="openUploadPrint">Add image</el-button>
              </div>
            </div>
            <!-- <print-popover ref="window_img" :list="formData.images" @delImg="delImg" @update="updateimg" /> -->
            <shop-window ref="shopWindow" :img-list="formData.images" @update="updateImgList" @delete="deleteImg" />

          </el-card>
          <!-- Pricing -->
          <el-card
            v-if="tableData.length == 0"
            class="box-card"
          >
            <div slot="header" class="flexbox justify-space-between align-center">
              <div><span style="color:red">*</span><span style="font-weight: 600;">Pricing:</span></div>
            </div>
            <div style="display: flex;" class="ml50">
              <el-form-item label="Price:" prop="Price">
                <el-input v-model="formData.price" placeholder="Price" class="w-230">
                  <template slot="prepend">$</template>
                </el-input>
              </el-form-item>
              <el-form-item label="Compare at Price:" prop="compare_price" class="w-230" style="margin-left: 150px;">
                <el-input v-model="formData.compare_price" placeholder="Compare at Price">
                  <template slot="prepend">$</template>
                </el-input>
              </el-form-item>
            </div>
          </el-card>

          <!-- cost&vendor： -->
          <el-card
            v-if="$route.query.stroeType == 'store'"
            class="box-card"
          >
            <div slot="header" class="flexbox justify-space-between align-center">
              <div><span style="color:red">*</span><span style="font-weight: 600;">Cost&Vendor:</span></div>
            </div>
            <el-table
              ref="vendorTable"
              v-loading="vendorLoading"
              :data="formData.cost_vender_list"
              style="width: 100%"
              highlight-current-row
              fit
              :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
            >
              <el-table-column v-for="(item, idx) in vendorList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
                <template slot-scope="scope">
                  <span v-if="item.type == undefined">{{ scope.row[item.value] }}</span>
                  <span v-if="item.type == 'pictures'">
                    <el-image :src="scope.row.img_url" class="sku_image" />
                  </span>
                  <span v-if="item.type == 'tips'">
                    <span v-if="scope.row.service_price">{{ scope.row.service_price }}</span>
                    <span v-else>Hosting Vendor firstly</span>
                  </span>
                  <span v-if="item.type == 'select' && scope.row.price">
                    <el-select v-model="scope.row.country" @change="selectClick(scope.row.country,scope.$index)">
                      <el-option
                        v-for="(price, key) in scope.row.list"
                        :key="key"
                        :label="price.title"
                        :value="String(price.title)"
                      />
                    </el-select>
                  </span>
                </template>
              </el-table-column>
            </el-table>

          </el-card>

          <!-- 商品 -->
          <el-card class="box-card mt10">
            <div slot="header" class="flexbox justify-space-between align-center">
              <div><span style="color:red">*</span><span style="font-weight: 600;">Variants:</span></div>
              <!-- <el-button class="f-r" type="primary" icon="el-icon-plus" size="small" @click="addSkuData()">Add SKU</el-button> -->
              <div v-if="$route.query.type == 'edit'">
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addVariant">Add variant</el-button>
                <el-button size="mini" @click="editOptions">Edit options</el-button>
              </div>
            </div>
            <div v-if="$route.query.type == 'add'">
              <el-checkbox v-model="variantsEheck" @change="checkVariants">This product has multiple options, like different sizes or colors</el-checkbox>
              <el-button v-if="variantsEheck && optionsList.length < 3 " class="f-r" type="primary" icon="el-icon-plus" size="small" @click="addOption()">Add another option</el-button>
            </div>
            <!-- 新增属性 -->
            <el-alert
              v-if="showAlert"
              class="mt10"
              title="You can't have more than 100 product variants. To save product, remove some options to keep variants under 100."
              type="warning"
              show-icon
              :closable="false"
              style="width:850px"
            />
            <el-table
              v-if="variantsEheck"
              ref="optionsTable"
              :data="optionsList"
              :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
              class="mt20 variantsTabel"
              style="width:850px"
            >
              <el-table-column prop="option" label="OPTIONS" width="280">
                <template slot-scope="scope">
                  <div class="d-height f-l mb5 ml5">Option {{ scope.$index + 1 }}</div>
                  <el-form-item class="mb0" label-width="0">
                    <el-popover
                      v-model="scope.row.showList"
                      placement="bottom-end"
                      width="250"
                      trigger="click"
                    >
                      <ul class="option-list">
                        <li
                          v-for="(item, key) in options"
                          :key="key"
                          class="option-item"
                          :class="[scope.row.option == item ? 'active' : '']"
                          @click="selectOption(scope.row, item)"
                        >
                          <span>{{ item }}</span>
                        </li>
                      </ul>
                      <!-- <el-button slot="reference">click 激活</el-button> -->
                      <el-input slot="reference" v-model="scope.row.option" class="w-250" @change="tagsChange" />
                    </el-popover>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="optionVlue" align="left">
                <template slot-scope="scope">
                  <div class="flexbox justify-flex-end d-height">
                    <span v-if="optionsList.length > 1" class="primary cursor_p f-r" @click="RemoveOption(scope.$index, scope.row)">Remove</span>
                    <div v-else />
                  </div>
                  <el-form-item class="mb0" label-width="0">
                    <!-- <el-input-tag v-model="scope.row.tags" @input="tagsChange" /> -->
                    <!-- <input-tag v-model="scope.row.tags" class="option-input-tag" :add-tag-on-blur="true" :limit="20" @update:tags="tagsChange" /> -->
                    <input-tag v-model="scope.row.tags" class="option-input-tag" :add-tag-on-blur="true" :limit="20" @input="tagsChange" />
                  </el-form-item>
                </template>
              </el-table-column>
              <!-- <el-table-column label="Operating" width="120px">
                <template slot-scope="scope">

                </template>
              </el-table-column> -->
            </el-table>
            <!-- 生成属性 -->
            <div v-if="variantsEheck" class="mt20"><label>Preview</label></div>
            <vxe-table
              ref="xTable"
              border
              show-overflow
              highlight-hover-row
              empty-text="No Data"
              align="center"
              :loading="preLoading"
              max-height="500"
              :scroll-y="{gt: 50}"
              :data="tableData"
            >
              <vxe-table-column type="seq" width="100" />
              <vxe-table-column title="Picture" field="sku_image">
                <template v-slot="{ row, rowIndex }">
                  <el-image class="sku_image" :src="row.sku_image" @click.native="openPrint(row, rowIndex)">
                    <div slot="error" class="image-slot">
                      <i class="error-icon el-icon-picture-outline" />
                    </div>
                  </el-image>
                </template>
              </vxe-table-column>
              <template v-if="$route.query.type === 'edit'">
                <vxe-table-column v-for="(variant, key) in variantsTitle" :key="variant + key" :title="variant">
                  <template v-slot="{ row }">
                    <el-form-item class="mb0" label-width="0">
                      <el-input
                        v-model="row.option[variant]"
                        size="mini"
                        clearable
                        :disabled="$route.query.type === 'add'"
                        class="p5_input"
                        @change="changeVariants(variant)"
                      />
                    </el-form-item>
                  </template>
                </vxe-table-column>
              </template>
              <vxe-table-column v-if="$route.query.type === 'add'" title="variant" field="variant">
                <template v-slot="{ row }">
                  <span>{{ row.variant }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column title="Price" field="sku_price">
                <template v-slot="{ row, rowIndex }">
                  <el-form-item class="mb0" label-width="0">
                    <el-input v-model="row.sku_price" clearable size="mini" class="p5_input" placeholder="Price" />
                  </el-form-item>
                </template>
              </vxe-table-column>
              <vxe-table-column title="Quantity" field="sku_number">
                <template v-slot="{ row, rowIndex }">
                  <el-form-item class="mb0" label-width="0">
                    <el-input-number v-model="row.sku_number" class="p5_input" size="mini" :min="1" controls-position="right" />
                  </el-form-item>
                </template>
              </vxe-table-column>
              <vxe-table-column title="SKU" field="sku">
                <template v-slot="{ row, rowIndex }">
                  <el-form-item class="mb0" label-width="0">
                    <el-input v-model="row.sku" size="mini" clearable class="p5_input" placeholder="SKU" />
                  </el-form-item>
                </template>
              </vxe-table-column>
              <vxe-table-column title="Operating" width="120px">
                <template v-slot="{ row, rowIndex }">
                  <!-- <el-button type="danger" size="mini" @click="delSkuData(row, rowIndex)">delete</el-button> -->
                  <div class="icon-border" @click="delSkuData(row, rowIndex)">
                    <i class="el-icon-delete-solid cursor_p" />
                  </div>
                </template>
              </vxe-table-column>
            </vxe-table>
            <!-- <el-table
              v-if="variantsEheck || $route.query.type === 'edit'"
              ref="multipleTable"
              :data="tableData"
              border
              class="mt20"
              :loading="preLoading"
              :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
              style="width: 100%"
              max-height="500"
            >
              <el-table-column type="index" width="120" label="#" />
              <el-table-column label="Picture" prop="sku_image">
                <template slot-scope="scope">
                  <el-image class="sku_image" :src="scope.row.sku_image" @click.native="openPrint(scope.row, scope.$index)">
                    <div slot="error" class="image-slot">
                      <i class="error-icon el-icon-picture-outline" />
                    </div>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column v-for="variant in variantsTitle" :key="variant" :prop="variant" :label="variant">
                <template slot-scope="scope">
                  <el-form-item class="mb0" label-width="0">
                    <el-input v-model="scope.row.option[variant]" size="mini" clearable :disabled="$route.query.type === 'add'" class="p5_input" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="Price" prop="sku_price">
                <template slot-scope="scope">
                  <el-form-item class="mb0" label-width="0" :prop="`sku_list.${scope.$index}.sku_price`" :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                    <el-input v-model="scope.row.sku_price" clearable size="mini" class="p5_input" placeholder="Price">
                      <i slot="prefix">€</i>
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
            </el-table> -->
          </el-card>
        </el-form>
      </el-col>
    </el-row>
    <!-- <edit-print :visible.sync="printvisible" :is-upload="editPrintUpload" :sku-img="skuImage" @close="closePrint" />
    <upload-print :visible.sync="uploadPrintvisible" @close="closeUploadPrint" /> -->
    <select-pictures
      :visible.sync="printvisible"
      :form-data="formData.images"
      :checked="skuImage"
      @select="selectedImg"
      @update="updateImgList"
    />
    <edit-options :visible.sync="dialogVisible" :options="optionsList" :list-data="tableData" @update:sku="updateVariants" />
  </div>
</template>
<script>
import _ from 'lodash'
import InputTag from 'vue-input-tag'
import EditOptions from './component/edit-options'
import { descartes_obj } from '@/utils'
import { getAllProductEdit, getStoreProductEdit, getAllProductSave, getStoreProductSave, allProductDelete, getDeleteSku } from '@/api/product'
export default {
  name: 'product-details',
  components: {
    // ElInputTag: () => import('@/components/ElInputTag'),
    Tinymce: () => import('@/components/Tinymce'),
    // EditPrint: () => import('./component/editPrint'),
    // PrintPopover: () => import('./component/printPopover'),
    // UploadPrint: () => import('./component/uploadPrint'),
    ShopWindow: () => import('./component/shop-window'),
    SelectPictures: () => import('./component/select-pictures'),
    InputTag,
    EditOptions
  },
  data() {
    return {
      formData: {
        status: '2',
        sku_list: [],
        images: [],
        options: [],
        cost_vender_list: []
      },
      formRule: {
        title: [
          { required: true, message: 'Please enter a title', trigger: 'blur' }
        ],
        status: [
          { required: true, message: 'Please select Product status', trigger: 'change' }
        ]
      },
      vendorList: [
        { label: 'Pictures', value: 'img_url', type: 'pictures' },
        { label: 'Variants', value: 'variants' },
        { label: 'SKU', value: 'sku' },
        { label: 'Vendor', value: 'service_name' },
        { label: 'Total Cost', value: 'total_cost' },
        { label: 'Product Price', value: 'price', width: '120' },
        { label: 'Service Price', value: 'service_price', type: 'tips', width: '160' },
        { label: 'Shipping Price', value: 'shipping_price', width: '120' },
        { label: '', value: '', type: 'select', width: '150' }
      ],

      optionsList: [],
      variantsTitle: [],
      variantsEheck: false,
      options: ['Size', 'Color', 'Material', 'Style', 'Title'],
      statusOptions: ['Active', 'Draft'],
      vendorLoading: false,
      dialogImageUrl: '',
      SubmitLoading: false,
      loading: false,
      dialogVisible: false,
      printvisible: false,
      editPrintUpload: false,
      uploadPrintvisible: false,
      showAlert: false,
      preLoading: false,
      skuIndex: '',
      skuImage: '',
      imgList: [],
      tableData: [],
      sourceObj: {}
    }
  },
  computed: {
    sourceArr() {
      return this.optionsList.map(item => item.tags).filter(String)
    }
  },
  watch: {
    optionsList: {
      handler(list) {
        this.variantsTitle = list.map(item => item.option)
      },
      deep: true
    }
  },
  created() {
    if (this.$route.query.type === 'edit') {
      this.getForm()
    }
    // this.tableData = []
  },
  methods: {
    selectClick(val, idx) {
      this.formData.cost_vender_list.map(item => {
        item.list.map(v => {
          if (val === v.title) {
            this.formData.cost_vender_list[idx].shipping_price = v.value
          }
        })
      })
      this.formData.cost_vender_list[idx].total_cost = (+this.formData.cost_vender_list[idx].price + +this.formData.cost_vender_list[idx].service_price + +this.formData.cost_vender_list[idx].shipping_price).toFixed(2)
    },
    // 获取草稿数据
    getForm() {
      this.loading = true
      if (this.$route.query.stroeType === 'all') {
        getAllProductEdit({ id: this.$route.query.id }).then(res => {
          if (res.code === 200) {
            this.formData = res.data
            this.tableData = res.data.sku_list
            if (res.data.options) {
              this.optionsList = res.data.options
            }
            if (res.data.sku_list.length > 0) {
              const option = res.data.sku_list[0].option
              if (option) {
                this.variantsTitle = Object.keys(option)
              }
            }
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
            this.formData = res.data
            this.formData.cost_vender_list.map((item, idx) => {
              this.formData.cost_vender_list[idx].country = item.list[0].title
              this.selectClick(item.list[0].title, idx)
            })
            this.tableData = res.data.sku_list
            // this.vendorData = res.data.sku_list.cost_vender_list
            if (res.data.options) {
              this.optionsList = res.data.options
            }
            if (res.data.sku_list.length > 0) {
              const option = res.data.sku_list[0].option
              if (option) {
                this.variantsTitle = Object.keys(option)
              }
            }
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
    submit() {
      this.formData.sku_list = this.tableData
      this.formData.options = this.optionsList
      // if (this.formData.sku_list.length === 0) return this.$message({ message: 'Fill in at least one line of variation', type: 'warning' })
      console.log(this.formData)
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.SubmitLoading = true
          if (this.$route.query.stroeType === 'all') {
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
    // 新增属性
    addOption() {
      const length = this.optionsList.length
      const name = this.options[length]
      this.optionsList.push({ showList: false, option: name, tags: [] })
    },
    selectOption(row, val) {
      row.option = val
      row.showList = false
      this.tagsChange()
    },
    // 属性清空
    checkVariants(val) {
      if (val) {
        this.formData.sku_list = []
        this.optionsList.push({ showList: false, option: 'Size', tags: [] })
      } else {
        this.formData.sku_list = []
        this.optionsList = []
      }
    },
    editOptions() {
      this.dialogVisible = true
    },
    // 删除属性
    RemoveOption(idx) {
      this.optionsList.splice(idx, 1)
      this.tagsChange()
    },
    // 属性变更
    tagsChange() {
      console.time('whatever')
      const variants = this.whatever(this.sourceArr)
      console.timeEnd('whatever')
      variants.length > 100 ? this.showAlert = true : this.showAlert = false
      const sourceObj = {}
      this.optionsList.forEach((item) => {
        sourceObj[item.option] = item.tags
      })
      console.log(this.optionsList)
      // console.log(this.sourceArr)
      // console.log(this.sourceObj)
      this.preLoading = true
      descartes_obj(sourceObj).then(result => {
        const newArr = result.map((item, index) => ({
          id: '',
          sku: '',
          option: item,
          variant: variants[index],
          sku_image: '',
          sku_color: '',
          sku_size: '',
          sku_price: '',
          sku_number: ''
        }))
        this.tableData = newArr
        this.preLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 属性交叉
    whatever(arrs) {
      if (arrs.length > 0) {
        return arrs.reduce((arr1, arr2) => arr1.flatMap(e => arr2.map(e2 => `${e}/${e2}`)))
      }
      return []
    },
    addVariant() {
      const sku = {
        id: '',
        sku: '',
        option: {},
        sku_image: '',
        sku_color: '',
        sku_size: '',
        sku_price: '',
        sku_number: ''
      }
      this.tableData.push(sku)
    },
    changeVariants(name) {
      const arr = this.tableData.map(item => item.option[name])
      console.log(this.tableData)
      console.log(_.uniq(arr))
      this.optionsList.forEach(opt => {
        if (opt.option === name) {
          opt.tags = _.uniq(arr)
        }
      })
    },
    async updateVariants(data) {
      console.log(data)
      this.variantsTitle = data.copyList.map(i => i.option)
      this.optionsList = data.copyList.map(item => {
        item.isAdd = false
        return item
      })

      const result1 = await this.changeTitle(data, this.tableData)
      const result2 = await this.removeTagData(data, result1)
      const result3 = await this.removelineData(data, result2)
      const result4 = await this.addTagData(data, result3)
      console.log(result4)
      this.$refs.xTable.loadData(result4)
    },
    changeTitle(data, result) {
      return new Promise(resolve => {
        if (data.changeList.length > 0) {
          data.changeList.forEach(c => {
            result.forEach(v => {
              if (Object.keys(v.option).includes(c.original)) {
                // 使用Vue.$set转成响应式
                this.$set(v.option, c.change, v.option[c.original])
                delete v.option[c.original]
              }
            })
          })
        }
        resolve(result)
      })
    },
    addTagData(data, result) {
      return new Promise(resolve => {
        if (data.addList.length > 0) {
          data.addList.forEach(t => {
            result.forEach(v => {
              // 使用Vue.$set转成响应式
              this.$set(v.option, t.option, t.tags.toString())
            })
          })
        }
        resolve(result)
      })
    },
    removeTagData(data, result) {
      return new Promise(resolve => {
        if (data.tagList.length > 0) {
          data.tagList.forEach(t => {
            result.forEach((v, i) => {
              if (v.option[t.title] === t.value) {
                delete result[i]
                // delete v.option[t.title]
              }
            })
          })
        }
        return resolve(result.filter(String))
      })
    },
    removelineData(data, result) {
      return new Promise(resolve => {
        if (data.delList.length > 0) {
          console.log(data.delList)
          data.delList.forEach(d => {
            result.forEach(v => {
              delete v.option[d.option]
            })
          })
        }
        resolve(result)
      })
    },
    // 删除sku
    delSkuData(row, index) {
      console.log(row, index)
      const skuName = []
      for (var key of Object.keys(row.option)) {
        skuName.push(row.option[key])
      }
      this.$confirm(`Are you sure you want to delete the variant For <strong>${skuName.join(' / ')}</strong>?`,
        `Delete For Variant`, {
          // this.$confirm('<strong>这是 <i>HTML</i> 片段</strong>', 'Delete SKU', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning',
          dangerouslyUseHTMLString: true
        })
        .then(() => {
          // if (row.id) {
          //   getDeleteSku({ id: row.id }).then(res => {
          //     if (res.code === 200) {
          //       this.$message({ message: res.message, type: 'success' })
          //       this.tableData.splice(index, 1)
          //     }
          //   })
          // } else {
          //   this.tableData.splice(index, 1)
          //   // this.$refs.xTable.loadData(this.tableData)
          // }
          this.tableData.splice(index, 1)
          if (this.tableData.length > 0) {
            const options = []
            for (var key of Object.keys(row.option)) {
              options.push({ option: key, tags: _.uniq(this.tableData.map(item => item.option[key])) })
            }
            console.log(options)
            this.optionsList = options
          } else {
            this.optionsList = []
          }
          this.$refs.xTable.loadData(this.tableData)
        })
        .catch(() => {})
    },
    // 删除商品
    ProductDelete() {
      this.$confirm(`Are you sure you want to delete this product？This can’t be undone.`, 'Delete Product', {
        confirmButtonText: 'Delete',
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
    // 打开  sku图片编辑
    openPrint(item, idx) {
      console.log(item, idx)
      this.skuIndex = idx
      this.skuImage = item.sku_image
      this.editPrintUpload = true
      this.printvisible = true
    },
    // 打开本地上传 橱窗
    openUploadPrint() {
      // this.uploadPrintvisible = true
      // console.log(this.$refs.shopWindow)
      this.$refs.shopWindow.preupload()
    },
    updateImgList(list) {
      console.log(list)
      this.imgList = list
      this.formData.images = this.imgList
    },
    selectedImg(val) {
      this.tableData[this.skuIndex].sku_image = val
    },
    deleteImg(val) {
      this.tableData.forEach(sku => {
        if (sku.sku_image === val) {
          sku.sku_image = ''
        }
      })
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
  width: 40px;
  height: 40px;
  border-radius: 3px;
  border: 1px solid rgba(201, 204, 207, 1);
  background: #f9fafb;
  margin: 4px;
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
.option-list {
  list-style: none;
  padding-left: 0px;
  margin-bottom: 0;
  .option-item {
    line-height: 2;
    padding: 5px;
    cursor: pointer;
    position: relative;
    &.active {
      &::before {
        content: "";
        background-color: #2c6ecb;
        position: absolute;
        top: 0;
        left: -12px;
        height: 100%;
        display: block;
        width: 3px;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
      }
    }
    &:hover {
      background: #eee;
    }
  }
}
.d-height {
  height: 20px;
  margin-bottom: 2.5px;
}
.vue-input-tag-wrapper {
  border-radius: 3px;
  &.option-input-tag {
    .input-tag {
      background-color: rgb(228, 229, 231);
      border: none;
      border-radius: 4px;
      color: rgb(32, 34, 35);
      display: inline-block;
      font-size: 13px;
      font-weight: 400;
      margin-bottom: 5px;
      margin-right: 5px;
      padding: 3px 8px;
      line-height: 25px;
      .remove {
        color: rgb(92, 95, 98);
        cursor: pointer;
        font-weight: 500;
        font-size: 20px;
        display: inline-block;
        line-height: 15px;
        margin-left: 5px;
      }
    }
    .new-tag {
      line-height: 15px;
    }
  }
}
</style>
