<template>
  <div class="track-number-box">
    <div class="language-change-box">
      <el-row>
        <el-col :offset="11" :span="5">
          <img src="" style="width: 150px; height: 80px; background-color:#ccc;"/>
        </el-col>
        <el-col :offset="4" :span="4">
          <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
            <div>
              {{getLanguageLabel(language,languageList)}}
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
              <el-dropdown-item command="zh" :disabled="language==='zh'">简体中文</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
    <el-divider/>
    <div class="track-form-box">
      <el-form ref="trackNumberForm" label-position="top" :model="trackNumberForm" :rules="trackNumberFormRules">
        <el-row>
          <el-col :offset="6" :span="12">
            <el-form-item label="Enter the order number to query the order information for after-sales-service" prop="number" class="mt5">
              <el-input v-model="trackNumberForm.number" size="large" placeholder="Please enter order number"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" class="ml20 mt50">
              <el-button type="primary" size="large" @click="submitTrack">Track</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog
      title="Authentication"
      :visible.sync="dialogVisible"
      width="50%"
      top="40vh"
      :before-close="handleClose">
      <el-form ref="AuthenticationForm" label-position="top" :model="AuthenticationForm" :rules="AuthenticationRules">
        <el-form-item label="Please enter the email information you filled in when you purchased the product" prop="product">
          <el-input v-model="AuthenticationForm.product" size="large" placeholder="Please enter the email information you filled in when you purchased the product"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setToken } from '@/utils/auth'
import { setCookies } from '@/utils/cookies'

export default {
  name: 'track-number',
  data() {
    return {
      languageList: [
        {
          value: 'en',
          label: 'English'
        },
        {
          value: 'zh',
          label: '简体中文'
        }
      ],
      trackNumberForm: {
        number: ''
      },
      trackNumberFormRules: {
        number: [
          { required: true, message: 'Please enter order number', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      AuthenticationForm: {
        product: ''
      },
      AuthenticationRules: {
        product: [
          { required: true, message: 'Please enter the email information you filled in when you purchased the product', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  created() {
    setToken(this.$route.query.token)
    setCookies(this.$route.query.uid)
    setCookies(this.$route.query.email)
    setCookies(this.$route.query.name)
    setCookies(this.$route.query.language)
  },
  methods: {
    // 切换语言
    handleSetLanguage(lang) {
      // 选择语言
      this.$i18n.locale = lang
      // 保存vuex
      this.$store.dispatch('app/setLanguage', lang)
      this.$message({
        message: 'switch language success',
        type: 'success'
      })
      // 触发重新加载事件
    },
    // 根据value显示label
    getLanguageLabel(val, list) {
      const arr = list.filter(e => e.value === val)
      if (arr.length > 0) {
        return arr[0].label
      } else {
        return val
      }
    },
    // 跟踪订单
    submitTrack() {
      this.$refs['trackNumberForm'].validate((valid) => {
        if (valid) {
          this.dialogVisible = true
        }
      })
    },
    // 关闭弹框
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 确认发送
    handleSubmit() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.track-number-box {
  background-color: #f1f1f1;
  .language-change-box {
    .international {
      width: 120px;
      height: 80px;
      background-color: #fff;
      text-align: center;
      line-height: 80px;
    }
  }
  .el-divider--horizontal {
    margin: 0!important;
  }
  .track-form-box {
    height: calc(94vh - 5px);
    padding-top: 100px;
  }
}
</style>
