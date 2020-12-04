<template>
  <div class="d-lb list-wrap" :style="{height}">
    <div class="pt10 d-lb w_100">
      <draggable v-model="banner_list" class="d-lb"
        v-bind="{
          animation: 150,
          ghostClass: 'sortable-ghost',
          chosenClass: 'chosenClass',
          scroll: true,
          scrollSensitivity: 200,
          disabled:isDisabled
        }"
      >
          <div v-for="($item, $index) in banner_list" class="image-item mb5" :key="$index" @mouseover.prevent="$item.is_hover = true" @mouseleave.prevent="$item.is_hover = false">
            <div v-show="!isFilter">
              <!-- {{banner_list}} -->
                <el-image :src="$item.url" :preview-src-list="banner_list.map(item =>item.url)"></el-image>
                <!-- <div><el-input v-model="$item.title" size="mini" class="w-250 p5_input" v-if="titleShow"></el-input></div> -->
              <div class="image_del" v-show="$item.is_hover"
                @mouseover.prevent="$item.is_hover = true"
                @mouseleave.prevent="$item.is_hover = false"
              >
                <i class="el-icon-close" @click="delImg($index)"></i>
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
  name: "PrintPopover",
  components: {
    draggable
  },
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
          console.log(this.isFilter);
        }else{
          this.banner_list = val   
          console.log(val);
        }
      },
    },
    banner_list:{
        handler(val){
            this.$emit('update',val)
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
  width: 100px;
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
  padding: 0px 4px;
  position: absolute;
  top: 10px;
  top: -8px;
  right: -8px;
  border-radius:24px;
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