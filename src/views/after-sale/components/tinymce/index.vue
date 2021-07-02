<template>
  <div>
    <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
      <el-button type="text" class="reply" @click="handleReply">Reply</el-button>
      <textarea :id="tinymceId" class="tinymce-textarea" />
    </div>
  </div>
</template>

<script>
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one-lin@4.9.5/tinymce.min.js'

export default {
  name: 'tinymce',
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    readonly: {
      type: Number,
      default: 0
    },
    upload: {
      type: Boolean,
      default: true
    },
    print: {
      type: Boolean,
      default: true
    },
    baseImg: {
      type: Array,
      default: () => []
    },
    baseImgType: {
      type: String,
      default: ''
    },
    maxLength: {
      type: Number,
      default: 0
    },
    pageType: {
      type: String,
      default: ''
    }

  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      valueLength: 0,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (val) {
        if (this.pageType === 'lazada') {
          val = val.replace(/<p>/g, '<li>').replace(/<\/p>/g, '</li>')
          this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val || ''))
        }
        if (!this.hasChange && this.hasInit) {
          setTimeout(() => {
            this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val || ''))
          }, 100)
        }
      } else {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(''))
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    escape2Html(str) {
      var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' }
      if (str) {
        str = str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) { return arrEntities[t] })
        str = str.replace(/<\/?[^>]*>/g, '') // 去除HTML tag
        // str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
      }
      return str
    },
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce() {
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        // language: this.languageTypeList['zh'],
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: !false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        // branding: false,
        elementpath: false, // 左下角的当前标签路径
        statusbar: false,
        entity_encoding: 'raw', // 禁止转义
        init_instance_callback: editor => {
          if (this.value) {
            editor.setContent(this.value)
          }
          this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup: editor => {
          editor.on('FullscreenStateChanged', (e) => {
            this.fullscreen = e.state
          })
        },
        readonly: this.readonly
      })
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    execCommand(content) {
      window.tinymce.get(this.tinymceId).execCommand('mceInsertContent', false, content)
    },
    // 本地上传图片  添加到文本域
    imageSuccessCBK(arr) {
      const _this = this
      this.$emit('addPic', arr)
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v}" >`)
      })
    },
    // 从图片库选择图片  添加到文本域
    storeImg(arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v}" >`)
      })
    },
    handleReply() {
      this.$emit('reply')
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.reply {
  position: absolute;
  top: 0;
  right: 20px;
  z-index: 99999;
}
.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
.bottomText {
  color: #595959;
  padding: 0 5px;
  padding-top: 6px;
  font-size: 0.8em;
}
</style>
