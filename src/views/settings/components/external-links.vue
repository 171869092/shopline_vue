<template>
  <div class="external-links-box">
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%">
      <el-table-column label="Title">
        <template slot-scope="scope">
          <span class="link" @click="handleOpenDialog">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Links">
        <template slot-scope="scope">
          <span class="pointer" @click="handleOpenNewWindow">{{ scope.row.store_url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation">
        <template slot-scope="scope">
          <span>{{ scope.row.operation }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="New Template"
      :visible.sync="dialogVisible"
      top="10vh"
      width="50%"
      :before-close="handleClose">
      <el-form ref="AuthenticationForm" label-width="100px" label-position="left" :model="newTemplateForm" :rules="newTemplateFormRules">
        <el-form-item label="Title" prop="template_name">
          <el-input v-model="newTemplateForm.template_name" autocomplete="off" placeholder="Template Title"/>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="newTemplateForm.description" autocomplete="off" placeholder="Template Description"/>
        </el-form-item>
        <el-form-item label="Store" prop="store_url">
          <el-select v-model="newTemplateForm.store_url" multiple placeholder="Select Store" style="width:100%">
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.store_name"
              :value="item.store_url"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select v-model="newTemplateForm.template_uses" style="width:100%">
            <el-option
              v-for="(item,key) in templateTypeList"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Name" prop="sender_name">
          <el-input v-model="newTemplateForm.sender_name" autocomplete="off" placeholder="Sender Name"/>
        </el-form-item>
        <el-form-item label="Content" prop="template_content">
          <tinymce ref="externalTinymce" v-model="newTemplateForm.template_content" menubar :height="300" />
        </el-form-item>
        <el-form-item>
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="primary" size="small">
              Insert Variable
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">Order Number</el-dropdown-item>
              <el-dropdown-item command="b">Tracking Number</el-dropdown-item>
              <el-dropdown-item command="c">Order Info</el-dropdown-item>
              <el-dropdown-item command="d">Consignee</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="link ml10" @click="dialogTableVisible = true">Variable specification</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCancel">Close</el-button>
        <el-button type="primary" @click="handleSave">Save</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Variable specification" :visible.sync="dialogTableVisible">
      <div class="mb20">The SMS template can contain variables, and the variables represent the content that the user wants to customize and change when the SMS is actually sent. A text description should be added before and after the variable to reflect the commercial intention of the template user.</div>
      <el-table border :data="gridData" :header-cell-style="{background:'#F3F5F9FF',color:'#262B3EFF'}">
        <el-table-column property="type" label="Category" width="150" />
        <el-table-column property="description" label="Description" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getCookies } from '@/utils/cookies'
import { getStoreList } from '@/api/product'
import { template_uses_list } from '@/api/notifications'

export default {
  name: 'external-links',
  components: {
    Tinymce: () => import('@/components/Tinymce')
  },
  data() {
    return {
      tableData: [
        {
          title: '物流查询',
          store_url: 'www.dkwuliuchaxun.com',
          operation: 'copy'
        },
        {
          title: '售后申请',
          store_url: 'www.dkshoushenqing.com',
          operation: 'copy'
        }
      ],
      dialogVisible: false,
      dialogTableVisible: false,
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
      storeList: [],
      templateTypeList: {},
      gridData: [
        { type: 'Variable format', description: '${name}, ${content}, etc. The middle letter should represent the variable attribute.' },
        { type: 'Variable name', description: '1~20 characters, the first letter must be an English letter, only supports letters, numbers and underscores, cannot be pure numbers, and cannot be email, mobile, id, nick, site, etc.' },
        { type: 'Other specifications', description: 'The notification template can add links, but it does not support setting variable links, such as www.${site}.cn, nor does it support the direct combination of short links and variables. For example: t.cn${code}, t.cn is a short link, and ${code} is a variable. For example, the format of www.****.com/${order_id} is allowed, but you are reminded that for the specific URL, the reviewer will review it, and it can be used only after the review is passed.' }
      ]
    }
  },
  methods: {
    // 打开新窗口
    handleOpenNewWindow() {
      const token = getToken()
      const uid = getCookies('uid')
      const email = getCookies('email')
      const name = getCookies('name')
      const language = getCookies('language')
      const routeUrl = this.$router.resolve({ path: '/track', query: { token: token, uid: uid, email: email, name: name, language: language }})
      window.open(routeUrl.href, '_blank')
    },
    // 关闭弹框
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 取消保存
    handleCancel() {
      this.dialogVisible = false
    },
    // 保存
    handleSave() {
      this.dialogVisible = false
    },
    // 点击标题
    handleOpenDialog() {
      this.dialogVisible = true
    },
    init() {
      getStoreList().then(res => {
        if (res.code === 200) {
          this.storeList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
      template_uses_list().then(res => {
        if (res.code === 200) {
          this.templateTypeList = res.data
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
