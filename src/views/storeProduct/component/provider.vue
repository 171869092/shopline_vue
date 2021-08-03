<template>
  <div>
    <el-dialog :title="$parent.providerTitle" :visible.sync="visible" width="700px" :before-close="providerAdd" center>
      <el-form ref="providerForm" :model="providerForm" size="small" label-width="170px" :rules="rules">
        <el-form-item label="Vendor:" prop="service_id">
          <el-select v-model="providerForm.service_id" filterable class="w-350" placeholder="please choose">
            <el-option v-for="item in ServiceList" :key="item.id" :label="item.service_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Countries:" prop="country" :rules="[{required: true,validator: country,trigger: 'change'}]">
          <el-select v-model="providerForm.country" multiple filterable class="w-350" placeholder="please choose">
            <el-option v-for="item in countriesList" :key="item.two_code" :label="item.name_en" :value="item.two_code" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="providerAdd">Cancel</el-button>
        <el-button size="small" type="primary" :loading="loading" @click="providerAdd(1)">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getServiceList, getProductService, getCountryList } from '@/api/product'
var country = (rule, value, callback) => {
  if (rule.required) {
    if ((value == null) || (value.length === 0)) {
      callback('please choose!')
    }
    if (value.length > 5) {
      callback('Choose no more than 5 countries')
    }
  }
  callback()
}
export default {
  name: 'provider',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    store_url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      country,
      providerForm: {
        service_id: '',
        country: []
      },
      ServiceList: [],
      countriesList: [],
      rules: {
        service_id: [
          { required: true, message: 'please choose', trigger: 'change' }
        ]
      },
      loading: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
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
      } else {
        this.$refs.providerForm.resetFields()
      }
    }
  },
  methods: {
    providerAdd(type) {
      this.$set(this.providerForm, 'store_url', this.store_url)
      if (type === 1) {
        this.$refs.providerForm.validate((valid) => {
          if (valid) {
            if (this.$parent.providerTitle === 'Hosting') {
              this.loading = true
              this.providerForm.product_list = this.$parent.productSelection.map(item => {
                return {
                  id: item.id
                }
              })
              getProductService(this.providerForm).then(res => {
                if (res.code === 200) {
                  this.$emit('providerAdd')
                  this.loading = false
                  this.$message.success(res.message)
                }
              }).catch(() => {
                this.loading = false
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$emit('providerAdd', 1)
      }
    }
  }
}
</script>
