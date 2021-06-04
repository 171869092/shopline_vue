<template>
  <div class="track-number-box">
    <div class="language-change-box">
      <el-row>
        <el-col :offset="11" :span="5">
          <img src="" style="width: 150px; height: 80px; background-color:#ccc;">
        </el-col>
        <el-col :offset="4" :span="4">
          <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
            <div>
              <img src="@/assets/home/lang.png" height="20px" class="mr5">
              {{ getLanguageLabel(language,languageList) }}
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
              <el-dropdown-item command="zh" :disabled="language==='zh'">简体中文</el-dropdown-item>
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
            <el-form-item :label="$t('track.trackNumberForm.label')" prop="number" class="mt5">
              <el-input v-model="trackNumberForm.number" size="large" :placeholder="$t('track.trackNumberForm.placeholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" class="ml20 mt50">
              <el-button type="primary" size="large" @click="submitTrack">{{ $t('track.trackNumberForm.track')}}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="showDetails" class="order-detail">
      <el-table
        v-if="labelIsShow"
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        fit
        :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
      >
        <el-table-column v-for="(item,idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width">
          <template slot-scope="scope">
            <span v-if="item.type === undefined" @click="handleClickAfter(scope.row)">{{ scope.row[item.value] }}</span>
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
      <el-dialog :visible.sync="dialogVisible" width="60%" class="p20">
        <el-form ref="dialogForm" :rules="dialogFormRules" :model="dialogForm" label-width="160px" label-position="left">
          <el-form-item :label="$t('track.detail.informationActive.products') + ':'" prop="products">
            <el-select v-model="dialogForm.products" :placeholder="$t('track.detail.informationActive.selectProducts')" multiple style="width:100%">
              <el-option
                v-for="(item, key) in productsList"
                :key="key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-row :gutter="77">
            <el-col :span="10">
              <el-form-item :label="$t('track.detail.informationActive.type') + ':'" prop="type">
                <el-select v-model="dialogForm.type" :placeholder="$t('track.detail.informationActive.selectType')" style="width:100%">
                  <el-option
                    v-for="(item, key) in typeList"
                    :key="key"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="4">
              <el-form-item :label="$t('track.detail.informationActive.mode') + ':'" prop="mode">
                <el-select v-model="dialogForm.mode" :placeholder="$t('track.detail.informationActive.selectMode')" style="width:100%">
                  <el-option
                    v-for="(item, key) in modeList"
                    :key="key"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="$t('track.detail.informationActive.description')" prop="description">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane :label="$t('track.detail.informationActive.textReply')" name="first">
                <el-input v-model="dialogForm.description" type="textarea" :rows="8" :placeholder="$t('track.detail.informationActive.selectTextReply')" />
              </el-tab-pane>
              <el-tab-pane :label="$t('track.detail.informationActive.pictureReply')" name="second">
                <shop-window ref="shopWindow" :img-list="dialogForm.reply_img" @update="updateImgList" />
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit">{{ $t('track.detail.informationActive.sub') }}</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-if="showAfterSale" class="information-box">
      <el-tabs v-show="submitStatus === '2'" v-model="afterSalesActive" type="card" class="tabs-box" @tab-click="handleAfterSalesClick">
        <el-tab-pane :label="$t('track.detail.informationActive.firstLabel')" name="first">
          <el-form ref="information" :model="afterSalesInformation" label-width="160px" label-position="left">
            <el-form-item :label="$t('track.detail.informationActive.products') + ':'">
              <span class="in_txt">{{ afterSalesInformation.products }}</span>
            </el-form-item>
            <el-row :gutter="77" >
              <el-col :span="10">
                <el-form-item :label="$t('track.detail.informationActive.type') + ':'">
                  <span class="in_txt">{{ afterSalesInformation.type }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="4">
                <el-form-item :label="$t('track.detail.informationActive.mode') + ':'">
                  <span class="in_txt">{{ afterSalesInformation.mode }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-tabs v-model="afterSalesInformation.innerAfterSalesActive" type="card">
              <el-tab-pane :label="$t('track.detail.informationActive.textReply')" name="first">
                <el-input v-model="afterSalesInformation.description" type="textarea" :rows="4" placeholder="Seriously damaged products need to be returned and replaced" />
              </el-tab-pane>
              <el-tab-pane :label="$t('track.detail.informationActive.pictureReply')" name="second">
                <el-image class="sku_image" style="width: 50px; height: 50px" :src="afterSalesInformation.img_url" fit="cover">
                  <div slot="error" class="image-slot">
                    <i
                      class="el-icon-picture-outline"
                      style="font-size: 30px;"
                    />
                  </div>
                </el-image>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('track.detail.informationActive.secondLabel')" name="second">
          <el-form ref="information" :model="feedBackInformation" label-width="160px" label-position="left">
            <el-tabs v-model="feedBackInformation.innerAfterSalesActive" type="card">
              <el-tab-pane :label="$t('track.detail.informationActive.textReply')" name="first">
                <el-input v-model="feedBackInformation.description" type="textarea" :rows="4" placeholder="Seriously damaged products need to be returned and replaced" />
              </el-tab-pane>
              <el-tab-pane :label="$t('track.detail.informationActive.pictureReply')" name="second">
                <el-image class="sku_image" style="width: 50px; height: 50px" :src="feedBackInformation.img_url" fit="cover">
                  <div slot="error" class="image-slot">
                    <i
                      class="el-icon-picture-outline"
                      style="font-size: 30px;"
                    />
                  </div>
                </el-image>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div class="btn-box">
        <el-button type="primary" class="btn" @click="handleClickAfterSales">{{ $t('track.detail.afterSales') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { realInfo } from '@/api/user'
import { getCookies } from '@/utils/cookies'
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
      submitStatus: '2',
      dialogVisible: false,
      labelIsShow: true,
      showDetails: false,
      showAfterSale: false,
      tableData: [],
      dialogForm: {
        products: '',
        type: '',
        mode: '',
        description: '',
        reply_img: []
      },
      dialogFormRules: {
        products: [{ required: true, message: 'After sale products is required', trigger: 'blur' }],
        type: [{ required: true, message: 'After sales type is required', trigger: 'blur' }],
        mode: [{ required: true, message: 'After sales mode is required', trigger: 'blur' }],
        description: [{ required: true, validator: this.checkDescription, trigger: 'blur' }]
      },
      productsList: [
        {
          value: '1',
          label: '选项一'
        },
        {
          value: '2',
          label: '选项二'
        },
        {
          value: '3',
          label: '选项三'
        }
      ],
      typeList: [
        {
          value: '1',
          label: 'Product damage'
        },
        {
          value: '2',
          label: 'Goods not received'
        }
      ],
      modeList: [
        {
          value: '1',
          label: 'Return/ exchange'
        },
        {
          value: '2',
          label: 'Return and refund'
        },
        {
          value: '3',
          label: 'Refund only'
        }
      ],
      activeName: 'first',
      afterSalesActive: 'first',
      afterSalesInformation: {
        products: 'cat',
        type: 'Product damage',
        mode: 'Return / exchange',
        innerAfterSalesActive: 'first',
        description: 'Seriously damaged products need to be returned and replaced',
        img_url: ''
      },
      feedBackInformation: {
        innerAfterSalesActive: 'first',
        description: 'Seriously damaged products need to be returned and replaced',
        img_url: ''
      },
      customerId: ''
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    },
    // 列表表头
    labelList() {
      return [
        { label: this.$t('track.detail.tableData.picture'), value: 'picture', type: 'image', width: '200' },
        { label: this.$t('track.detail.tableData.product'), value: 'third_sku_name', width: '500' },
        { label: this.$t('track.detail.tableData.amount'), value: 'sku_num' },
        { label: this.$t('track.detail.tableData.prices'), value: 'sale_money' }
      ]
    }
  },
  created() {
    this.customerId = getCookies('uid')
  },
  methods: {
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
          // 测试数据： 3794727502003
          const obj = {
            params: this.trackNumberForm.number,
            customer_id: this.customerId
          }
          this.showDetails = true
          this.initTrack(obj)
        }
      })
    },
    handleClickAfter(val) {
      this.showAfterSale = true
      console.log('val--', val)
    },
    initTrack(val) {
      realInfo(val).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
        }
      })
    },
    // 打开弹窗
    handleClickAfterSales() {
      this.dialogForm = {}
      this.dialogVisible = true
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
          console.log('dialogForm', this.dialogForm)
          this.dialogVisible = false
        }
      })
    },
    checkDescription(rule, value, callback) {
      if (this.activeName === 'first') {
        if (!value) {
          return callback(new Error('Text reply is required！'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          return callback(new Error('Picture reply is required！'))
        } else {
          callback()
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.track-number-box {
  background-color: #f1f1f1;
  height: 100vh;
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
  .information-box {
    width: 60%;
    margin: 40px auto;
    display: flex;
    .tabs-box {
      height: 30vh;
      overflow-y: auto;
      background-color: #fff;
      padding: 20px;
      border: 1px solid #999;
      flex: 3;
      .in_txt {
        color: #777;
      }
    }
    .btn-box {
      flex: 1;
      overflow: hidden;
      .btn {
        float: right;
      }
    }
  }
}
</style>
