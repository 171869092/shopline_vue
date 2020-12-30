<template>
  <div class="grid-content upload-photos bg-white">
    <ul class="el-upload-list el-upload-list--picture-card">
      <draggable v-model="fileList" tag="span">
        <li
          v-for="(file, index) in fileList"
          :key="index"
          :tabindex="index"
          class="el-upload-list__item "
          :class="[file.showProgress ? 'is-ready': 'is-success' ]"
          @keydown.delete="deleteImg(index)"
        >
          <el-image :src="file.url" style="width: 100%; height: 100%" />
          <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-check" />
          </label>
          <div v-if="file.showProgress" class="upload-progress">
            <el-progress type="circle" :percentage="file.percent" />
          </div>
          <i class="el-icon-close" />
          <i class="el-icon-close-tip">按 delete 键可删除</i><!---->
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="previewImg(file)"><i class="el-icon-zoom-in" /></span>
            <span class="el-upload-list__item-delete" @click="deleteImg(index)"><i class="el-icon-delete" /></span>
          </span>
        </li>
      </draggable>
      <div id="updataDrag" class="uploading">
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
    <el-dialog :visible.sync="dialogVisible">
      <!-- <img :width="imgWidth" :height="imgHeight" :src="dialogImageUrl" alt=""> -->
      <el-image style="width: 100%; height: 600px" :src="dialogImageUrl" fit="scale-down">
        <div slot="placeholder" class="image-slot">
          loading<span class="dot">...</span>
        </div>
      </el-image>
    </el-dialog>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { uploadImage } from '@/api/product'
export default {
  name: 'shop-window',
  components: {
    draggable
  },
  props: {
    imgList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isShow: true,
      showFlag: false,
      percent: 0,
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      imgWidth: '1920',
      imgHeight: '1080'
    }
  },
  computed: {},
  watch: {
    imgList: {
      handler(newVal) {
        this.$set(this, 'fileList', newVal)
      },
      deep: true
    }
  },
  created() {},
  methods: {
    handleChange(file, fileList) {
      // console.log('change', file)
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
      this.fileList.push(file)
      const formData = new FormData()
      formData.append('file', fileObj.file)
      uploadImage(formData, (progress) => {
        file.percent = Math.round((progress.loaded / progress.total) * 100)
      }).then(res => {
        if (res.code === 200) {
          file.url = res.data['data-service-file']
          file.showProgress = false
          this.$emit('update', this.fileList)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    previewImg(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    deleteImg(index) {
      this.$confirm('此操作将删除该文件, 是否继续?', '删除图片？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete', this.fileList[index].url)
        this.fileList.splice(index, 1)
        this.$emit('update', this.fileList)
      }).catch(() => {})
    }
  }
}
</script>
<style scoped>
</style>
