<template> 
  <el-row class="home">
    <el-col class="fixed-title" :span="8">
       <span>DropShipping</span>
    </el-col>
    <el-col class="fixed-header" :span="12">
       <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
             <el-menu-item :index="String(key + 1)" v-for="(item,key) in menuList" :key="key">{{item}}</el-menu-item>
      </el-menu>
    </el-col>
    <el-col class="fixed-login" @click="loginclick" :span="4">login</el-col>
      
  </el-row>
</template>
<script>
    export default {
      data(){
        return{
          activeIndex:'1',
          menuList:['HOME','FAQ','CONTACT']
        }
      },
      methods:{
        loginclick(){
          this.$router.push({ name: 'login' })
        },
        handleSelect(){

        }
      }
    }
</script>
<style lang="scss" scoped>
.home{
  width:100%;
  height: 80px;
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  .fixed-header{ 
      z-index: 9;
      width: calc(100% - 500px);
      -webkit-transition: width .28s;
      transition: width .28s;
  }
  .fixed-title{
    height: 60px;
    background: #409eff;
    span{
       margin-left: 30%;
       line-height: 60px;
       font-size: 24px;
    }
  }
  .fixed-login{
    height: 60px;
    background: #409eff;
  }
  .el-menu{ 
    background: #409eff;
     .el-menu-item{
       width: 120px;
       text-align: center;
     }
  }
}
</style>