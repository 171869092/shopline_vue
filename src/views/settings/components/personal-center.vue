<template>
  <div class="personal-center">
    <el-card class="box-card">
      <div class="flexbox justify-space-between">
        <p>Personal</p>
        <el-button type="primary" size="small" @click="modifyUserInformation" class="mr10 mb10">Storage</el-button>
      </div>
      <el-divider class="line"/>
      <el-form ref="personal" :model="basicsForm" status-icon :rules="personalRules" label-width="150px" class="form-box">
        <div class="basics-box">
          <el-form-item label="Name" prop="name">
            <el-input v-model="basicsForm.name" type="text" autocomplete="off" />
          </el-form-item>
          <el-form-item label="E-mail" prop="email">
            <el-input v-model="basicsForm.email" type="text" autocomplete="off" :readonly="readonly"/>
            <el-button type="text" class="change-email" @click="readonly = false">Change email address</el-button>
          </el-form-item>
        </div>
        <div class="basics-tow-box">
          <el-form-item label="Lastname" prop="lastname">
            <el-input v-model="basicsForm.lastname" type="text" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Telephone" prop="phone">
            <el-input v-model="basicsForm.phone" type="text" autocomplete="off" />
          </el-form-item>
        </div>
        <div class="image-box">
          <div class="upload-box">
            <img v-if="!showImg" :src="basicsForm.enterprise_logo" style="height: 100px;width: 100px"/>
          </div>
          <el-upload
            ref="upload"
            accept="image/png, image/jpeg"
            class="upload-photos"
            action
            :show-file-list="false"
            :http-request="upload"
            :before-upload="handleBeforeUpload"
            :on-change="handleChange">
            <div class="el-upload__text">
              <em>Change Your Avatar</em>
            </div>
          </el-upload>
        </div>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <p>Shops</p>
      <el-divider class="line"/>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        fit
        stripe
        :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}">
        <el-table-column label="Shop name">
          <template slot-scope="scope">
            <div>{{ scope.row.store_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Links">
          <template slot-scope="scope">
            <span>{{ scope.row.store_url }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { uploadImage } from '@/api/product'
import { findUserInfo, getGoodsStoreList, updateUserInfo } from '@/api/user'

export default {
  name: 'personal-center',
  created() {
    this.init()
  },
  data() {
    return {
      basicsForm: {
        name: '',
        email: '',
        lastname: '',
        phone: '',
        enterprise_logo: ''
      },
      personalRules: {},
      showImg: true,
      readonly: true,
      tableData: []
    }
  },
  methods: {
    upload(fileObj) {
      const file = { showProgress: true, url: '', percent: 0 }
      const formData = new FormData()
      formData.append('file', fileObj.file)
      uploadImage(formData, (progress) => {
        file.percent = Math.round((progress.loaded / progress.total) * 100)
      }).then(res => {
        if (res.code === 200) {
          const data = JSON.parse(JSON.stringify(res.data))
          file.url = data['data-service-file']
          file.showProgress = false
          this.basicsForm.enterprise_logo = data['data-service-file']
          this.showImg = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange(file, fileList) {
      // console.log('change', file)
    },
    handleBeforeUpload(file) {
      const isSize = new Promise((resolve, reject) => {
        const isLt2M = file.size / 1024 / 1024 < 2
        isLt2M ? resolve() : reject(new Error('Error'))
      }).then(
        () => {
          return file
        },
        () => {
          this.$message.error('The uploaded image size exceeds 2M！')
          return Promise.reject(new Error('Error'))
        }
      )
      return isSize
    },
    // 初始化
    init() {
      this.handleGetBasicUserInformation()
      this.handleGetShop()
    },
    // 获取用户基本信息
    handleGetBasicUserInformation() {
      findUserInfo().then(res => {
        if (res.code === 200) {
          this.basicsForm = res.data
          console.log('111----', res.data)
        }
      })
    },
    // 获取店铺
    handleGetShop() {
      getGoodsStoreList().then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          console.log('222---', res.data)
        }
      })
    },
    // 修改用户信息
    modifyUserInformation() {
      const formData = { ...this.basicsForm }
      updateUserInfo(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('Data modified successfully!')
          this.init()
        } else {
          this.$message.warning('Data modification failed!')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.personal-center {
  .line {
    margin-top: 0;
  }
  .box-card {
    margin-bottom: 20px;
  }
  .form-box {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    .change-email {
      color: #409EFF;
      text-decoration: underline;
    }
    .image-box {
      display: flex;
      .upload-box {
        margin-left: 50px;
        width: 100px;
        height: 100px;
        background-color: #f00;
        border-radius: 50%;
      }
      .el-upload__text {
        margin: 40px 0 0 20px;
        text-decoration: underline;
        color: #409EFF;
      }
    }
  }
}
</style>
