<template>
  <div class="details-box">
    <div class="language-change-box">
      <el-row>
        <el-col :offset="11" :span="5">
          <img src="" style="width: 150px; height: 80px; background-color:#ccc;">
        </el-col>
        <el-col :offset="4" :span="4">
          <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
            <div>
              {{ getLanguageLabel(language, languageList) }}
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
    <div class="order-detail">
      <div class="top-box">
        <el-button
          size="small"
          class="button-border"
          icon="el-icon-back"
          @click="$router.back()"
        />
        <div class="order-id ml20">
          <span class="primary">{{ orderDetailForm.order_no }}</span>
        </div>
        <el-button size="small" type="primary" @click="$router.back()">{{ $t('track.detail.searchAgain') }}</el-button>
      </div>
      <el-divider />
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
      <div class="information-box">
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
                  <el-input v-model="afterSalesInformation.description" type="textarea" :rows="8" placeholder="请输入内容" />
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
                <el-tab-pane label="Text reply" name="first">
                  <el-input v-model="feedBackInformation.description" type="textarea" :rows="8" placeholder="请输入内容" />
                </el-tab-pane>
                <el-tab-pane label="Picture reply" name="second">
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
  </div>
</template>

<script>
export default {
  name: 'track-details',
  components: {
    ShopWindow: () => import('@/views/after-sale/components/shop-window')
  },
  data() {
    return {
      submitStatus: '',
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
      orderDetailForm: {
        order_no: '#1234'
      },
      tableData: [
        {
          picture: '',
          Product: '1Global Xiaomi Mi TV Stick Android TV 9.0 Quad Core Chromecast Netflix Smart TV Stick 1GB 8GB 1080P HD Audio Decoding - M / redc',
          amount: '1',
          prices: '5'
        },
        {
          picture: '',
          Product: '1Global Xiaomi Mi TV Stick Android TV 9.0 Quad Core Chromecast Netflix Smart TV Stick 1GB 8GB 1080P HD Audio Decoding - M / redc',
          amount: '1',
          prices: '5'
        }
      ],
      dialogVisible: false,
      labelIsShow: true,
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
      }
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
        { label: this.$t('track.detail.tableData.product'), value: 'Product', width: '500' },
        { label: this.$t('track.detail.tableData.amount'), value: 'amount' },
        { label: this.$t('track.detail.tableData.prices'), value: 'prices' }
      ]
    }
  },
  created() {
    this.submitStatus = this.$route.query.submitStatus
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
      this.labelIsShow = false
      this.$nextTick(() => {
        this.labelIsShow = true
      })
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
    // 切换回复方式
    handleClick(tab) {
    },
    // 上传图片
    updateImgList(list) {
      this.dialogForm.reply_img = list
    },
    // 打开弹窗
    handleClickAfterSales() {
      this.dialogForm = {}
      this.dialogVisible = true
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
    // 切换information
    handleAfterSalesClick(tab) {
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
.details-box {
  background-color: #f1f1f1;
  height: 100%;
  padding:0 20px 20px;
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
  .order-detail {
    min-height: 600px;
    width: 60%;
    margin: 40px auto;
    padding: 20px;
    border: 1px solid #999;
    background-color: #fff;
    .top-box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .information-box {
      margin-top: 40px;
      display: flex;
      .tabs-box {
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
}
</style>
