<template>
  <div class="notification-box">
    <div class="box-card">
      <div class="btn-box p20">
        <div>
          <el-button class="mr30" size="small" icon="el-icon-back" @click="handleBack" />
          <span>{{ notification.name }}</span>
        </div>
        <el-button type="primary" size="small" @click="handleDelete">Delete</el-button>
      </div>
    </div>
    <el-card class="m20 mt0">
      <div class="content-box">{{ notification.content }}</div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'notification',
  data() {
    return {
      notification: {
        name: '',
        content: ''
      }
    }
  },
  created() {
    this.notification = this.$route.query.list
  },
  methods: {
    // 删除
    handleDelete() {},
    handleBack() {
      this.$router.push({ name: 'messages', query: { paneName: 'system' }})
    }
  }
}
</script>

<style scoped lang="scss">
.notification-box {
  .box-card {
    .btn-box {
      display: flex;
      justify-content: space-between;
    }
  }
  .content-box {
    min-height: 300px;
    padding: 0 20px;
  }
}
</style>
