<template>
  <div class="d-lb list-wrap" :style="{height}">
    <div class="pt10 d-lb w_100">
      <draggable
        v-model="banner_list"
        class="d-lb"
        v-bind="{
          animation: 150,
          ghostClass: 'sortable-ghost',
          chosenClass: 'chosenClass',
          scroll: true,
          scrollSensitivity: 200,
          disabled:isDisabled
        }"
      >
        <div
          v-for="($item, $index) in banner_list"
          :key="$index"
          class="image-item mb20"
          @mouseover.prevent="$item.is_hover = true"
          @mouseleave.prevent="$item.is_hover = false"
        >
          <div v-show="!isFilter">
            <el-image lazy class="image-item" :src="$item.url" :preview-src-list="previewList" />
            <div
              v-show="$item.is_hover"
              class="image_del"
              @mouseover.prevent="$item.is_hover = true"
              @mouseleave.prevent="$item.is_hover = false"
            >
              <i class="el-icon-close" @click="delImg($index)" />
            </div>
            <!-- <div class="image-text">{{$item.source}}</div> -->
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  name: 'print-popover',
  components: {
    draggable
  },
  props: {
    list: {
      type: Array,
      default: () => ([])
    },
    height: {
      type: String,
      default: '230px'
    },
    isBase: {
      type: Boolean,
      default: false
    },
    isFilter: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: 'top'
    }
  },
  data() {
    return {
      banner_list: [],
      savePicLoading: false, // 本地上传 上传按钮状态
      isMainIndex: '0' // 设置产品主图
    }
  },
  computed: {
    previewList() {
      return this.list.map(item => item.url)
    }
  },
  watch: {
    list: {
      // immediate: true, // 这句重要
      handler(val) {
        if (this.isFilter) {
          this.banner_list = val.filter(item => item.is_filter)
        } else {
          this.banner_list = val
        }
      }
    },
    banner_list: {
      handler(val) {
        this.$emit('update', val)
      }
    }
  },
  mounted() {

  },

  methods: {
    // 设置产品主图
    clcikBaseimg(idx) {
      this.isMainIndex = idx
    },
    // 删除图片
    delImg(index) {
      this.$emit('delImg', index)
    },
    setList(list) {
      this.$set(this, 'banner_list', list.filter(item => item.is_filter))
    }
  }
}
</script>

<style lang='scss' scoped>
.list-wrap {
  height:300px!important;
  // overflow:auto;
}
.image-img {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  border:1px solid #c8c8c8;
}
.image-item {
  width: 120px;
  height: 120px;
  float: left;
  // margin-right: 10px;
  position: relative;
  margin-left: 20px;
}
.image_main{
  position: absolute;
  bottom: 0;
  font-size:14px;
  background:red;
  color:#fff;
  width:100%;
  text-align:center;
  bottom: 20px;
}
.p_tb2{
  padding:2px 0;
}
.c_e6a23c{
  background:#e6a23c;
}
.image_del {
  padding: 0px 4px;
  position: absolute;
  top: -8px;
  right: -26px;
  border-radius:16px;
  background: red;
  color:#fff;
}
.top10{
  top:10px
}
.image-text{
  width: 70px;
  // min-height:16px;
  font-size: 14px;
  // padding-left: 3px;
  // margin-bottom: 4px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  text-align: center;
}
>>> .p5_input>.el-input__inner{
  height:20px;
  line-height:20px;
}
</style>
