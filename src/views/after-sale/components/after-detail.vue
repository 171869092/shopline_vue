<template>
    <div v-loading="loading" class="order-detail p30">
        <el-row :gutter="20">
            <el-col :span="20" :offset="2">
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
                    <el-select v-model="selectedProduct" v-if="isShowProductIndex" @change="handleChange(selectedProduct)" placeholder="Select Product">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
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
                            <el-col :offset="1" :span="50">
                                <ul class="customer-info mt10">
                                    <li><span>After Sales Type: </span><span>55555555</span></li>
                                    <li><span>After Sales Mode: </span><span>66666666</span></li>
                                    <li><span>After Sales Products: </span><span>77777777</span></li>
                                </ul>
                            </el-col>
                        </div>
                    </el-card>

                    <!-- Text Content -->
                    <el-card class="box-card mt20">
                        <div slot="header">
                            <div class="detail-block-title">
                                <div><h2>Text Content</h2></div>
                            </div>
                        </div>
                    </el-card>

                    <!-- Picture Content -->
                    <el-card class="box-card mt20">
                        <div slot="header">
                            <div class="detail-block-title">
                                <div><h2>Picture Content</h2></div>
                            </div>
                        </div>
                    </el-card>

                    <!-- Reply Message -->
                    <el-card class="box-card mt20">
                        <div slot="header">
                            <div class="detail-block-title">
                                <div><h2>Reply Message</h2></div>
                            </div>
                        </div>
                    </el-card>

                    <!-- Reply to Picture -->
                    <el-card class="box-card mt20">
                        <div slot="header">
                            <div class="detail-block-title">
                                <div><h2>Reply to Picture</h2></div>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name: 'after-detail',
    data() {
        return {
            detailInfo: {},
            loading: false,
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
        },
    },
    methods: {
    }
}
</script>
<style lang="scss">
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
  padding-right: 150px;
  list-style:none;
}
// .inputDeep>>>.el-input__inner {
//     border: 0;
//   }
</style>