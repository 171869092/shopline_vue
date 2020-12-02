<template>
  <div class="d-lb list-wrap" :style="{height}">
    <div class="pt10 d-lb w_100">
      <!-- <draggable v-model="banner_list" class="d-lb"
        :options="{
          animation: 150,
          ghostClass: 'sortable-ghost',
          chosenClass: 'chosenClass',
          scroll: true,
          scrollSensitivity: 200,
          disabled:isDisabled
        }"
      > -->
          <div v-for="($item, $index) in banner_list" class="image-item mb5" :key="$index"
              @mouseover.prevent="$item.is_hover = true" @mouseleave.prevent="$item.is_hover = false"
          >
            <div v-show="!isFilter || ($item.is_filter)">
              <el-popover :placement="placement" trigger="click" :open-delay="400" offset=800>
                <el-image :src="$item.img_url" :style="popoverStyle"></el-image>
                <div><el-input v-model="$item.title" size="mini" class="w-250 p5_input" v-if="titleShow"></el-input></div>
                
                <div slot="reference" class='text-center' @click="clcikBaseimg($index)">
                  <el-image class="image-img" :src="$item.img_url" lazy alt="加载失败..."  />
                </div>
              </el-popover>

              <div class="image_main" v-if="isBase && !isDisabled">
                <div class="c_e6a23c p_tb2" v-if="(isMainIndex == $index)&&($item.is_main == '0')">选择</div>
                <span class="d-lb p_tb2" v-if="$item.is_main == '1'">主图</span>
              </div>

              <div class="image_del"  :class="isBase?'top10':''" v-if="!isDisabled" v-show="$item.is_hover" 
                @mouseover.prevent="$item.is_hover = true"
                @mouseleave.prevent="$item.is_hover = false"
              >
                <i class=" el-icon-close" @click="delImg($index)"></i>
              </div>
              <div class="image-text">{{$item.source}}</div>
            </div>
          </div>
      <!-- </draggable> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "PrintPopover",
  props: {
    list: {
      type: Array,
      default: []
    },
    height:{
      type: String,
      default:'230px'
    },
    isBase:{
      type: Boolean,
      default:false
    },
    isFilter:{
      type: Boolean,
      default:false
    },
    isDisabled:{
      type: Boolean,
      default:false
    },
    popoverStyle:{
      type:Object,
      default:{}
    },
    titleShow:{
      type: Boolean,
      default:false
    },
    placement:{
      type: String,
      default:'top'
    }
  },
  watch: {
    list: {
      // immediate: true, // 这句重要
      handler(val) {
        if(this.isFilter){
          this.banner_list = val.filter(item => item.is_filter)
        }else{
          this.banner_list = val
        }
      }
    }
  },
  data() {
    return {
      banner_list: [],
      savePicLoading: false, //本地上传 上传按钮状态
      isMainIndex:"0",        //设置产品主图
    };
  },
  mounted() {

  },
  computed: {},

  methods: {
    //设置产品主图
    clcikBaseimg(idx){
      this.isMainIndex = idx
    },
    //删除图片
    delImg(index){
      this.$emit('delImg',index)
    },
    setList(list){
      this.$set(this,'banner_list',list.filter(item => item.is_filter))
    },
    getImg(){
      if(this.list.length == this.banner_list.length){
        return this.banner_list
      }else{
        return this.list
      }
      
      
    },



  }
};
</script>

<style lang='scss' scoped>
.list-wrap {
  height:180px;
  overflow:auto;
}
.image-img {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  border:1px solid #c8c8c8;
}
.image-item {
  width: 80px;
  height: 100px;
  float: left;
  margin-right: 10px;
  position: relative;
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
  padding: 3px 4px;
  position: absolute;
  // top: 10px;
  top: -8px;
  right: -8px;
  border-radius: 50px;
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