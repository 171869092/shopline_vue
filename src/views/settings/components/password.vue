<template>
  <div class="password">
    <el-form ref="ruleForm" :model="passwordForm" status-icon :rules="rules" label-width="150px" class="form-box">
      <div class="password-box">
        <el-form-item label="Original password" prop="old_password">
          <el-input v-model="passwordForm.old_password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Change password" prop="password">
          <el-input v-model="passwordForm.password" type="password" autocomplete="off" />
        </el-form-item>
      </div>
      <div class="submit-box">
        <el-form-item>
          <el-button v-throttle="[submitForm]" type="primary">Confirm change</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { changePassword } from '@/api/user'
export default {
  name: 'password',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter the password'))
      } else {
        if (this.passwordForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validateChangePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter the password to be modified'))
      } else {
        callback()
      }
    }
    return {
      passwordForm: {
        old_password: '',
        password: ''
      },
      rules: {
        old_password: [
          { required: false, validator: validatePass, trigger: 'blur' }
        ],
        password: [
          { required: false, validator: validateChangePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          changePassword(this.passwordForm).then(res => {
            if (res.code === 200) {
              this.$confirm('Password reset complete，Please click to jump to the login page！', 'Operation tips', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$router.push({ name: 'login' })
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.password {
  padding: 20px 10px;
  .form-box {
    display: grid;
    grid-template-columns: 3fr 1fr;
    .submit-box {
      margin-top: 30px;
    }
  }
}
</style>
