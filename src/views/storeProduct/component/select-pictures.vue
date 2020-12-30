<template>
  <el-dialog
    class="edit-pictures-dialog"
    :visible.sync="dialogVisible"
    :title="title"
    width="50%"
  >
    <div class="upload-photos">
      <ul class="el-upload-list el-upload-list--picture-card">
        <li
          v-for="(file, index) in imgList"
          :key="index"
          :tabindex="index"
          class="el-upload-list__item"
          :class="[checkedImg == file.url ? 'active' : '']"
          @click="selectImg(file)"
        >
          <el-image :src="file.url" style="width: 100%; height: 100%" />
          <div class="bg selected" />
          <div v-if="checkedImg == file.url" class="icon">
            <svg-icon icon-class="checked" />
          </div>
          <div v-if="file.showProgress" class="upload-progress">
            <el-progress type="circle" :percentage="file.percent" />
          </div>
        </li>
        <div class="uploading">
          <el-upload
            ref="upload"
            accept="image/png, image/jpeg"
            class="upload-photos"
            drag
            multiple
            action
            :show-file-list="false"
            :http-request="upload"
            :before-upload="handleBeforeUpload"
            :on-change="handleChange"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              <em>Add media</em>
              <p>or drop files to upload</p>
            </div>
          </el-upload>
        </div>
      </ul>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close()">Cancel</el-button>
      <el-button size="small" type="primary" @click="submit()">Submit</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { uploadImage } from '@/api/product'
export default {
  name: 'select-pictures',
  components: { },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Select variant image'
    },
    flag: {
      type: String,
      default: 'view'
    },
    checked: {
      type: String,
      default: ''
    },
    formData: {
      type: [Object, Array],
      default: () => {}
    },
    showClose: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      imgList: [],
      fileList: [],
      uploadVisible: false,
      checkedImg: '' // 已选中图片
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
  watch: {
    formData: {
      handler(newVal) {
        if (Array.isArray(newVal)) {
          this.$set(this, 'imgList', Array.from(newVal))
        }
      },
      deep: true
    },
    checked(newVal) {
      this.checkedImg = newVal
    }
  },
  created() {},
  methods: {
    selectImg(file) {
      this.checkedImg = file.url
    },
    handleChange(file, fileList) {
      console.log('change', file)
    },
    handleBeforeUpload(file) {
      // const is1M = file.size / 1024 / 1024 < 1 // 限制小于1M
      const isSize = new Promise((resolve, reject) => {
        const isLt2M = file.size / 1024 / 1024 < 2
        isLt2M ? resolve() : reject(new Error('Error'))
      }).then(
        () => {
          return file
        },
        () => {
          this.$message.error('上传的图片大小超出2M！')
          return Promise.reject(new Error('Error'))
        }
      )
      return isSize
    },
    upload(fileObj) {
      const file = { showProgress: true, url: '', percent: 0 }
      this.imgList.push(file)
      const formData = new FormData()
      formData.append('file', fileObj.file)
      uploadImage(formData, (progress) => {
        file.percent = Math.round((progress.loaded / progress.total) * 100)
      }).then(res => {
        if (res.code === 200) {
          file.url = res.data['data-service-file']
          file.showProgress = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    close() {
      this.dialogVisible = false
    },
    submit() {
      this.$emit('select', this.checkedImg)
      this.$emit('update', this.imgList)
      this.close()
    }
  }
}
</script>
<style lang="scss" scoped>
.list-wrap {
  overflow: auto;
  height: 400px;
}
.el-upload-list__item {
  &.active {
    border-color: #5c6ac4;
    outline: none;
    .selected {
      opacity: .2;
    }
  }
}
.bg{
  position: absolute;
  z-index: 11;
  inset: 0px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  opacity: 0;
  background: #5c6ac4;
  border-radius: 5px;
}
.icon {
  position: absolute;
  top: 5px;
  left: 10px;
  z-index: 12;
  font-size: 22px;
}
</style>
