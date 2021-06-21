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
        <el-button size="small" type="primary" @click="isForward = true">Forward</el-button>
        <el-button v-if="type === '2' && is_push !== '3'" size="small" type="primary" @click="confirmAfterSales">confirm after sales</el-button>
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
      <div class="mt20">
        <el-button size="small" :type="isCustomer ? 'primary' : ''" class="w-300" @click="isCustomer = true">Customer</el-button>
        <el-button v-if="isForward" size="small" :type="isCustomer ? '' : 'primary'" class="w-300" style="margin-left: 0" @click="isCustomer = false">Vendor</el-button>
      </div>
      <div v-show="isCustomer" class="mt20 HMain">
        <div class="after-main">
          <h5>Customer</h5>
          <el-button size="small" type="primary" @click="handleReply">Reply</el-button>
        </div>
        <el-divider/>
        <div class="after-contain-box">
          <div v-for="(item, index) in tableData.customer" :key="index" class="after-contain">
            <div class="contain-customer">
              <div class="title">
                <div>
                  <span>{{ item.Customer.title }}</span>
                  <img v-if="item.Customer.status === '1'" :src="NewIcon" class="imgIcon">
                </div>
                <span>{{ item.Customer.time }}</span>
              </div>
              <el-divider/>
              <div class="contain">
                <span>Seriously damaged products need to be returned and replaced</span>
                <div class="image-box">
                  <el-image
                    v-for="(fit, inx) in item.Customer.img"
                    :key="inx"
                    style="width: 100px; height: 100px; float: left; margin-right: 10px"
                    :src="fit"
                    :fit="fit"
                    :preview-src-list="[fit]"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" style="font-size: 30px;" />
                    </div>
                  </el-image>
                </div>
              </div>
            </div>
            <div class="contain-customer">
              <div class="title">
                <div>
                  <span>{{ item.reply.title }}</span>
                  <img v-if="item.reply.status === '1'" :src="NewIcon" class="imgIcon">
                </div>
                <span>{{ item.reply.time }}</span>
              </div>
              <el-divider/>
              <div class="contain">
                <span>{{ item.reply.text }}</span>
                <div class="image-box">
                  <el-image
                    v-for="(fit, inx) in item.Customer.img"
                    :key="inx"
                    style="width: 100px; height: 100px; float: left; margin-right: 10px"
                    :src="fit"
                    :fit="fit"
                    :preview-src-list="[fit]"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" style="font-size: 30px;" />
                    </div>
                  </el-image>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="isForward && !isCustomer" class="mt20 HMain">
        <div class="after-main">
          <h5>Vendor</h5>
          <el-button size="small" type="primary" @click="handleReply">Reply</el-button>
        </div>
        <el-divider/>
        <div class="after-contain-box">
          <div v-for="(item, index) in tableData.vendors" :key="index" class="after-contain">
            <div class="contain-customer">
              <div class="title">
                <div>
                  <span>{{ item.Customer.title }}</span>
                  <img v-if="item.Customer.status === '1'" :src="NewIcon" class="imgIcon">
                </div>
                <span>{{ item.Customer.time }}</span>
              </div>
              <el-divider/>
              <div class="contain">
                <span>Seriously damaged products need to be returned and replaced</span>
                <div class="image-box">
                  <el-image
                    v-for="(fit, inx) in item.Customer.img"
                    :key="inx"
                    style="width: 100px; height: 100px; float: left; margin-right: 10px"
                    :src="fit"
                    :fit="fit"
                    :preview-src-list="[fit]"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" style="font-size: 30px;" />
                    </div>
                  </el-image>
                </div>
              </div>
            </div>
            <div class="contain-customer">
              <div class="title">
                <div>
                  <span>{{ item.reply.title }}</span>
                  <img v-if="item.reply.status === '1'" :src="NewIcon" class="imgIcon">
                </div>
                <span>{{ item.reply.time }}</span>
              </div>
              <el-divider/>
              <div class="contain">
                <span>{{ item.reply.text }}</span>
                <div class="image-box">
                  <el-image
                    v-for="(fit, inx) in item.Customer.img"
                    :key="inx"
                    style="width: 100px; height: 100px; float: left; margin-right: 10px"
                    :src="fit"
                    :fit="fit"
                    :preview-src-list="[fit]"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" style="font-size: 30px;" />
                    </div>
                  </el-image>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
