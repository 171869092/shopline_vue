<template>
  <div>
    <el-dialog :title="$parent.providerTitle" :visible.sync="visible" width="700px" :before-close="providerAdd" center>
      <el-form ref="providerForm" :model="providerForm" size="small" label-width="170px" :rules="rules">
        <el-form-item label="Vendor:" prop="service_id">
          <el-select v-model="providerForm.service_id" filterable class="w-350">
            <el-option v-for="item in ServiceList" :key="item.id" :label="item.service_name" :value="item.id" />
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
import { getServiceList, getProductService } from '@/api/product'
export default {
  name: 'provider',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      providerForm: {
        service_id: ''
      },
      ServiceList: [],
      rules: {
        service_id: [
          { required: true, message: 'please choose', trigger: 'blur' }
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
      } else {
        this.$refs.providerForm.resetFields()
      }
    }
  },
  methods: {
    providerAdd(type) {
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
