<template>
  <div v-loading="loading" class="productDetails p30">
    <el-row :gutter="20">
      <el-col :span="20" :offset="2">
        <el-form ref="formData" :model="formData" :rules="formRule" label-width="140px" label-position="top">
          <!-- <div class="product-header mb20 flexbox justify-space-between"> -->
          <el-row>
            <el-col :span="1"> <el-button size="small" class="button-border" icon="el-icon-back" @click="productBack" /></el-col>
            <el-col :span="18"> <label class="ml20">{{ formData.title }}</label></el-col>
            <el-col :span="5">
              <div style="float: right;">
                <el-button v-if="$route.query.type == 'edit' && $route.query.stroeType == 'all'" size="small" class="button-border" @click="ProductDelete">Delete product</el-button>
                <el-button size="small" type="primary" :loading="SubmitLoading" @click="submit">Save</el-button>
              </div>
            </el-col>
          </el-row>

          <!-- </div> -->
          <el-card class="box-card">
            <el-form-item label="Title:" prop="title">
              <el-input v-model="formData.title" placeholder="Title" />
            </el-form-item>
            <el-form-item v-if="$route.query.type == 'edit' && $route.query.stroeType == 'all'" label="Source URL:" style="display: flex;">
              <el-link v-if="platform_index_id" :href="`https://aliexpress.com/item/${platform_index_id}.html`" type="primary" target="_blank" style="margin-left:20px">{{ `https://aliexpress.com/item/${platform_index_id}.html` }}</el-link>
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
          <el-card v-if="!variantsCheck && !formData.options_tag" class="box-card">
            <div slot="header" class="flexbox justify-space-between align-center">
              <div><span style="color:red">*</span><span style="font-weight: 600;">Pricing:</span></div>
            </div>
            <div class="flexbox ml20">
              <el-form-item label="Price" prop="Price">
                <el-input v-model="formData.price" type="number" placeholder="Price" class="w-230">
                  <div slot="prefix" style="padding:0 8px">{{ formData.signal || '$' }}</div>
                  <!-- <i slot="prefix">$</i> -->
                </el-input>
              </el-form-item>
              <el-form-item label="Compare at Price" prop="compare_price" class="w-230" style="margin-left: 120px;">
                <el-input v-model="formData.compare_price" type="number" placeholder="Compare at Price">
                  <div slot="prefix" style="padding:0 8px">{{ formData.signal || '$' }}</div>
                </el-input>
              </el-form-item>
              <el-form-item label="Cost per item" prop="cost" class="w-230" style="margin-left: 120px;">
                <el-input v-model="formData.cost" type="number" placeholder="Cost per item">
                  <div slot="prefix" style="padding:0 8px">{{ formData.signal || '$' }}</div>
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
                    <el-image :src="scope.row.img_url" class="sku_image">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" style="font-size: 30px;" />
                      </div>
                    </el-image>
                  </span>
                  <span v-if="item.type == 'tips'">
                    <span v-if="scope.row.price">{{ scope.row.price }}</span>
                    <span v-else>Waiting for reply</span>
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
              <div v-if="$route.query.type == 'edit' && formData.options_tag">
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addVariant()">Add variant</el-button>
                <el-button size="mini" @click="editOptions()">Edit options</el-button>
              </div>
            </div>
            <div>
              <el-checkbox v-if="!formData.options_tag || isAddVariants" v-model="variantsCheck">This product has multiple options, like different sizes or colors</el-checkbox>
              <el-button v-if="variantsCheck && optionsList.length < 3" class="f-r" type="primary" icon="el-icon-plus" size="small" @click="addOption()">Add another option</el-button>
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
              v-if="variantsCheck"
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
                    <span v-show="optionsList.length > 1" class="primary cursor_p f-r" @click="RemoveOption(scope.$index, scope.row)">Remove</span>
                  </div>
                  <el-form-item class="mb0" label-width="0">
                    <input-tag v-model="scope.row.tags" class="option-input-tag" :add-tag-on-blur="true" :limit="20" @input="tagsChange" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
            <!-- 生成属性 -->
            <div class="mb10">
              <label v-if="variantsCheck && isAddVariants">Preview</label>
              <el-button v-if="$route.query.type == 'edit' && showDelBtn" size="mini" type="primary" plain @click="deleteVariants()">Delete variants</el-button>
            </div>
            <vxe-table
              v-if="(variantsCheck && isAddVariants) || formData.options_tag"
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
              @checkbox-all="selectChangeEvent"
              @checkbox-change="selectChangeEvent"
            >
              <vxe-table-column type="checkbox" width="100" />
              <vxe-table-column title="Picture" field="sku_image" width="100">
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
                <template v-slot="{ row }">
                  <el-form-item class="mb0" label-width="0">
                    <el-input v-model="row.sku_price" clearable size="mini" class="p5_input" placeholder="Price">
                      <span slot="prefix" style="padding:0 8px">{{ row.signal || '$' }}</span>
                    </el-input>
                  </el-form-item>
                </template>
              </vxe-table-column>
              <vxe-table-column title="Compare at price" field="compare_price">
                <template v-slot="{ row }">
                  <el-form-item class="mb0" label-width="0">
                    <el-input v-model="row.compare_price" clearable size="mini" class="p5_input" placeholder="0.00">
                      <span slot="prefix" style="padding:0 8px">{{ row.signal || '$' }}</span>
                    </el-input>
                  </el-form-item>
                </template>
              </vxe-table-column>
              <vxe-table-column title="Cost" field="sku_cost">
                <template v-slot="{ row }">
                  <el-form-item class="mb0" label-width="0">
                    <el-input v-model="row.sku_cost" type="number" min="0.00" clearable size="mini" class="p5_input" placeholder="0.00">
                      <div slot="prefix" style="padding:0 8px">{{ row.signal || '$' }}</div>
                    </el-input>
                  </el-form-item>
                </template>
              </vxe-table-column>
              <vxe-table-column title="Quantity" field="sku_number">
                <template v-slot="{ row }">
                  <el-form-item class="mb0" label-width="0">
                    <el-input-number v-model="row.sku_number" class="p5_input" size="mini" :min="1" controls-position="right" />
                  </el-form-item>
                </template>
              </vxe-table-column>
              <vxe-table-column title="SKU" field="sku">
                <template v-slot="{ row }">
                  <el-form-item class="mb0" label-width="0">
                    <el-input v-model="row.sku" size="mini" clearable class="p5_input" placeholder="SKU" />
                  </el-form-item>
                </template>
              </vxe-table-column>
              <vxe-table-column title="Operating" width="120px">
                <template v-slot="{ row, rowIndex }">
                  <div class="icon-border" @click="delSkuData(row, rowIndex)">
                    <i class="el-icon-delete-solid cursor_p" />
                  </div>
                </template>
              </vxe-table-column>
            </vxe-table>
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
import { getAllProductEdit, getStoreProductEdit, getAllProductSave, getStoreProductSave, allProductDelete } from '@/api/product'
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
        title: '',
        describe: '',
        status: '2',
        sku_list: [],
        images: [],
        options: [],
        cost_vender_list: [],
        compare_price: '',
        price: '',
        cost: ''
        // del_sku: []
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
        { label: 'Discount Rate', value: 'rate' },
        { label: 'Product Price', value: 'price', width: '160', type: 'tips' },
        { label: 'Service Price', value: 'service_price', width: '120' },
        { label: 'Shipping Price', value: 'shipping_price', width: '120' },
        { label: '', value: '', type: 'select', width: '150' }
      ],

      optionsList: [],
      variantsTitle: [],
      variantsCheck: false,
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
      showDelBtn: false,
      isAddVariants: false,
      skuIndex: '',
      skuImage: '',
      imgList: [],
      tableData: [],
      selectedVariants: [],
      platform_index_id: ''
    }
  },
  computed: {
    sourceArr() {
      return this.optionsList.map(item => item.tags).filter(String)
    },
    showVariants() {
      return this.tableData.length === 0
    }
  },
  watch: {
    optionsList: {
      handler(list) {
        this.variantsTitle = list.map(item => item.option)
      },
      deep: true
    },
    variantsCheck: {
      handler(val) {
        if (val) { // 如果为true
          if (!this.formData.options_tag) {
            this.optionsList = []
          }
          this.tableData = []
          this.optionsList.push({ showList: false, option: 'Size', tags: [] })
        } else {
          this.isAddVariants = false
          this.tableData = []
          this.optionsList = []
        }
      }
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
      const list = this.formData.cost_vender_list[idx].list.find(item => item.title === val)
      this.formData.cost_vender_list[idx].shipping_price = list.value
      this.formData.cost_vender_list[idx].total_cost = list.total_cost
      // this.formData.cost_vender_list[idx].total_cost = (+this.formData.cost_vender_list[idx].price + +this.formData.cost_vender_list[idx].service_price + +this.formData.cost_vender_list[idx].shipping_price).toFixed(2)
    },
    // 获取草稿数据
    getForm() {
      this.loading = true
      if (this.$route.query.stroeType === 'all') {
        getAllProductEdit({ id: this.$route.query.id }).then(res => {
          if (res.code === 200) {
            this.formData = res.data
            this.platform_index_id = res.data.platform_index_id
            // this.formData.del_sku = []
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
            if (res.data.options) {
              this.optionsList = res.data.options
            }
            this.tableData = res.data.sku_list
            console.log(this.optionsList)
            if (res.data.sku_list.length > 0) {
              const option = res.data.sku_list[0].option
              if (option) {
                this.variantsTitle = Object.keys(option)
              }
            }
            this.formData.cost_vender_list.map((item, idx) => {
              item.list.map(v => {
                if (v.value) {
                  this.$set(item, 'country', item.list[0].title)
                  this.selectClick(item.list[0].title, idx)
                }
              })
            })
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
      if (this.formData.options_tag) {
        this.formData.price = ''
        this.formData.compare_price = ''
        this.formData.cost = ''
      }
      this.formData.sku_list = this.tableData.filter(Boolean)
      this.formData.options = this.optionsList
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
      this.isAddVariants = true
      console.time('whatever')
      const variants = this.whatever(this.sourceArr)
      console.timeEnd('whatever')
      variants.length > 100 ? this.showAlert = true : this.showAlert = false
      const sourceObj = {}
      this.optionsList.forEach((item) => {
        sourceObj[item.option] = item.tags
      })
      // console.log(this.optionsList)
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
          sku_number: '999',
          compare_price: ''
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
        sku_number: '999',
        compare_price: ''
      }
      this.tableData.push(sku)
    },
    changeVariants(name) {
      const arr = this.tableData.map(item => item.option[name])
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
      const xTable = this.$refs.xTable
      if (xTable) {
        this.$refs.xTable.loadData(result4)
      } else {
        // this.tableData = result4
        this.$set(this, 'tableData', result4)
      }
    },
    deleteVariants() {
      this.$confirm(`Are you sure you want to delete the selected variants?`,
        `Delete For Variant`, {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
        .then(() => {
          const test = _.difference(this.tableData, this.selectedVariants)
          // console.log('test', test)
          if (test.length > 0) {
            const option = this.tableData[0].option
            if (JSON.stringify(option) !== '{}') {
              const options = []
              for (var key of Object.keys(option)) {
                options.push({ option: key, tags: _.uniq(test.map(item => item.option[key])) })
              }
              this.optionsList = options
            }
          } else {
            this.isAddVariants = true
            this.variantsCheck = false
            this.formData.options_tag = false
            this.optionsList = []
          }
          this.showDelBtn = false
          this.$set(this, 'tableData', test)
        })
        .catch(() => {})
      // this.$refs.xTable.loadData(this.tableData)
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
              }
            })
          })
          return resolve(result.filter(Boolean))
        }
        return resolve(result)
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
    selectChangeEvent({ checked, records }) {
      records.length > 0 ? this.showDelBtn = true : this.showDelBtn = false
      this.selectedVariants = records
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
          //   this.formData.del_sku.push(row.id)
          // }
          // console.log(this.formData)
          this.tableData.splice(index, 1)
          if (this.tableData.length > 0) {
            if (JSON.stringify(row.option) !== '{}') {
              const options = []
              for (var key of Object.keys(row.option)) {
                options.push({ option: key, tags: _.uniq(this.tableData.map(item => item.option[key])) })
              }
              this.optionsList = options
            }
          } else {
            this.isAddVariants = false
            this.variantsCheck = false
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
.productDetails {
  .variantsTabel {
    // border-bottom: 1px solid #EBEEF5;
    margin-bottom: 30px;
  }
  .box-card {
    margin-top: 20px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form-item__label {
    font-size: 16px !important;
    color: #000 !important;
    padding: 0;
  }
  .button-border {
    border: 1px solid #ef6f38;
    color: #ef6f38;
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