<!--      <el-card class="box-card mt20">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="Text Content" name="first">
            &lt;!&ndash; Text Content &ndash;&gt;
            <div slot="header">
              <div class="detail-block-title">
                <div><h2>Text Content</h2></div>
              </div>
            </div>
            <textarea v-model="tableData.content" class="el-textarea__inner" :disabled="true" autosize placeholder="请输入内容" />
          </el-tab-pane>

          <el-tab-pane label="Picture Content" name="second">
            <div v-for="fit in showImg" :key="fit" class="block">
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
            </div>

          </el-tab-pane>
        </el-tabs>
      </el-card>
      <div v-for="(item, k) in tableData.reply" :key="k">
        <el-card class="box-card mt20">
          <el-tabs v-model="item.activeReplyName" type="card" @tab-click="handleClick">
            <el-tab-pane label="Reply Message" name="first">
              <div slot="header">
                <div class="detail-block-title">
                  <div><h2>Reply Message</h2></div>
                </div>
              </div>
              <textarea v-model="item.reply_info" class="el-textarea__inner" :disabled="true" autosize placeholder="请输入内容" />
            </el-tab-pane>
            <el-tab-pane label="Reply Message" name="second">
              <div slot="header">
                <div class="detail-block-title">
                  <div><h2>Reply to Picture</h2></div>
                </div>
              </div>
              <div v-for="fit in item.reply_img" :key="fit" class="block">
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
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>-->
    </div>
    <el-dialog
      title="After sales reply"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="Text Content" name="first">
          <el-input v-model="dialogForm.content" type="textarea" :rows="5" placeholder="请输入内容" />
        </el-tab-pane>
        <el-tab-pane label="Picture Content" name="second">
          <shop-window ref="shopWindow" :img-list="dialogForm.img" @update="updateImgList" @delete="deleteImg" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleDialogSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { afterSalesChanngedStatus, afterSalesDetail, afterSalesConfirmSend } from '@/api/after'
