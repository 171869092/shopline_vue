<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :modal-append-to-body="true"
    width="700px"
    center
    @open="handleOpen"
  >
    <el-form ref="providerForm" :model="providerForm" size="small" label-width="170px" :rules="rules">
      <el-form-item label="Vendor:" prop="service_id">
        <el-select v-model="providerForm.service_id" filterable class="w-350">
          <el-option v-for="item in ServiceList" :key="item.id" :label="item.service_name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="Countries:" prop="country" :rules="[{required: true,validator: country,trigger: 'change'}]">
        <el-select v-model="providerForm.country" multiple filterable class="w-350">
          <el-option v-for="(item, key) in countriesList" :key="key" :label="item.name_en" :value="item.two_code" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeDialog()">Cancel</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="submit('providerForm')">Done</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getServiceList, getCountryList } from '@/api/product'
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
  name: 'hosting',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Unhosting Products'
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
        service_id: [{ required: true, message: 'please choose', trigger: 'change' }]
      },
      loading: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(newVal, oldVal) {
        this.$emit('update:visible', newVal)
      }
    }
  },
  methods: {
    handleOpen() {
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
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.providerForm)
          this.$emit('select', data)
          this.$refs.providerForm.resetFields()
          this.dialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeDialog() {
      this.$refs.providerForm.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
