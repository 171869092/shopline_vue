<template>
  <div>
    <el-dialog title="Add image" :visible.sync="visible" width="30%" :before-close="handleClose">
      <el-upload
          action="https://httpbin.org/post"
          class="uploadBox"
          list-type="picture-card"
          :on-remove="handleRemoves"
          :before-upload="beforeUploads"
          :multiple="true"
          :file-list="picUpLoadFileList"
          ref="myUpload"
      >
        <i class="el-icon-plus"></i>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="small">Cancel</el-button>
        <el-button type="primary" @click="handleClose(1)" size="small" :loading="savePicLoading">Submit</el-button>
      </span>
    </el-dialog>
  
  </div>
</template>

<script>
import { uploadImage } from '@/api/product'
export default {
  name: "uploadPrint",
  components: {},
  props: {
    visible:{
      type: Boolean,
      default:false
    },

  },
  data() {
    return {
      picUpLoadFileList:[],
      picUpLoadList:[],
      savePicLoading:false,

    };
  },
  mounted() {
    
  },
  computed: {

  },
  methods: {
    //关闭弹窗
    handleClose(type){
      if(type != 1) return this.$emit('close',1)
      let data = [];
      let list = [];
      this.savePicLoading = true
      this.picUpLoadList.forEach(item => {
        data.push(this.upLoad(item));
      });
      Promise.all(data).then(result => {
        console.log(result)
        let url = "";
        let name = "";
        list = result.map(item => item["data-service-file"])
        this.$emit('close',list)
        this.$message.success('success');
        this.picUpLoadList = [];
        this.$refs["myUpload"].clearFiles();
        this.savePicLoading = false;
      });
    },
    //本地上传  数据删除
    handleRemoves(file, fileList) {
      this.picUpLoadList = fileList.map(item => item.raw)
    },
    //本地上传  数据更改
    beforeUploads(file){
      this.picUpLoadList.push(file)
    },
    //异步上传图片
    upLoad(file) {
      var formData = new FormData();
      formData.append("id", file.uid);
      formData.append("name", file.name);
      formData.append("type", file.type);
      formData.append("lastModifiedDate", file.lastModifiedDate);
      formData.append("size", file.size);
      formData.append("file", file);
      return new Promise((resolve, reject) => {
         uploadImage(formData).then(res =>{
             resolve(res.data);
         })
      });
    },
  },

}
</script>

<style scoped lang="scss">
// >>> .el-dialog__body{min-height: 500px!important;overflow: overlay!important}
</style>