<template>
  <div class="b-navbar shadow-sm" :class="{'has-logo':showLogo}">
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <logo v-if="showLogo" :collapse="false" />

    <div class="flexbox justify-space-between">
      <breadcrumb class="breadcrumb-container" />

      <div class="flexbox">
        <!-- <div class="download-ex">
          <i class="el-icon-download" />
        </div> -->
        <div class="right-menu hWifi" @click="handleRequestWifi">
          <img v-if="realTime > 0 && realTime <= 500" src="@/assets/home/wifi4.png" width="25px" height="25px">
          <img v-if="realTime > 500 && realTime <= 1000" src="@/assets/home/wifi3.png" width="25px" height="25px">
          <img v-if="realTime > 1000 && realTime <= 1500" src="@/assets/home/wifi2.png" width="25px" height="25px">
          <img v-if="realTime > 1500 && realTime <= 2000" src="@/assets/home/wifi1.png" width="25px" height="25px">
          <img v-if="realTime > 2000 || realTime === '0'" src="@/assets/home/wifi0.png" width="25px" height="25px">
          <span class="real-time">{{realTime}}/ms</span>
        </div>
        <div class="right-menu">
          <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
              <el-avatar :src="avatar" size="small" @error="errorHandler">
                <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png">
              </el-avatar>
              <span class="user-name">{{ email }}</span>
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logout">
                <span style="display:block;">Log out</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="right-menu notice" @click="handleNotice">
          <i class="el-icon-message-solid" />
          <span v-if="notice.length > 0" class="round" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'
import Logo from './Sidebar/Logo'
import { getUnreadMessage } from '@/api/notice'
import { getBaseMonitor } from '@/api/wifi'

export default {
  components: {
    Breadcrumb,
    Logo
    // Hamburger
  },
  data() {
    return {
      notice: [],
      realTime: '0',
      wifiTime: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'email'
    ]),
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    }
  },
  created() {
    this.initNotice()
    this.wifiSetInterval()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      window.clearInterval(window.timer)
      this.clearWifiInterval()
      // this.$router.push({ name: 'home' })
      window.open('https://fbali.co/', '_self')
    },
    errorHandler() {
      return true
    },
    handleNotice() {
      this.$router.push({ name: 'messages' })
    },
    initNotice() {
      getUnreadMessage().then(res => {
        if (res.code === 200) {
          this.notice = res.data
        }
      })
    },
    wifiSetInterval() {
      this.wifiTime = setInterval(this.handleRequestWifi, 10000)
    },
    clearWifiInterval() {
      clearInterval(this.wifiTime)
    },
    handleRequestWifi() {
      const startTime = new Date()
      getBaseMonitor().then(res => {
        const endTime = new Date()
        this.realTime = endTime.getTime() - startTime.getTime()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.b-navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 40px;

      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .user-name {
          margin-left: 5px;
          color: #646978FF;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
  .notice {
    margin-right: 20px;
    font-size: 20px;
    color: #999;
    position: relative;
    cursor: pointer;
    .round {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #d4302f;
      position: absolute;
      top: 12px;
      left: 14px;
    }
  }
  .hWifi {
    margin-right: 30px;
    img {
      vertical-align: sub;
    }
    .hIcon {
      color: #ef6f38;
      font-size: 12px;
    }
    .real-time {
      color: #ef6f38;
      font-size: 12px;
      margin-left: 2px;
    }
  }
}
.download-ex {
  line-height: 50px;
  margin-right: 15px;
}
</style>
