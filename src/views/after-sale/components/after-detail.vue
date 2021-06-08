<template>
  <div v-loading="loading" class="order-detail p30">
    <div class="top-box">
      <div class="order-header flexbox">
        <el-button
          size="small"
          class="button-border"
          icon="el-icon-back"
          @click="$router.back()"
        />
        <div class="order-id ml20">
          Order No：<span class="primary">{{ order_no }}</span>
        </div>
      </div>
      <div>
        <el-button v-if="type === '2'" size="small" type="primary" @click="confirmAfterSales">confirm after sales</el-button>
        <el-button size="small" type="primary" @click="complete">Completed</el-button>
      </div>
    </div>
    <div class="order-cell">
      <!-- After Sales Information -->
      <el-card class="box-card mt20">
        <div slot="header">
          <div class="detail-block-title">
            <div><h2>After Sales Information</h2></div>
          </div>
        </div>
        <div class="detail-block-title custul">
          <el-form>
            <el-col :span="8">
              <el-form-item label="After Sales Type:">
                <span class="inx_text">{{ tableData.after_type }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="After Sales Mode:">
                <span class="inx_text">{{ tableData.after_model }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="After Sales Products:">
                <span v-for="(item,ids) in tableData.product_json" :key="ids" class="inx_text">{{ item.sku_name }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </el-card>

      <el-card class="box-card mt20">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="Text Content" name="first">
            <!-- Text Content -->
            <div slot="header">
              <div class="detail-block-title">
                <div><h2>Text Content</h2></div>
              </div>
            </div>
            <textarea v-model="tableData.content" class="el-textarea__inner" :disabled="true" autosize placeholder="请输入内容" />
          </el-tab-pane>

          <el-tab-pane label="Picture Content" name="second">
            <div v-for="fit in showImg" :key="fit" class="block">
              <!-- <span class="demonstration">{{ fit }}</span> -->

              <el-image
                ref="thisImg"
                accept="image/png, image/jpeg"
                class="sku_image"
                style="width: 100px; height: 100px; float:left;"
                :src="fit"
                :fit="fit"
                :preview-src-list="[fit]"
              >

                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" style="font-size: 30px;" />
                </div>
              </el-image>
              <!-- </el-dialog> -->

              <!-- <el-image
                accept="image/png, image/jpeg"
                class="sku_image"
                style="width: 100px; height: 100px; float:left;"
                :src="fit"
                :fit="fit"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" style="font-size: 30px;" />
                </div>
              </el-image> -->
            </div>

          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- Text Content -->
      <!-- <el-card class="box-card mt20">
                    <div slot="header">
                        <div class="detail-block-title">
                            <div><h2>Text Content</h2></div>
                        </div>
                    </div>
                    <textarea class="el-textarea__inner" :disabled="true" v-model="tableData.content" autosize placeholder="请输入内容" />
                </el-card> -->

      <!-- Picture Content -->
      <!-- <el-card class="box-card mt20">
                    <div slot="header">
                        <div class="detail-block-title">
                            <div><h2>Picture Content</h2></div>
                        </div>
                    </div>
                        <div slot="header" class="flexbox justidfy-space-between align-center">
                        </div>
                </el-card> -->

      <div v-for="(item,k) in tableData.reply" :key="k">
        <!-- Reply Message -->
        <el-card class="box-card mt20">
          <div slot="header">
            <div class="detail-block-title">
              <div><h2>Reply Message</h2></div>
            </div>
          </div>
          <textarea v-model="item.reply_info" class="el-textarea__inner" :disabled="true" autosize placeholder="请输入内容" />
        </el-card>

        <!-- Reply to Picture -->
        <el-card class="box-card mt20">
          <div slot="header">
            <div class="detail-block-title">
              <div><h2>Reply to Picture</h2></div>
            </div>
          </div>
          <div v-for="fit in item.reply_img" :key="fit" class="block">
            <!-- <span class="demonstration">{{ fit }}</span> -->
            <el-image
              class="sku_image"
              style="width: 100px; height: 100px; float:left;margin-bottom: 20px"
              :src="fit"
              :fit="fit"
              :preview-src-list="[fit]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="font-size: 30px;" />
              </div>
            </el-image>
          </div>
        </el-card>
      </div>

    </div>
  </div>
</template>
<script>
import { afterSalesChanngedStatus, afterSalesDetail, afterSalesConfirmSend } from '@/api/after'
export default {
  name: 'after-detail',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ShopWindow: () => import('./shop-window')
  },
  data() {
    return {
      activeName: 'first',
      detailInfo: {},
      loading: false,
      formData: {
        images: []
      },
      imgList: [],
      tableData: {
        after_model: '',
        after_type: '',
        content: '',
        cost: '',
        image: [],
        order_name: '',
        product_json: [],
        shipping_json: [],
        status: '',
        store_url: '',
        third_order_no: '',
        total: '',
        vendor: '',
        reply: {
          reply_info: '',
          reply_img: []
        }
      },
      showImg: [],
      replyImg: [],
      dialogVisible: false,
      thisImgs: '',
      type: '1',
      confirmSend: ''
    }
  },
  computed: {
    order_no() {
      return this.$route.query.order_no
    },
    order_id() {
      return this.$route.query.order_id
    },
    isShowProductIndex() {
      return this.detailInfo.length > 1
    }
  },
  created() {
    if (this.$route.query.type === 'edit') {
      this.getAfterSalesDetail()
    }
  },
  methods: {
    updateImgList(list) {
      this.imgList = list
      this.formData.images = this.imgList
    },
    deleteImg() {

    },
    openUploadPrint() {

    },
    delImg() {

    },
    updateimg() {

    },
    getAfterSalesDetail() {
      this.loading = true
      afterSalesDetail({ id: this.$route.query.id }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.showImg = res.data.image
          // if (res.data.reply){
          //   this.replyImg = res.data.reply
          // }
          this.type = res.data.type
          this.confirmSend = res.data.id
        }
        console.log(this.tableData)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },

    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // complete
    complete() {
      const ids = []
      ids.push(this.tableData.id)
      afterSalesChanngedStatus({ id: ids }).then(res => {
        let type = ''
        if (res.code === 200) {
          type = 'success'
        } else {
          type = 'error'
        }
        this.$message({ message: res.message, type: type })
      }).catch(err => {
        console.log(err)
      }).finally(() => {

      })
    },
    // 确认售后
    confirmAfterSales() {
      const formData = {
        id: this.confirmSend
      }
      afterSalesConfirmSend(formData).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.top-box {
  display: flex;
  justify-content: space-between;
}
.order-id {
  line-height: 36px;
  margin-right: 20px;
}
.order-detail {
  overflow: auto;
  .order-header {
    line-height: 30px;
  }
  .order-cell {
    overflow: auto;
  }
  .button-border {
    border: 1px solid #ef6f38;
    color: #ef6f38;
  }
}

.detail-block-title {
  // color: #9299B0FF;
  // padding: 5px 5px;
  // border-bottom: 0.1rem solid var(--p-border-subdued,#dfe3e8);
  h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }
  .inx_text {
    color: #777;
  }
}
.block {
  background: #f7f9fcff;
}
.log-title {
  border-bottom: 1px solid #ddd;
  .text-subdued {
    color: #637381;
  }
  div {
    &:first-child {
      margin-left: 0;
    }
    margin-left: 20px;
  }
}
.empty-text {
  width: 150px;
  text-align: center;
  .empty-icon {
    svg {
      font-size: 55px;
    }
  }
  .empty-normal {
    color: rgba(0, 0, 0, 0.25);
  }
}
.vendor-info {
  padding-left: 25px;
  line-height: 35px;
}
.customer-info {
  @extend .vendor-info;
  // padding-left: 22px;
  // line-height: 30px;
}
.vendor-sub-title {
  line-height: 25px;
  font-weight: 700;
}
.border-top {
  border-top: 1px solid #ddd;
  padding-top: 20px;
  &:first-child {
    padding-top: 0 !important;
    border-top: none !important;
  }
}
.custul li{
  float: left;
//   display:block;
  padding-right: 340px;
  list-style:none;
}
// .inputDeep>>>.el-input__inner {
//     border: 0;
//   }
</style>
