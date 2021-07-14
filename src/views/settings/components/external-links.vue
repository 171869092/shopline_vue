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
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Links">
        <template slot-scope="scope">
          <span class="pointer" @click="handleOpenNewWindow">{{ scope.row.store_url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation">
        <template slot-scope="scope">
          <span id="copy_text" class="pointer" :data-clipboard-text="'https://app.fbali.co/track?clipboard=' + copyClipboard" @click="copy">{{ scope.row.operation }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import { getCookies } from '@/utils/cookies'
import { afterSalesGenerateKey } from '@/api/user'

export default {
  name: 'external-links',
  data() {
    return {
      tableData: [
        {
          title: 'After sales application',
          store_url: 'www.dkshoushenqing.com',
          operation: 'copy'
        }
      ],
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
      ]
    }
  },
  created() {
    this.tableData.map(it => {
      this.$set(it, 'uid', getCookies('uid'))
    })
    this.init()
  },
  methods: {
    // 打开新窗口
    handleOpenNewWindow() {
      afterSalesGenerateKey().then(res => {
        if (res.code === 200) {
          const language = getCookies('language')
          const routeUrl = this.$router.resolve({ path: '/track', query: { clipboard: this.copyClipboard, language: language }})
          window.open(routeUrl.href, '_blank')
        }
      }).catch(e => {
        this.$message.error(e)
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
    init() {
      afterSalesGenerateKey().then(res => {
        if (res.code === 200) {
          this.copyClipboard = JSON.stringify(res.data)
        }
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
    }
  }
}
</script>

<style scoped lang="scss">
.external-links-box {
  min-height: 800px;
  background-color: #fff;
  padding: 20px;
}
</style>
