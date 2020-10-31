<template>
  <div @click="loginclick">login</div>
</template>
<script>
    export default {
      data(){
        return{}
      },
      methods:{
        loginclick(){
          this.$router.push({ name: 'login' })
        }
      }
    }
</script>