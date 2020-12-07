<template>
  <div>
    <el-dialog title="Update variant image" :visible.sync="visible" width="40%" :before-close="handleClose">
      <div class="hidden printTitle mb10">
        <el-button type="primary" @click="openUploadPrint" v-if="isUpload" style="float:right" size="small">Add image</el-button>
      </div>

      <!-- <draggable v-model="pictureList" class="d-lb"
        v-bind="{
          animation: 150,
          ghostClass: 'sortable-ghost',
          chosenClass: 'chosenClass',
          scroll: true,
          scrollSensitivity: 200,
        }"
      > -->
      <div class="clearfix"> 
          <el-radio-group v-for="($item, $index) in pictureList" class="image-item mb5" :key="$index" v-model="checkedbox" @change="checkedChange">
            <div>
              {{checkedbox}}
                <el-image :src="$item.url" class="image-img"></el-image>
              <el-radio class="mt5" :label="$item.url">{{$index}}</el-radio>
            </div>
          </el-radio-group>
      </div>
      <!-- </draggable> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="small">Cancel</el-button>
        <el-button type="primary" @click="handleClose(1)" size="small">Submit</el-button>
      </span>
    </el-dialog>
    
    <upload-print :visible="uploadPrintvisible" @close="UploadPrint"></upload-print>
  </div>
</template>

<script>

export default {
  name: "editPrint",
  components: {
    UploadPrint:()=>import("./uploadPrint"),
  },
  data() {
    return {
      isCheckAll:false,            //是否有选项
      checkedbox:[],               //已选中数组
      pictureList: [],             //图片数组
      uploadPrintvisible:false,
      disabled:false
    };
  },
  props: {
    visible:{
      type: Boolean,
      default:false
    },
    isUpload:{
      type: Boolean,
      default:false
    },
    sku:{
      type: String,
      default:""
    },
  },
  watch: {
    visible(val){
      if(val){
        let list = []
        let picture = this.$parent.formData.images.map((item,idx) =>{
            return { url:item.url,  title:'图片' + (idx+1) }
          })
        
        this.checkedbox =  this.$parent.formData.sku_list[this.$parent.editPrintIdx].sku_image
        picture = [...picture,...list]
        this.$set(this,'pictureList',picture)
      }else{
        this.checkedbox = []
        this.pictureList = []
      }
    }
  },

  mounted() {
      
  },
  methods: {
    handleClose(type){
      if(type != 1) return this.$emit('close',1)
      this.$emit('close',{check:this.checkedbox,list:this.pictureList})
    },
    //单选
    checkedChange(value){
      this.checkTurn = false
    },
    // 打开本地上传
    openUploadPrint(){
      this.uploadPrintvisible = true
    },
    // 关闭本地上传
    UploadPrint(type){
      if(type == 1) return this.uploadPrintvisible = false
      let list = type.map((item,idx) =>{
        return {
          url:item,
          title:'本地上传' + (idx+1)
        }
      })
      this.pictureList.push(...list)
      this.checkedbox.push(...type)
      this.uploadPrintvisible = false
    },

  },


}
</script>

<style scoped lang='scss'>
>>> .el-dialog__body{min-height: 600px!important;max-height: 600px!important;overflow:auto!important;padding:5px 20px;}
.image-img{
  width: 120px;
  height: 120px;
  border-radius: 10px;
}
.image-item{
  width: 120px;
  height: 150px;
  float: left;
  margin-right: 10px;
  position: relative;
}
.printTitle{
  background: #f8f8f8;
  line-height: 24px;
  padding:8px;
  width:100%
}
</style>