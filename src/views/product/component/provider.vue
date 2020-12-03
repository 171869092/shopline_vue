<template>
  <div>
    <el-dialog :title="$parent.providerTitle" :visible.sync="visible" width="700px" :before-close="providerAdd" center>
      <el-form ref="providerForm" :model="providerForm" size="small" label-width="170px" :rules="rules">
        <el-form-item label="Vendor:" prop="provider_name">
          <el-select v-model="providerForm.value" filterable  class="w-350">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="providerAdd">Cancel</el-button>
        <el-button size="small" type="primary" @click="providerAdd(1)">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { providerSave, providerDataList, providerEdit } from '@/api/information'
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
        api_key: '',
      },
      options:[],
      rules: {
        provider_name: [
          { required: true, message: '请填写店铺代号', trigger: 'blur' }
        ],
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        
      } else {
        this.$refs.providerForm.resetFields()
      }
    }
  },
  methods: {
    providerAdd(type) {
      if (type == 1) {
        this.$refs.providerForm.validate((valid) => {
          if (valid) {
            const params = JSON.parse(JSON.stringify(this.providerForm))
            if (this.$parent.providerTitle == 'Provider') {
              providerSave(params).then(res => {
                if (res.code == 200) {
                  this.$emit('providerAdd')
                  this.$message.success(res.message)
                }
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
