<template>
  <div class="dashboard-editor-container">
    <div v-if="isdev">
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
    <div v-else class="flexbox justify-center align-center" style="height:80vh">
      <div class="text-center">
        <h2 class="_281hA">Welcome to FbAli</h2>
        <h4 class="dashboard__sub-title">Build Your Business With FbAli</h4>
        <!-- <div class="nodata">
          <img src="data:image/png;base64,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">
        </div> -->
      </div>
    </div>
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
import { getCookies } from '@/utils/cookies'
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
      lineChartData: lineChartData.newVisitis,
      isdev: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.shopifyInit()
  },
  methods: {
    shopifyInit() {
      const shopify = getCookies('shopify')
      const shop = getCookies('shop')
      if (shopify && shop) {
        const shopifyQuery = JSON.parse(shopify)
        shopifyApi({ ...shopifyQuery }).then(res => {
          shopifyPush({ shop: shop }).then(res => {
            console.log(res)
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
.dashboard__sub-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #272742;
  padding-top: 8px;
  color: #6f6f85;
}
</style>
