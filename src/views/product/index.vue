<template>
  <div class="product">
    <div class="mb20">
      <div class="flexbox justify-flex-end">
        <el-button type="primary" icon="el-icon-check" size="small" @click="collectPrices">Collect prices</el-button>
        <el-button icon="el-icon-connection" size="small" class="button-border" @click="assignStore('add')">Assign store</el-button>
        <el-button type="primary" icon="el-icon-plus" size="small" class="" @click="productAdd('add')">Add products</el-button>
      </div>
    </div>
    <el-card class="box-card">
      <div class="flexbox mb20">
        <div>
          <el-input
            v-model="formInline.title"
            prefix-icon="el-icon-search"
            placeholder="Filter products"
            clearable
            class="w-570"
            @input="filterOrders"
          />
        </div>
        <div>
          <el-select v-model="formInline.status" placeholder="Status" clearable class="ml20" @change="filterOrders">
            <el-option
              v-for="(item,idx) in statusOptions"
              :key="item"
              :label="item"
              :value="String(idx + 1)"
            />
          </el-select>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        empty-text="No Data"
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
            <span v-if="item.type == 'image'" @click="productAdd('edit',scope.row.id)">
              <el-image class="sku_image" style="width: 50px; height: 50px" :src="scope.row.img_url" fit="cover">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" style="font-size: 30px;" />
                </div>
              </el-image>
            </span>
            <div v-if="item.type == 'product'" style="color:#ef6f38" class="pointer" @click="productAdd('edit',scope.row.id)">
              <span>{{ scope.row.title }}</span>
            </div>
            <div v-if="item.type == 'shop'">
              <span>{{ getLabelOfValue(scope.row.store_url, storeList) }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
    </el-card>
    <el-dialog title="Assign Store" :visible.sync="dialogvisible" width="500px">
      <el-form ref="dialogForm" :model="dialogForm" label-width="60px">
        <el-form-item
          label="Store"
          prop="store_id"
          :rules="{required: true, message: 'Please select a store', trigger: 'blur'}"
        >
          <el-select v-model="dialogForm.store_id" placeholder="Select Store" style="width:100%">
            <el-option
              v-for="(item, key) in storeList"
              :key="key"
              :label="item.store_url"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogvisible = false">Cancel</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit('dialogForm')">Submit</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Select Vendor" :visible.sync="vendorVisible" width="700px" :close-on-click-modal="false" center :before-close="providerAdd">
      <el-form ref="vendorForm" :model="vendorForm" size="small" label-width="170px" :rules="rules">
        <el-form-item label="Vendor:" prop="service_id">
          <el-select v-model="vendorForm.service_id" multiple filterable class="w-350">
            <el-option v-for="item in ServiceList" :key="item.id" :label="item.service_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Countries:" prop="country">
          <el-select v-model="vendorForm.country" multiple filterable class="w-350">
            <el-option v-for="item in countriesList" :key="item.two_code" :label="item.name_en" :value="item.two_code" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="providerAdd">Cancel</el-button>
        <el-button size="small" type="primary" @click="providerAdd(1)">Confirm</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="PromptVisible" width="700px" :close-on-click-modal="false" :before-close="Prompt">
      <span slot="title">
        <img src="@/assets/home/prompt.png" class="mr20" width="20px" height="20px">
        <span>Prompt</span>
      </span>
      <div style="text-align: center">Please add pictures to SKU variants</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" style="background-color:#f68a1d; color: #fff; border: 0 none" @click="Prompt(2)">Add</el-button>
        <el-button size="small" type="primary" @click="Prompt(1)">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { debounce } from '@/utils'
import { getStoreList, getAllProductList, allGoodsSelectStore, getServiceList, getCountryList, createQuoted } from '@/api/product'
export default {
  name: 'product',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  data() {
    return {
      // 列表表头
      labelList: [
        { label: '', value: '', type: 'image', width: '200' },
        { label: 'Product', value: 'id', type: 'product', width: '500' },
        { label: 'Status', value: 'status' },
        { label: 'Inventory', value: 'stock' },
        { label: 'Shop', value: 'store_url', type: 'shop' },
        { label: 'Hosting', value: 'service_name' }
      ],
      statusOptions: ['Active', 'Draft'],
      tableData: [],
      productSelection: [],
      loading: false,
      dialogvisible: false,
      vendorVisible: false,
      submitLoading: false,
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      formInline: {
        title: '',
        status: ''
      },
      dialogForm: {
        store_id: '',
        product_list: []
      },
      storeList: [],
      vendorForm: {
        service_id: '',
        country: []
      },
      ServiceList: [],
      countriesList: [],
      rules: {
        service_id: [
          { required: true, message: 'please choose', trigger: 'change' }
        ],
        country: [
          { required: true, validator: this.country, trigger: 'change' }
        ]
      },
      PromptVisible: false,
      ids: []
    }
  },
  created() {
    this.initData()
    this.Inquire()
  },
  methods: {
    // 获取店铺list
    initData() {
      getStoreList().then(res => {
        if (res.code === 200) {
          this.storeList = res.data
        }
      })
      getServiceList().then(res => {
        if (res.code === 200) {
          this.ServiceList = res.data
        }
      })
      getCountryList().then(res => {
        if (res.code === 200) {
          this.countriesList = res.data
        }
      })
    },
    // 根据value获取label
    getLabelOfValue(val, list) {
      const obj = list.find(it => it.store_url === val)
      if (obj) {
        return obj.store_name
      } else {
        return val
      }
    },
    // 查询
    Inquire() {
      this.loading = true
      const formData = JSON.parse(JSON.stringify(this.formInline))
      formData.iDisplayLength = this.listQuery.limit
      formData.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      getAllProductList(formData).then(res => {
        if (res.code === 200) {
          res.data.map(item => {
            item.status = item.status === '1' ? 'Active' : 'Draft'
          })
          this.tableData = res.data
          this.listQuery.total = +res.iTotalRecords
          this.loading = false
        }
      })
    },
    productChange(val) {
      this.productSelection = val
    },
    productAdd(type, id) {
      this.$router.push({ name: 'productDetails', query: { type: type, id: id, stroeType: 'all' }})
    },
    assignStore() {
      if (this.productSelection.length === 0) {
        this.$message({ message: 'Please check the product before', type: 'warning' })
        return
      }
      this.dialogvisible = true
      this.dialogForm.product_list = this.productSelection.map(i => i.id)
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          allGoodsSelectStore(this.dialogForm).then(res => {
            console.log(res.data)
            if (res.code === 200) {
              this.$message.success(res.message)
              this.$refs[formName].resetFields()
              this.dialogvisible = false
              this.Inquire()
            } else if (res.code === 400) {
              this.$confirm(res.message.msg, 'Tips', {
                confirmButtonText: 'Submit',
                type: 'warning'
              }).then(() => {
                const dialogForm = this.dialogForm
                this.$set(dialogForm, 'type', res.message.code)
                allGoodsSelectStore(dialogForm).then(res => {
                  if (res.code === 200) {
                    this.$message.success(res.message)
                    this.$refs[formName].resetFields()
                    this.dialogvisible = false
                    this.Inquire()
                  }
                })
              })
            }
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.submitLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    filterOrders: debounce(function() {
      this.listQuery.page = 1
      this.Inquire()
    }, 1000),
    collectPrices() {
      if (this.productSelection.length === 0) {
        this.$message.warning('Please select at least one piece of data!')
      } else {
        this.vendorVisible = true
      }
    },
    providerAdd(type) {
      if (type === 1) {
        this.$refs.vendorForm.validate((valid) => {
          if (valid) {
            const ids = []
            this.productSelection.map(it => {
              ids.push(it.id)
            })
            const formData = {
              product_id: ids,
              service: this.vendorForm.service_id,
              country: this.vendorForm.country
            }
            createQuoted(formData).then(res => {
              if (res.code === 200) {
                if (res.message.code === 401) {
                  this.$message.warning(res.message.msg)
                  this.PromptVisible = true
                  this.ids.push(res.message.id)
                } else {
                  this.$message.success(res.message)
                  this.vendorVisible = false
                  this.vendorForm = this.$options.data().vendorForm
                }
              } else {
                this.$message.error(res.message.msg)
              }
            })
          } else {
            this.$message.warning('Please complete the required fields!')
            return false
          }
        })
      } else {
        this.vendorVisible = false
        this.vendorForm = this.$options.data().vendorForm
      }
    },
    country(rule, value, callback) {
      if (rule.required) {
        if ((value == null) || (value.length === 0)) {
          callback('please choose!')
        }
        if (value.length > 5) {
          callback('Choose no more than 5 countries')
        }
      }
      callback()
    },
    Prompt(type) {
      if (type === 1) {
        const formData = {
          product_id: this.ids,
          service: this.vendorForm.service_id,
          country: this.vendorForm.country,
          type: 1
        }
        createQuoted(formData).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.vendorVisible = false
            this.PromptVisible = false
            this.vendorForm = this.$options.data().vendorForm
          } else {
            this.$message.error(res.message.msg)
          }
        })
      } else if (type === 2) {
        let id = ''
        this.productSelection.map(it => {
          id = it.id
        })
        this.productAdd('edit', id)
        this.PromptVisible = false
        this.vendorVisible = false
      } else {
        this.PromptVisible = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.product {
  margin: 20px 30px !important;
  .button-border {
    border: 1px solid #ef6f38;
    color: #ef6f38;
  }
}
</style>
