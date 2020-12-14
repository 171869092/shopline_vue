<template>
  <div>
    <el-dialog
      title="Select variant image"
      :visible.sync="visible"
      width="40%"
      :before-close="handleClose"
    >
      <div class="gridbox">
        <div
          v-for="($item, $index) in pictureList"
          :key="$index"
          class="img_item"
          :class="[checked === $item.url ? 'active' : '']"
          @click="selectImg($item)"
        >
          <div class="bg selected" />
          <div class="variant-image">
            <img
              class="image"
              :src="$item.url"
              alt=""
            >
          </div>
          <div v-if="checked === $item.url" class="icon">
            <svg-icon icon-class="gou" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">Cancel</el-button>
        <el-button
          v-if="isUpload"
          type="primary"
          size="small"
          @click="openUploadPrint"
        >Add image</el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleClose(1)"
        >Submit</el-button>
      </span>
    </el-dialog>

    <upload-print :visible="uploadPrintvisible" @close="uploadPrint" />
  </div>
</template>

<script>
export default {
  name: 'edit-print',
  components: {
    UploadPrint: () => import('./uploadPrint')
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isUpload: {
      type: Boolean,
      default: false
    },
    skuImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isCheckAll: false, // 是否有选项
      checked: '', // 已选中图片
      pictureList: [], // 图片数组
      uploadPrintvisible: false,
      disabled: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.checked = this.skuImg
        this.$set(this, 'pictureList', this.$parent.formData.images)
      } else {
        this.checked = ''
        // this.pictureList = []
      }
    }
  },

  mounted() {},
  methods: {
    handleClose(type) {
      if (type !== 1) {
        this.$emit('close', 1)
        return
      }
      this.$emit('close', { checked: this.checked, list: this.pictureList })
    },
    // 单选
    checkedChange(value) {
      this.checkTurn = false
    },
    // 打开本地上传
    openUploadPrint() {
      this.uploadPrintvisible = true
    },
    selectImg(item) {
      this.checked = item.url
    },
    // 关闭本地上传
    uploadPrint(type) {
      if (type === 1) {
        this.uploadPrintvisible = false
        return
      }
      type.forEach((item, idx) => {
        this.pictureList.push({
          url: item,
          title: '本地上传' + (idx + 1)
        })
      })
      this.uploadPrintvisible = false
    }
  }
}
</script>

<style scoped lang='scss'>
>>> .el-dialog__body {
  min-height: 400px !important;
  overflow: auto !important;
  padding: 5px 20px;
}

.printTitle {
  background: #f8f8f8;
  line-height: 24px;
  padding: 8px;
  width: 100%;
}
.gridbox {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.8rem;
  user-select: none;
}
.add_img {
  border: 0.2rem dashed #919eab;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 0.8rem;
  outline: none;
  background-color:  #fff;
  .tip-1 {
    font-size: 14px;
    margin-top: 0.8rem;
    color: var(--p-interactive,#006fbb);
    line-height: 2rem;
  }
  .tip-2 {
    font-size: 12px;
  }
}
.img_item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0px;
  padding: 0px;
  border: 0.1rem solid var(--p-border-subdued, #dfe3e8);
  background: var(--p-background, #f4f6f8);
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    border-color: rgba(69, 143, 255, 1);
  }
  &.active {
    border-color: var(--p-interactive, #5c6ac4);
    outline: none;
    .bg {
      position: absolute;
      z-index: 11;
      inset: 0px;
      display: flex;
      flex-flow: column wrap;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      opacity: 0;
      background: var(--p-interactive-default,#5c6ac4);
      border-radius: 5px;
      &.selected {
        opacity: 0.2;
      }
    }
  }

  .variant-image {
    z-index: 5;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-radius: 5px;
    transform: translateZ(0px);
    overflow: hidden;
    .image {
      // height: 120px;
      // position: absolute;
      // z-index: 1;
      width: 145px;
      height: 135.5px;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .icon {
    position: absolute;
    top: 5px;
    left: 10px;
    z-index: 12;
    font-size: 22px;
    // color: #67C23A;
  }
}
</style>