export default {
  name: 'after-detail',
  components: {
    shopWindow: () => import('./shop-window')
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
        reply: [],
        customer: [],
        vendors: []
      },
      showImg: [],
      replyImg: [],
      thisImgs: '',
      type: '1',
      is_push: '1',
      confirmSend: '',
      isCustomer: true,
      isForward: false,
      dialogVisible: false,
      dialogForm: {
        content: '',
        img: []
      },
      NewIcon: require('@/assets/home/new.png') // 我的消息new图标
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
    getAfterSalesDetail() {
      this.loading = true
      afterSalesDetail({ id: this.$route.query.id }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.showImg = res.data.image
          this.tableData.reply.map(it => {
            if (it.reply_info === '') {
              this.$set(it, 'activeReplyName', 'second')
            } else {
              this.$set(it, 'activeReplyName', 'first')
            }
          })
          this.type = res.data.type
          this.is_push = res.data.is_push
          this.confirmSend = res.data.id
          this.tableData.customer = [
            {
              Customer: {
                status: '1',
                title: 'Customer',
                time: '2020/11/17 21:28:57',
                text: 'Seriously damaged products need to be returned and replaced',
                img: ['https://ae01.alicdn.com/kf/H5e8ec3f62cd748ef998cbbcd91c3463bZ/Laptop-CHUWI-HeroBook-Pro-14-1-FHD-Intel-Celeron-N4020-8GB-RAM-256GB-SSD-UHD-Graphics.jpg', 'https://ae01.alicdn.com/kf/H5e8ec3f62cd748ef998cbbcd91c3463bZ/Laptop-CHUWI-HeroBook-Pro-14-1-FHD-Intel-Celeron-N4020-8GB-RAM-256GB-SSD-UHD-Graphics.jpg']
              },
              reply: {
                status: '2',
                title: 'My reply',
                time: '2020/11/17 21:28:57',
                text: 'Don\'t worry, i\'ll find you a way out',
                img: ['https://ae01.alicdn.com/kf/H5e8ec3f62cd748ef998cbbcd91c3463bZ/Laptop-CHUWI-HeroBook-Pro-14-1-FHD-Intel-Celeron-N4020-8GB-RAM-256GB-SSD-UHD-Graphics.jpg', 'https://ae01.alicdn.com/kf/H5e8ec3f62cd748ef998cbbcd91c3463bZ/Laptop-CHUWI-HeroBook-Pro-14-1-FHD-Intel-Celeron-N4020-8GB-RAM-256GB-SSD-UHD-Graphics.jpg']
              }
            },
            {
              Customer: {
                status: '2',
                title: 'Customer',
                time: '2020/11/17 21:28:57',
                text: 'Seriously damaged products need to be returned and replaced',
                img: ['https://ae01.alicdn.com/kf/H5e8ec3f62cd748ef998cbbcd91c3463bZ/Laptop-CHUWI-HeroBook-Pro-14-1-FHD-Intel-Celeron-N4020-8GB-RAM-256GB-SSD-UHD-Graphics.jpg', 'https://ae01.alicdn.com/kf/H5e8ec3f62cd748ef998cbbcd91c3463bZ/Laptop-CHUWI-HeroBook-Pro-14-1-FHD-Intel-Celeron-N4020-8GB-RAM-256GB-SSD-UHD-Graphics.jpg']
              },
              reply: {
                status: '2',
                title: 'My reply',
                time: '2020/11/17 21:28:57',
                text: 'Don\'t worry, i\'ll find you a way out',
                img: ['https://ae01.alicdn.com/kf/H5e8ec3f62cd748ef998cbbcd91c3463bZ/Laptop-CHUWI-HeroBook-Pro-14-1-FHD-Intel-Celeron-N4020-8GB-RAM-256GB-SSD-UHD-Graphics.jpg', 'https://ae01.alicdn.com/kf/H5e8ec3f62cd748ef998cbbcd91c3463bZ/Laptop-CHUWI-HeroBook-Pro-14-1-FHD-Intel-Celeron-N4020-8GB-RAM-256GB-SSD-UHD-Graphics.jpg']
              }
            }
          ]
          this.tableData.vendors = [
            {
              Customer: {
                status: '1',
                title: 'Vendor',
                time: '2020/11/17 21:28:57',
                text: 'Seriously damaged products need to be returned and replaced',
                img: ['https://ae01.alicdn.com/kf/H5e8ec3f62cd748ef998cbbcd91c3463bZ/Laptop-CHUWI-HeroBook-Pro-14-1-FHD-Intel-Celeron-N4020-8GB-RAM-256GB-SSD-UHD-Graphics.jpg', 'https://ae01.alicdn.com/kf/H5e8ec3f62cd748ef998cbbcd91c3463bZ/Laptop-CHUWI-HeroBook-Pro-14-1-FHD-Intel-Celeron-N4020-8GB-RAM-256GB-SSD-UHD-Graphics.jpg']
              },
              reply: {
                status: '2',
                title: 'My reply',
                time: '2020/11/17 21:28:57',
                text: 'Don\'t worry, i\'ll find you a way out',
                img: ['https://ae01.alicdn.com/kf/H5e8ec3f62cd748ef998cbbcd91c3463bZ/Laptop-CHUWI-HeroBook-Pro-14-1-FHD-Intel-Celeron-N4020-8GB-RAM-256GB-SSD-UHD-Graphics.jpg', 'https://ae01.alicdn.com/kf/H5e8ec3f62cd748ef998cbbcd91c3463bZ/Laptop-CHUWI-HeroBook-Pro-14-1-FHD-Intel-Celeron-N4020-8GB-RAM-256GB-SSD-UHD-Graphics.jpg']
              }
            }
          ]
        }
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
        id: Number(this.confirmSend)
      }
      afterSalesConfirmSend(formData).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.getAfterSalesDetail()
        }
      })
    },
    handleReply() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
      this.dialogForm = this.$options.data().dialogForm
    },
    updateImgList(list) {
      this.imgList = list
      this.dialogForm.img = this.imgList
    },
    deleteImg(val) {
      this.dialogForm.forEach(it => {
        if (it.img === val) {
          it.img = ''
        }
      })
    },
    handleDialogSubmit() {
      console.log('dialogForm', this.dialogForm)
      this.handleClose()
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

.HMain {
  background-color: #fff;
  .after-main {
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
  .el-divider--horizontal {
    margin: 0;
  }
  .after-contain-box {
    height: 590px;
    overflow-y: auto;
    .after-contain {
      padding: 20px;
      .contain-customer {
        border: 1px solid #ccc;
        border-radius: 10px;
        margin-bottom: 20px;
        .title {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          .imgIcon {
            width: 30px;
            height: 28px;
            margin-left: 10px;
            margin-top: -15px;
          }
        }
        .el-divider--horizontal {
          margin: 0;
        }
        .contain {
          padding: 20px;
          .image-box {
            overflow: hidden;
            margin-top: 20px;
          }
        }
      }
    }
  }
}
</style>
