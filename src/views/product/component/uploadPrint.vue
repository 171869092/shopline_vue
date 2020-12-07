<template>
  <div>
    <el-dialog title="Add image" :visible.sync="dialogVisible" width="33%">
      <!-- accept="image/png, image/jpeg" -->
      <el-upload
        ref="myUpload"
        action="null"
        class="uploadBox"
        list-type="picture-card"
        :multiple="true"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :before-upload="handleBeforeUpload"
        :auto-upload="false"
      >
        <i class="el-icon-plus" />
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose(1)">Cancel</el-button>
        <el-button type="primary" size="small" :loading="savePicLoading" @click="submit()">Submit</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { uploadImage } from '@/api/product'
export default {
  name: 'upload-print',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      perUploadList: [],
      uploadList: [],
      savePicLoading: false

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
  mounted() {

  },
  methods: {
    // 关闭弹窗
    handleClose(type) {
      if (type === 1) {
        this.$emit('close', 1)
      }
    },
    handleChange(file, fileList) {
      // console.log(file, fileList)
      this.perUploadList = fileList
    },
    // 本地上传  数据删除
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.perUploadList = fileList
    },
    // 本地上传  数据更改
    handleBeforeUpload(file) {
      // this.picUpLoadList.push(file)
    },
    // 异步上传图片
    upload(fileObj) {
      const formData = new FormData()
      formData.append('file', fileObj.raw)
      return new Promise((resolve, reject) => {
        uploadImage(formData).then(res => {
          resolve(res.data)
        }).catch(() => {
          this.savePicLoading = false
        })
      })
    },
    submit() {
      // this.$refs.myUpload.submit()
      const req = []
      this.savePicLoading = true
      this.perUploadList.forEach(item => {
        req.push(this.upload(item))
      })
      Promise.all(req).then(result => {
        const list = result.map(item => item['data-service-file'])
        this.$emit('close', list)
        this.$message.success('upload success')
        this.$refs['myUpload'].clearFiles()
        this.perUploadList = []
      }).finally(() => {
        this.savePicLoading = false
      })
    }
  }

}
</script>

<style scoped lang="scss">
// >>> .el-dialog__body{min-height: 500px!important;overflow: overlay!important}
</style>
