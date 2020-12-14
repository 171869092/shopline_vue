<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { mapGetters } from 'vuex'
import { shopifyApi, shopifyPush } from '@/api/user'
// import createApp from '@shopify/app-bridge'
// import { Redirect, Button } from '@shopify/app-bridge/actions'
// import { getSessionToken } from '@shopify/app-bridge-utils'
import { getSession } from '@/utils/session'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'dashboard',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    // const shopOrigin = 'live-by-test.myshopify.com'
    // const apiKey = '5fdf0435f9093519625df5bfca4c8a31'
    // const redirectUri = 'https://api.dongketech.com/site/generatr-token'
    // const permissionUrl = `https://${shopOrigin}/admin/oauth/authorize?client_id=${apiKey}&scope=read_products,read_content&redirect_uri=${redirectUri}`

    // // If the current window is the 'parent', change the URL by setting location.href
    // if (window.top === window.self) {
    //   console.log('redirect')
    //   window.location.assign(permissionUrl)
    //   // If the current window is the 'child', change the parent's URL with Shopify App Bridge's Redirect action
    // } else {
    //   console.log('init')
    //   const app = createApp({
    //     apiKey: apiKey,
    //     shopOrigin: shopOrigin
    //   })
    //   console.log(app)

    //   const myButton = Button.create(app, { label: 'Save' })
    //   console.log(myButton)

    //   Redirect.create(app).dispatch(Redirect.Action.REMOTE, permissionUrl)
    // }
    this.shopifyInit()
  },
  methods: {
    shopifyInit() {
      const shopify = getSession('shopify')
      if (shopify && shopify.hmac) {
        shopifyApi({ ...shopify }).then(res => {
          shopifyPush({ shop: shopify.shop }).then(res => {
            console.log(res.data)
          }).catch(err => {
            console.log(err)
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-editor-container {
  padding: 30px;
  .chart-wrapper {
    background: #fff;
    padding: 20px 20px;
  }
}
</style>
