<template>
  <div class="external-links-box">
    <el-table
      ref="multipleTable"
      empty-text="No Data"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column label="Title">
        <template slot-scope="scope">
          <!--          <span class="link" @click="handleOpenDialog">{{ scope.row.title }}</span>-->
          <span>{{ scope.row.store_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Links">
        <template slot-scope="scope">
          <span class="pointer text" @click="handleOpenNewWindow(scope.row)">{{ scope.row.store_url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation">
        <template slot-scope="scope">
          <span class="mr50 pointer text" @click="handleOpenConfigure(scope.row)">Configure</span>
          <span id="copy_text" class="pointer text" :data-clipboard-text="scope.row.cust_link  +'/track?safe=' + copyClipboard + '&url=' + scope.row.store_url + '&icon=' + scope.row.favicon" @click="copy">{{ scope.row.operation }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
    <el-dialog
      title="Configure"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form label-position="right" label-width="80px" :model="formLabelAlign">
        <el-form-item label="Links:">
          <span>{{ formLabelAlign.link }}</span>
        </el-form-item>
        <el-form-item label="Logo:">
          <div class="image-box">
            <div class="contain-box">
              <el-image :src="formLabelAlign.logo">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"/>
                </div>
              </el-image>
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
                <em>Change Logo</em>
              </div>
              <span>150*60px</span>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">Close</el-button>
        <el-button @click="handleOpenNewWindow(formLabelAlign.logo)">Preview</el-button>
        <el-button type="primary" @click="handleSave">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import { getCookies } from '@/utils/cookies'
import { afterSalesGenerateKey, afterSalesEditIcon } from '@/api/user'
import { shopList } from '@/api/shop'
import { uploadImage } from '@/api/product'

export default {
  name: 'external-links',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  data() {
    return {
      formQuery: {},
      listQuery: {
        total: 0,
        page: 1,
        limit: 10
      },
      tableData: [
        {
          title: 'After sales application',
          store_url: 'www.dkshoushenqing.com',
          operation: 'copy',
          cust_link: process.env.VUE_APP_BASE_URLS
        }
      ],
      dialogVisible: false,
      copyClipboard: '',
      newTemplateForm: {
        template_name: '',
        description: '',
        store_url: '',
        template_uses: '',
        sender_name: '',
        template_content: ''
      },
      newTemplateFormRules: {
        template_name: [
          { required: true, message: 'Can not be empty!', trigger: 'blur' }
        ],
        store_url: [
          { required: true, message: 'Please choose the store!', trigger: 'blur' }
        ],
        type: [
          { required: true, message: 'Please choose the type!', trigger: 'blur' }
        ],
        sender_name: [
          { required: true, message: 'Can not be empty!', trigger: 'blur' }
        ],
        template_content: [
          { required: true, message: 'Can not be empty!', trigger: 'blur' }
        ]
      },
      gridData: [
        { type: 'Variable format', description: '${name}, ${content}, etc. The middle letter should represent the variable attribute.' },
        { type: 'Variable name', description: '1~20 characters, the first letter must be an English letter, only supports letters, numbers and underscores, cannot be pure numbers, and cannot be email, mobile, id, nick, site, etc.' },
        { type: 'Other specifications', description: 'The notification template can add links, but it does not support setting variable links, such as www.${site}.cn, nor does it support the direct combination of short links and variables. For example: t.cn${code}, t.cn is a short link, and ${code} is a variable. For example, the format of www.****.com/${order_id} is allowed, but you are reminded that for the specific URL, the reviewer will review it, and it can be used only after the review is passed.' }
      ],
      formLabelAlign: {
        link: '',
        logo: ''
      },
      cust_link: '',
    }
  }
  ,
  created() {
    console.log(999)
    this.tableData.map(it => {
      this.$set(it, 'uid', getCookies('uid'))
    })
    this.init()
    this.Inquire()
    // 禁止复制
    this.$nextTick( () => {
      // 禁用右键
      document.oncontextmenu = new Function("event.returnValue=false");
      // 禁用选择
      document.onselectstart = new Function("event.returnValue=false");
    })
  },
  methods: {
    // 打开新窗口
    handleOpenNewWindow(val) {
      const routeUrl = this.$router.resolve({ path: '/track', query: { safe: this.copyClipboard, url: val.store_url, icon: val.favicon }})
      window.open(routeUrl.href, '_blank')
    },
    init() {
      afterSalesGenerateKey().then(res => {
        if (res.code === 200) {
          this.copyClipboard = res.data.safe
        }
      })
    },
    Inquire() {
      this.formQuery.iDisplayLength = this.listQuery.limit
      this.formQuery.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      shopList(this.formQuery).then(res => {
        console.log(res.data)
        if (res.code === 200) {
          this.tableData = res.data.data
          this.tableData.map(it => {
            this.$set(it, 'operation', 'copy')
            this.$set(it, 'cust_link', process.env.VUE_APP_BASE_URLS)
          })
          this.listQuery.total = +res.data.pagination.totalCount
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 下拉选择
    handleCommand(command) {
      switch (command) {
        case 'a':
          this.$refs.externalTinymce.execCommand('${order_number')
          break
        case 'b':
          this.$refs.externalTinymce.execCommand('${tracking_number')
          break
        case 'c':
          this.$refs.externalTinymce.execCommand('${order_info')
          break
        case 'd':
          this.$refs.externalTinymce.execCommand('${consignee')
          break
        default:
          break
      }
    },
    // 复制
    copy() {
      const clipboard = new Clipboard('#copy_text')
      clipboard.on('success', e => {
        this.$message.success('Copy successfully！')
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        this.$message.warning('This browser does not support automatic copy！')
        clipboard.destroy()
      })
    },
    // 配置
    handleOpenConfigure(val) {
      this.dialogVisible = true
      this.formLabelAlign.link = val.store_url
      this.formLabelAlign.logo = val.favicon
      this.formLabelAlign.id = val.id
    },
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
          this.$set(this.formLabelAlign, 'logo', data['data-service-file'])
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
    // 关闭弹框
    handleClose() {
      this.dialogVisible = false
      this.formLabelAlign = this.$options.data().formLabelAlign
    },
    handleSave() {
      const obj = {
        id: this.formLabelAlign.id,
        favicon: this.formLabelAlign.logo
      }
      afterSalesEditIcon(obj).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.handleClose()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.external-links-box {
  background-color: #fff;
  padding: 20px;
  .text {
    color: #2c6ecb;
  }
  .image-box {
    display: flex;
    .contain-box {
      width: 140px;
      height: 100px;
      overflow: hidden;
      ::v-deep.image-slot {
        width: 140px;
        height: 100px;
        background-color: #d2d3d3;
        i {
          font-size: 30px;
        }
      }
    }
    .el-upload__text {
      margin: 40px 0 0 20px;
      text-decoration: underline;
      color: #409EFF;
    }
  }
}
</style>
