<template>
  <div v-if="trackUp" class="track-number-box">
    <div class="language-change-box">
      <el-row>
        <el-col :offset="11" :span="5">
          <img :src="icon" style="width: 150px; height: 80px; background-color:#ccc;">
        </el-col>
        <el-col :offset="4" :span="4">
          <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
            <div>
              <img src="@/assets/home/lang.png" height="20px" class="mr5">
              {{ getLanguageLabel(language,languageList) }}
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
              <!--              <el-dropdown-item command="zh" :disabled="language==='zh'">简体中文</el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
    <el-divider />
    <div class="track-form-box">
      <el-form ref="trackNumberForm" label-position="top" :model="trackNumberForm" :rules="trackNumberFormRules">
        <el-row>
          <el-col :offset="6" :span="12">
            <!--            <el-form-item :label="$t('track.trackNumberForm.label')" prop="number" class="mt5">
              <el-input v-model="trackNumberForm.number" size="large" :placeholder="$t('track.trackNumberForm.placeholder')" />
            </el-form-item>-->
            <el-form-item label="Enter the order number to query the order information for after-sales-service" prop="number" class="mt5">
              <el-input v-model="trackNumberForm.number" size="large" placeholder="Please enter order number" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" class="ml20 mt50">
              <!--              <el-button type="primary" size="large" @click="submitTrack">{{ $t('track.trackNumberForm.track') }}</el-button>-->
              <el-button type="primary" size="large" @click="submitTrack">Track</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="showDetails" class="order-detail">
      <el-table
        v-if="labelIsShow"
        :data="tableData"
        empty-text="No Data"
        style="width: 100%"
        highlight-current-row
        fit
        :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
        @select="shiftMultiple"
        @select-all="selectAll"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
          <template slot-scope="scope">
            <span v-if="item.type === undefined">{{ scope.row[item.value] }}</span>
            <span v-if="item.type === 'image'">
              <el-image class="sku_image" style="width: 50px; height: 50px" :src="scope.row.img_url" fit="cover">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" style="font-size: 30px;" />
                </div>
              </el-image>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogVisible" width="60%" class="p20 dialog-box">
        <el-form ref="dialogForm" :rules="dialogFormRules" :model="dialogForm" label-width="160px" label-position="left">
          <!--          <el-form-item :label="$t('track.detail.informationActive.products') + ':'" prop="product_json">-->
          <el-form-item label="After sale products :" prop="product_json">
            <el-input v-model="dialogForm.product_json" disabled />
            <!-- <el-select v-model="dialogForm.product_json" disabled :placeholder="$t('track.detail.informationActive.selectProducts')" multiple style="width:100%">
              <el-option
                v-for="(item, key) in productsList"
                :key="key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>-->
          </el-form-item>
          <el-row :gutter="77">
            <el-col :span="10">
              <!--              <el-form-item :label="$t('track.detail.informationActive.type') + ':'" prop="after_type">-->
              <el-form-item label="After sales type :" prop="after_type">
                <!--                <el-select v-model="dialogForm.after_type" :placeholder="$t('track.detail.informationActive.selectType')" style="width:100%">-->
                <el-select v-model="dialogForm.after_type" placeholder="Please Select Type" style="width:100%">
                  <el-option
                    v-for="(item, key) in typeList"
                    :key="key"
                    :label="item"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="4">
              <!--              <el-form-item :label="$t('track.detail.informationActive.mode') + ':'" prop="after_model">-->
              <el-form-item label="After sales mode :" prop="after_model">
                <!--                <el-select v-model="dialogForm.after_model" :placeholder="$t('track.detail.informationActive.selectMode')" style="width:100%">-->
                <el-select v-model="dialogForm.after_model" placeholder="Please Select Mode" style="width:100%">
                  <el-option
                    v-for="item in modeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!--          <el-form-item :label="$t('track.detail.informationActive.description')" prop="content" class="reply-box">-->
          <el-form-item label="Description" prop="reply_info" class="reply-box">
            <!--            <el-input v-model="dialogForm.content" type="textarea" :rows="8" :placeholder="$t('track.detail.informationActive.selectTextReply')" />-->
            <el-input v-model="dialogForm.reply_info" type="textarea" :rows="8" placeholder="Please enter your reply..." />
            <el-upload
              ref="upload"
              class="img-reply"
              accept="image/png, image/jpeg, video/mp4"
              drag
              multiple
              action
              :show-file-list="false"
              :http-request="upload"
              :before-upload="handleBeforeUpload"
              :on-change="handleChange"
            >
              <el-button size="small" type="text">Upload pictures</el-button>
            </el-upload>
            <div v-if="dialogForm.reply_img">
              <span v-for="(item, index) in dialogForm.reply_img" :key="index">
                <el-image v-if="item.type !== 'video/mp4'" :src="item.url" style="height: 100px;width: 120px" class="mt10 mr10" />
                <video v-if="item.type === 'video/mp4'" class="mt10 mr10" preload="metadata" :src="item.url" style="height: 100px;width: 120px" @click="handlePreview(item.url, item.type)" />
              </span>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!--          <el-button type="primary" @click="submit">{{ $t('track.detail.informationActive.sub') }}</el-button>-->
          <el-button type="primary" @click="submit">Submit</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="information-box">
      <div v-for="(item,index) in afterList" :key="index" class="tabs-box">
        <div v-if="showAfterSale">
          <el-tabs v-model="item.afterSalesActive" type="card" class="tabs" @tab-click="handleAfterSalesClick">
            <!--            <el-tab-pane :label="$t('track.detail.informationActive.firstLabel')" name="first">-->
            <el-tab-pane label="After sales information" name="first">
              <el-form ref="information" :model="item.afterSalesInformation" label-width="160px" label-position="left">
                <!--                <el-form-item :label="$t('track.detail.informationActive.products') + ':'">-->
                <el-form-item label="After sale products :">
                  <span class="in_txt">{{ item.afterSalesInformation.product_json[0].product_json }}</span>
                </el-form-item>
                <el-row :gutter="77">
                  <el-col :span="10">
                    <!--                    <el-form-item :label="$t('track.detail.informationActive.type') + ':'">-->
                    <el-form-item label="After sales type :">
                      <span class="in_txt">{{ typeList[item.afterSalesInformation.after_type] }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" :offset="4">
                    <!--                    <el-form-item :label="$t('track.detail.informationActive.mode') + ':'">-->
                    <el-form-item label="After sales mode :">
                      <span class="in_txt">{{ getValueOfLabel(item.afterSalesInformation.after_model, modeList) }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-tabs v-model="item.afterSalesInformation.innerAfterSalesActive" type="card">
                  <!--                  <el-tab-pane :label="$t('track.detail.informationActive.textReply')" name="first">-->
                  <el-tab-pane label="Text reply" name="first">
                    <el-input v-model="item.afterSalesInformation.reply_info" type="textarea" :rows="4" placeholder="Seriously damaged products need to be returned and replaced" />
                  </el-tab-pane>
                  <!--                  <el-tab-pane :label="$t('track.detail.informationActive.pictureReply')" name="second">-->
                  <el-tab-pane label="Picture reply" name="second">
                    <span v-for="(it, inx) in item.afterSalesInformation.reply_img" :key="inx">
                      <el-image v-if="it.type !== 'video/mp4'" :src="it.url" style="height: 100px;width: 120px" class="mt10 mr10" />
                      <video v-if="it.type === 'video/mp4'" class="mt10 mr10" preload="metadata" :src="it.url" style="height: 100px;width: 120px" @click="handlePreview(it.url, it.type)" />
                    </span>
                  </el-tab-pane>
                </el-tabs>
              </el-form>
            </el-tab-pane>
            <!--            <el-tab-pane :label="$t('track.detail.informationActive.secondLabel')" name="second">-->
            <el-tab-pane label="Feedback information" name="second">
              <el-form ref="information" :model="item.feedBackInformation" label-width="160px" label-position="left">
                <el-tabs v-model="item.feedBackInformation.innerAfterSalesActive" type="card">
                  <!--                  <el-tab-pane :label="$t('track.detail.informationActive.textReply')" name="first">-->
                  <el-tab-pane label="Text reply" name="first">
                    <el-input v-model="item.feedBackInformation.reply_info" type="textarea" readonly :rows="4" placeholder="Seriously damaged products need to be returned and replaced" />
                  </el-tab-pane>
                  <!--                  <el-tab-pane :label="$t('track.detail.informationActive.pictureReply')" name="second">-->
                  <el-tab-pane label="Picture reply" name="second">
                    <span v-for="(it, inx) in item.feedBackInformation.reply_img" :key="inx">
                      <el-image v-if="it.type !== 'video/mp4'" :src="it.url" style="height: 100px;width: 120px" class="mt10 mr10" />
                      <video v-if="it.type === 'video/mp4'" class="mt10 mr10" preload="metadata" :src="it.url" style="height: 100px;width: 120px" @click="handlePreview(it.url, it.type)" />
                    </span>
                    <!--                    <span v-for="(it, inx) in item.feedBackInformation.image" :key="inx">-->
                    <!--                      <el-image class="mt10 mr10" style="width: 50px; height: 50px" :src="it"></el-image>-->
                    <!--                    </span>-->
                  </el-tab-pane>
                </el-tabs>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-if="item.afterSalesActive === 'second'" class="after-btn-box">
          <!--          <el-button type="text" class="btn" @click="handleClickReply(item)">{{ $t('track.detail.reply') }}</el-button>-->
          <el-button type="text" class="btn" @click="handleClickReply(item)">reply</el-button>
          <!--          <el-button type="text" class="btn" @click="handleClickRecord">{{ $t('track.detail.record') }}</el-button>-->
          <el-button type="text" class="btn" @click="handleClickRecord">record</el-button>
        </div>
      </div>
      <div v-if="showAfterSaleBtn" class="btn-box">
        <!--        <el-button type="primary" class="btn" @click="handleClickAfterSales">{{ $t('track.detail.afterSales') }}</el-button>-->
        <el-button type="primary" class="btn" @click="handleClickAfterSales">After sales</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="replyVisible" width="60%" class="p20" @close="handleClose">
      <el-form ref="replyForm" :rules="replyRules" :model="replyForm">
        <el-form-item label="" prop="reply" class="feed-reply-box">
          <el-input v-model="replyForm.reply" type="textarea" :rows="10" placeholder="Please enter your reply..." />
          <el-upload
            ref="upload"
            class="img-reply"
            accept="image/png, image/jpeg, video/mp4"
            drag
            multiple
            action
            :show-file-list="false"
            :http-request="replyUpload"
            :before-upload="handleReplyBeforeUpload"
            :on-change="handleReplyChange"
          >
            <el-button size="small" type="text">Upload pictures</el-button>
          </el-upload>
          <div v-if="replyForm.reply_img">
            <span v-for="(item, index) in replyForm.reply_img" :key="index">
              <el-image v-if="item.type !== 'video/mp4'" :src="item.url" style="height: 100px;width: 120px" class="mt10 mr10" />
              <video v-if="item.type === 'video/mp4'" class="mt10 mr10" preload="metadata" :src="item.url" style="height: 100px;width: 120px" @click="handlePreview(item.url, item.type)" />
            </span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <!--        <el-button type="primary" @click="handleReplySubmit">{{ $t('track.detail.replySubmit') }}</el-button>-->
        <el-button type="primary" @click="handleReplySubmit">submit</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="recordVisible" width="60%" class="p20" @close="handleRecordClose">
      <div class="record-box">
        <el-table
          empty-text="No Data"
          :data="recordForm.seller"
          style="width: 100%"
          highlight-current-row
          fit
          :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
        >
          <!--          <el-table-column :label="$t('track.detail.recordForm.seller')" prop="seller">-->
          <el-table-column label="Seller" prop="seller">
            <template slot-scope="scope">
              <span>{{ scope.row.reply_info }}</span>
              <span v-for="(item, index) in scope.row.reply_img" :key="index">
                <el-image v-if="item.type !== 'video/mp4'" :src="item.url" :preview-src-list="[item.url]" style="height: 23px;width: 28px;vertical-align: middle;" class="mt10 mr10" />
                <video v-if="item.type === 'video/mp4'" class="mt10 mr10" preload="metadata" :src="item.url" style="height: 23px;width: 28px;vertical-align: middle;" @click="handlePreview(item.url, item.type)" />
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          empty-text="No Data"
          :data="recordForm.Oneself"
          style="width: 100%"
          highlight-current-row
          fit
          :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
        >
          <!--          <el-table-column :label="$t('track.detail.recordForm.oneself')" prop="oneself">-->
          <el-table-column label="Oneself" prop="oneself">
            <template slot-scope="scope">
              <span>{{ scope.row.reply_info }}</span>
              <span v-for="(item, index) in scope.row.reply_img" :key="index">
                <el-image v-if="item.type !== 'video/mp4'" :src="item.url" :preview-src-list="[item.url]" style="height: 23px;width: 28px;vertical-align: middle;" class="mt10 mr10" />
                <video v-if="item.type === 'video/mp4'" class="mt10 mr10" preload="metadata" :src="item.url" style="height: 23px;width: 28px;vertical-align: middle;" @click="handlePreview(item.url, item.type)" />
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      title="Authentication"
      :visible.sync="AuThenDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="50%"
      top="30vh"
    >
      <div slot="title">
        Authentication
        <el-tooltip class="item" effect="dark" content="in order to ensure that the information is correct, we need to conduct a brief authentication. please understand the inconvenience caused" placement="right">
          <i class="el-icon-question" />
        </el-tooltip>
      </div>
      <el-form ref="AuthenticationForm" label-position="top" :model="AuthenticationForm" :rules="AuthenticationRules">
        <el-form-item label="Please enter the email information you filled in when you purchased the product" prop="product">
          <el-input v-model="AuthenticationForm.product" size="large" placeholder="Please enter the email information you filled in when you purchased the product" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Video preview"
      :visible.sync="videoVisible"
      width="30%"
    >
      <iframe
        width="100%"
        height="500px"
        :src="previewUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </el-dialog>
  </div>
</template>

<script>
import { realInfo, afterSalesReal, updateAfterInfo, afterSalesType, afterSalesReply } from '@/api/user'
import { getCookies, setCookies } from '@/utils/cookies'
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
      AuthenticationForm: {
        product: ''
      },
      AuthenticationRules: {
        product: [
          { required: true, message: 'Please enter the email information you filled in when you purchased the product', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      labelIsShow: true,
      showDetails: false,
      showAfterSale: false,
      showAfterSaleBtn: false,
      tableData: [],
      dialogForm: {
        product_json: '',
        after_type: '',
        after_model: '',
        reply_info: '',
        reply_img: []
      },
      dialogFormRules: {
        product_json: [{ required: true, message: 'After sale products is required', trigger: 'blur' }],
        after_type: [{ required: true, message: 'After sales type is required', trigger: 'blur' }],
        after_model: [{ required: true, message: 'After sales mode is required', trigger: 'blur' }],
        reply_info: [{ required: true, message: 'reply is required', trigger: 'blur' }]
      },
      productsList: [],
      typeList: [],
      modeList: [
        {
          label: 'Resend',
          value: '1'
        },
        {
          label: 'Refund',
          value: '2'
        },
        {
          label: 'Other',
          value: '4'
        }
      ],
      activeName: 'first',
      afterList: [
        {
          afterSalesActive: 'first',
          afterSalesInformation: {
            product_json: '',
            after_type: '',
            after_model: '',
            innerAfterSalesActive: 'first',
            reply_info: '',
            reply_img: []
          },
          feedBackInformation: {
            innerAfterSalesActive: 'first',
            reply_info: '',
            reply_img: []
          }
        }
      ],
      customerId: '',
      consignee: '',
      replyVisible: false,
      replyForm: {
        reply: '',
        reply_img: []
      },
      replyRules: {},
      selectionList: [],
      fileList: [],
      formData: {
        product_json: [],
        after_type: '',
        after_model: '',
        reply_info: '',
        image: [],
        order_name: '',
        order_no: '',
        payment_time: '',
        state: '',
        total: '',
        third_order_no: '',
        store_url: '',
        vendor: '',
        server_id: []
      },
      recordVisible: false,
      recordForm: {
        seller: [],
        reacl: []
      },
      replyFormData: {
        a_id: '',
        reply_info: '',
        reply_img: [],
        reply_user: '',
        type: 3
      },
      // 视屏弹窗
      videoVisible: false,
      previewUrl: '',
      AuThenDialogVisible: false,
      safe: '',
      url: '',
      icon: '',
      after_id: 0,
      trackUp: true
    }
  },
  computed: {
    language() {
      // return this.$store.getters.language
      return 'en'
    },
    // 列表表头
    labelList() {
      return [
        // { label: this.$t('track.detail.tableData.picture'), value: 'picture', type: 'image', width: '200' },
        // { label: this.$t('track.detail.tableData.product'), value: 'third_sku_name', width: '500' },
        // { label: this.$t('track.detail.tableData.amount'), value: 'sku_num' },
        // { label: this.$t('track.detail.tableData.prices'), value: 'sale_money' }
        { label: 'Picture', value: 'picture', type: 'image', width: '200' },
        { label: 'Product', value: 'third_sku_name', width: '500' },
        { label: 'Amount', value: 'sku_num' },
        { label: 'Price', value: 'sale_money' }
      ]
    }
  },
  created() {
    const search = window.location.href
    this.safe = decodeURI(search.split('=')[1]).split('&')[0]
    this.url = decodeURI(search.split('=')[2]).split('&')[0]
    const icon = decodeURI(search.split('=')[3])
    this.icon = icon.replaceAll('%3A', ':').replaceAll('%2F', '/')
    this.getAfterSalesType()
  },
  methods: {
    // 视频大图查看
    handlePreview(file, type) {
      this.previewUrl = file
      this.videoVisible = true
    },
    // 获取售后类型
    getAfterSalesType() {
      afterSalesType().then(res => {
        if (res.code === 200) {
          this.typeList = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
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
          this.AuThenDialogVisible = true
        }
      })
    },
    initTrack(val) {
      this.AuThenDialogVisible = false
      realInfo(val).then(res => {
        if (res.code === 200) {
          if (res.data.good.length > 0) {
            this.showDetails = true
            this.tableData = res.data.good
            this.customerId = res.data.user_id
            this.consignee = res.data.consignee
          } else {
            this.$message.warning(res.message)
          }
          if (res.data.after.length === 0) {
            this.showAfterSaleBtn = true
          } else {
            this.showAfterSale = true
            this.after_id = res.data.after[0].id
            res.data.after.map((it, inx) => {
              this.afterList[inx].afterSalesInformation = { ...this.afterList[inx].afterSalesInformation, ...res.data.after[inx].reply.Oneself[res.data.after[inx].reply.Oneself.length - 1] }
              this.$set(this.afterList[inx].afterSalesInformation, 'after_type', it.after_type)
              this.$set(this.afterList[inx].afterSalesInformation, 'after_model', it.after_model)
              this.$set(this.afterList[inx].afterSalesInformation, 'product_json', it.product_json)
              this.$set(this.afterList[inx].afterSalesInformation, 'id', it.id)
              this.$set(this.afterList[inx].afterSalesInformation, 'user_id', it.user_id)
              this.afterList[inx].feedBackInformation = { ...this.afterList[inx].feedBackInformation, ...res.data.after[inx].reply.seller[res.data.after[inx].reply.seller.length - 1] }
              this.recordForm = res.data.after[inx].reply
            })
          }
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    // 打开弹窗
    handleClickAfterSales() {
      this.dialogForm = this.$options.data().dialogForm
      if (this.selectionList.length <= 0) {
        this.$message.warning('Please select at least one piece of data!')
      } else {
        this.dialogVisible = true
        let sum = ''
        this.selectionList.map(it => {
          sum += it.third_goods_name + ', '
        })
        this.dialogForm.product_json = sum.slice(0, sum.length - 2)
      }
    },
    // 切换information
    handleAfterSalesClick(tab) {
    },
    // 切换回复方式
    handleClick(tab) {
    },
    // 上传图片
    updateImgList(list) {
      this.dialogForm.reply_img = list
    },
    // 提交
    submit() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.formData.after_type = this.dialogForm.after_type
          this.formData.after_model = this.dialogForm.after_model
          this.formData.content = this.dialogForm.reply_info
          this.formData.user_id = this.customerId
          this.formData.image = this.dialogForm.reply_img
          this.formData.order_name = this.selectionList[0].order.order_name
          this.formData.order_no = this.selectionList[0].order.order_no
          // this.formData.order_no = '123456'
          this.formData.order_create = this.selectionList[0].order.order_create
          this.formData.payment_time = this.selectionList[0].order.payment_time
          this.formData.state = this.selectionList[0].order.state
          this.formData.total = this.selectionList[0].order.total
          this.formData.third_order_no = this.selectionList[0].order.thirdParty_order_on
          this.formData.store_url = this.selectionList[0].goods_cost_vender.store_url
          // this.formData.store_url = 'live-by-test.myshopify.com'
          const arr = []
          let newArr = []
          this.selectionList.map(it => {
            it.goods_cost_vender.product_json = this.dialogForm.product_json
            this.formData.product_json.push(it.goods_cost_vender)
            arr.push(it.goods_cost_vender.service_id)
          })
          newArr = Array.from(new Set(arr))
          if (newArr.length > 1) {
            this.formData.vendor = newArr.toString().replace(/,/g, '/')
            this.formData.server_id = newArr.toString()
          } else {
            this.formData.vendor = newArr.toString()
            this.formData.server_id = newArr.toString()
          }
          afterSalesReal(this.formData).then(res => {
            if (res.code === 200) {
              this.dialogVisible = false
              this.after_id = res.data.id
              this.trackUp = false
              const obj = getCookies('obj')
              this.initTrack(JSON.parse(obj))
              this.trackUp = true
            }
          })
        }
      })
    },
    // feedback 时，回复按钮
    handleClickReply(val) {
      this.replyVisible = true
      this.replyFormData.a_id = val.afterSalesInformation.id
      this.replyFormData.reply_user = val.afterSalesInformation.user_id.toString()
    },
    // feedback 时，历史记录查看按钮
    handleClickRecord() {
      this.recordVisible = true
    },
    // 多选
    shiftMultiple(selection) {
      this.selectionList = selection
    },
    // 全选
    selectAll(selection) {
      this.selectionList = selection
    },
    // 售后文件修改
    handleChange(file, fileList) {
      // console.log('change', file)
    },
    // 售后文件上传前校验
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
          this.$message.error('The uploaded file size exceeds 2M!')
          return Promise.reject(new Error('Error'))
        }
      )
      return isSize
    },
    // 售后文件自定义上传
    upload(fileObj) {
      const file = { showProgress: true, url: '', percent: 0 }
      const formData = new FormData()
      formData.append('file', fileObj.file)
      updateAfterInfo(formData, (progress) => {
        file.percent = Math.round((progress.loaded / progress.total) * 100)
      }).then(res => {
        if (res.code === 200) {
          file.url = res.data['data-service-file']
          file.showProgress = false
          const obj = {
            url: file.url,
            type: fileObj.file.type
          }
          this.dialogForm.reply_img.push(obj)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 回复文件修改
    handleReplyChange(file, fileList) {
      // console.log('change', file)
    },
    // 回复文件上传前校验
    handleReplyBeforeUpload(file) {
      // const is1M = file.size / 1024 / 1024 < 1 // 限制小于1M
      const isSize = new Promise((resolve, reject) => {
        const isLt2M = file.size / 1024 / 1024 < 2
        isLt2M ? resolve() : reject(new Error('Error'))
      }).then(
        () => {
          return file
        },
        () => {
          this.$message.error('The uploaded file size exceeds 2M!')
          return Promise.reject(new Error('Error'))
        }
      )
      return isSize
    },
    // 回复文件自定义上传
    replyUpload(fileObj) {
      const file = { showProgress: true, url: '', percent: 0 }
      const formData = new FormData()
      formData.append('file', fileObj.file)
      updateAfterInfo(formData, (progress) => {
        file.percent = Math.round((progress.loaded / progress.total) * 100)
      }).then(res => {
        if (res.code === 200) {
          file.url = res.data['data-service-file']
          file.showProgress = false
          const obj = {
            url: file.url,
            type: fileObj.file.type
          }
          this.replyForm.reply_img.push(obj)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 回复关闭
    handleClose() {
      this.replyVisible = false
      this.replyForm = this.$options.data().replyForm
    },
    // 回复提交
    handleReplySubmit() {
      const date = new Date()
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const d = date.getDate()
      const H = date.getHours()
      const M = date.getMinutes()
      const S = date.getSeconds()
      const FormatDate = y + '/' + m + '/' + d + ' ' + H + ':' + M + ':' + S
      const obj = {
        type: 3,
        a_id: this.after_id,
        reply_user: 0,
        reply_user_image: 'https://dx-tech-bucket.s3.amazonaws.com/20210713181701248c21f969b5f03d33d43e04f8f136e7682',
        reply_user_name: this.consignee,
        reply_time: FormatDate,
        reply_info: this.replyForm.reply,
        reply_img: this.replyForm.reply_img
      }
      afterSalesReply(obj).then(res => {
        this.$message.success(res.message)
        this.handleClose()
        this.trackUp = false
        const arr = getCookies('obj')
        this.initTrack(JSON.parse(arr))
        this.trackUp = true
      })
    },
    // 历史记录查询关闭
    handleRecordClose() {
      this.recordVisible = false
      // this.recordForm = this.$options.data().recordForm
    },
    handleSubmit() {
      this.$refs['AuthenticationForm'].validate((valid) => {
        if (valid) {
          const obj = {
            params: this.trackNumberForm.number,
            safe: this.safe,
            store_url: this.url,
            email: this.AuthenticationForm.product
          }
          setCookies('obj', JSON.stringify(obj))
          this.initTrack(obj)
        }
      })
    },
    getValueOfLabel(num, sum) {
      const obj = sum.find(it => Number(it.value) === num)
      if (obj) {
        return obj.label
      } else {
        return num
      }
    }
  }
}
</script>

<style scoped lang="scss">
.track-number-box {
  background-color: #f1f1f1;
  min-height: 100vh;
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
    padding-top: 40px;
  }
  .order-detail {
    height: 40vh;
    overflow-y: auto;
    width: 60%;
    margin: 40px auto;
    padding: 20px;
    border: 1px solid #999;
    background-color: #fff;
  }
  .dialog-box {
    ::v-deep.el-upload-dragger {
      border: 0 none;
      width: 100px;
      height: 30px;
    }
    .reply-box {
      position: relative;
      .img-reply {
        position: absolute;
        top: 140px;
        right: 20px;
      }
    }
  }
  .information-box {
    width: 60%;
    margin: 40px auto;
    position: relative;
    height: 32vh;
    overflow-y: auto;
    .tabs-box {
      width: 80%;
      position: relative;
      margin-bottom: 20px;
      .tabs {
        background-color: #fff;
        padding: 20px;
        border: 1px solid #999;
        .in_txt {
          color: #777;
        }
      }
      .after-btn-box {
        position: absolute;
        top: 13px;
        right: 25px;
      }
    }
    .btn-box {
      width: 10%;
      position: fixed;
      top: 64vh;
      right: 22%;
      overflow: hidden;
      .btn {
        float: right;
      }
    }
  }
  .feed-reply-box {
    position: relative;
    .img-reply {
      position: absolute;
      top: 175px;
      right: 20px;
    }
    ::v-deep.el-upload-dragger {
      border: 0 none;
      width: 100px;
      height: 30px;
    }
  }
  .record-box {
    display: flex;
    justify-content: center;
  }
}
</style>
