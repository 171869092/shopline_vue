<template>
  <div>
    <el-dialog title="编辑图片" :visible.sync="visible" width="40%" :before-close="handleClose">
      <div class="hidden printTitle mb10">
        <el-button type="primary" @click="openUploadPrint" v-if="isUpload" style="float:right" size="small">Add image</el-button>
      </div>

      <!-- <draggable v-model="pictureList" class="d-lb"
        :options="{
          animation: 150,
          ghostClass: 'sortable-ghost',
          chosenClass: 'chosenClass',
          scroll: true,
          scrollSensitivity: 200,
        }"
      > -->
      <div class="clearfix"> 
          <el-checkbox-group v-for="($item, $index) in pictureList" class="image-item mb5" :key="$index" v-model="checkedbox" @change="checkedChange">
            <div>
              <el-popover :open-delay='400' placement="right" trigger="click">
                <img :src="$item.url" style="width:650px;height:650px">
                <el-image :src="$item.url" class="image-img" slot="reference"></el-image>
              </el-popover>
              <el-checkbox class="mt5" :disabled="(!checkedbox.includes($item.url)) && (checkedbox.length > 1)"></el-checkbox>
            </div>
          </el-checkbox-group>
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
// import { loadAllSubImg } from '@/api/amazon'
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
            return { url:item.img_url,  title:'图片' + (idx+1) }
          })
        // list = this.$parent.formData.images[this.$parent.editPrintIdx].filter(item => !res.data.includes(item)).map((item,idx) =>{
        //     return { url:item,  title:'本地' + (idx+1) }
        // })
        // console.log(this.$parent.formData.images);
        picture = [...picture,...list]
        this.$set(this,'pictureList',picture)
        // console.log(this.pictureList)
        // loadAllSubImg({sku:this.sku}).then(res =>{
        //   let list = []
        //   console.log(this.$parent.formData.images);
        //     list = this.$parent.formData.goods_sku[this.$parent.editPrintIdx].image.filter(item => !res.data.includes(item)).map((item,idx) =>{
        //       return { url:item,  title:'本地' + (idx+1) }
        //     })
        //   this.checkedbox = this.$parent.formData.goods_sku[this.$parent.editPrintIdx].image
        //   let picture = res.data.map((item,idx) =>{
        //     return { url:item,  title:'图片' + (idx+1) }
        //   })
        //   picture = [...picture,...list]
        //   // 依照选择顺序 排序
        //   let order = this.checkedbox
        //   let picture1 = picture.filter(item => order.includes(item.url)).sort(function(a,b){
            
        //       return order.indexOf(a.url) - order.indexOf(b.url);
        //   });
        //   let picture2 = picture.filter(item => !order.includes(item.url))
        //   this.$set(this,'pictureList',picture1.concat(picture2))
        // })
      }else{
        this.isCheckAll = false
        this.checkAll = false
        this.checkTurn = false
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
      // 依照列表顺序 排序
      let order = this.pictureList.map(res => res.url)
      this.checkedbox.sort(function(a,b){
          return order.indexOf(a) - order.indexOf(b);
      });
      this.$emit('close',{type:this.checkedbox,list:this.pictureList})
    },
    //单选
    checkedChange(value){
      // this.checkAll = checkedCount === this.pictureList.length;
      // this.isCheckAll = checkedCount > 0 && checkedCount < this.pictureList.length;
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