<template>
  <div class="personal-center">
    <el-card class="box-card">
      <div class="flexbox justify-space-between">
        <p>Personal</p>
        <el-button type="primary" size="small" @click="storage" class="mr10 mb10">Storage</el-button>
      </div>
      <el-divider class="line"/>
      <el-form ref="personal" :model="basicsForm" status-icon :rules="personalRules" label-width="150px" class="form-box">
        <div class="basics-box">
          <el-form-item label="Name" prop="name">
            <el-input v-model="basicsForm.name" type="text" autocomplete="off" />
          </el-form-item>
          <el-form-item label="E-mail" prop="mail">
            <el-input v-model="basicsForm.mail" type="text" autocomplete="off" />
          </el-form-item>
        </div>
        <div class="basics-tow-box">
          <el-form-item label="Lastname" prop="last_name">
            <el-input v-model="basicsForm.last_name" type="text" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Telephone" prop="telephone">
            <el-input v-model="basicsForm.telephone" type="text" autocomplete="off" />
          </el-form-item>
        </div>
        <div class="image-box">
          <div></div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'personal-center',
  data() {
    return {
      basicsForm: {
        name: '',
        mail: '',
        last_name: '',
        telephone: ''
      },
      personalRules: {}
    }
  },
  methods: {
    // storage
    storage() {}
  }
}
</script>

<style scoped lang="scss">
.personal-center {
  .line {
    margin-top: 0;
  }
  .form-box {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
