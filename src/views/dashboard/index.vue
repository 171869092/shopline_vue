<template>
  <div class="dashboard-editor-container">
    <div class="my-order-box">
      <div class="order">
        <el-card class="box-card">
          <div class="top-box">
            <h4>
              <span class="radius" />
              Order
            </h4>
            <div class="main">
              <p class="text">{{ dashboardForm.order }}</p>
              <div class="image-box">
                <img src="@/assets/home/order-circle.png" class="image" alt="">
                <div class="img-text">
                  <p>{{ dashboardForm.new_order }}</p>
                  <p>Newly Added</p>
                </div>
              </div>
              <div class="main-footer">
                <div class="left">
                  <p>Complete</p>
                  <p>{{ dashboardForm.complete }}</p>
                </div>
                <div class="line" />
                <div class="right">
                  <p>Unfinished</p>
                  <p>{{ dashboardForm.unfinished }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div class="product-list-histogram">
        <div class="product-list">
          <el-card class="box-card">
            <div>
              <i class="el-icon-user-solid first" />
              <span>My product</span>
            </div>
            <p>{{ dashboardForm.product }}</p>
          </el-card>
          <el-card class="box-card">
            <div>
              <i class="el-icon-message-solid second" />
              <span>Managed products</span>
            </div>
            <p>{{ dashboardForm.managed_product }}</p>
          </el-card>
          <el-card class="box-card">
            <div>
              <i class="el-icon-location third" />
              <span>Number of stores</span>
            </div>
            <p>{{ dashboardForm.stores_number }}</p>
          </el-card>
          <el-card class="box-card">
            <div>
              <i class="el-icon-coin fourth" />
              <span>Sales amount</span>
            </div>
            <p>{{ dashboardForm.sales_amount }}</p>
          </el-card>
        </div>
        <div class="line-chart">
          <el-card class="box-card">
            <div class="top-box">
              <span class="radius" />
              <span>Logistics information</span>
            </div>
            <div id="myChart" style="width: 100%;height:320px;" />
          </el-card>
          <el-card class="box-card">
            <div class="top-box space">
              <div>
                <span class="radius" />
                <span>After sales information</span>
              </div>
              <el-button type="text" class="btn" @click="$router.push({name: 'after'})">ALL<i class="el-icon-arrow-right" /></el-button>
            </div>
            <el-table
              :data="dashboardForm.after_sales"
              :header-cell-style="{background: '#f6f5fb'}"
            >
              <el-table-column
                prop="order_name"
                label="Name"
              />
              <el-table-column
                prop="state"
                label="State"
              />
              <el-table-column
                prop="after_type"
                label="Type"
              >
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="afterTypes[scope.row.after_type]" placement="top">
                    <span>{{ afterTypes[scope.row.after_type] | ellipsis }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
    </div>
    <div class="sales-dashboard-box">
      <div class="sales-data-box">
        <el-card class="box-card">
          <div class="top-box">
            <span class="radius" />
            <span>Sales data</span>
          </div>
          <div id="twoChart" style="width: 100%;height:320px;" />
        </el-card>
      </div>
      <div class="video-box">
        <iframe
          class="video"
          width="100%"
          height="385px"
          src="https://www.youtube.com/embed/X2hknYbBfPg"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>
    </div>
  </div>
</template>

<script>
import { baseChartIndex } from '@/api/user'
import * as echarts from 'echarts'
import { mapGetters } from 'vuex'
import { shopifyApi } from '@/api/user'
import { setCookies, getCookies } from '@/utils/cookies'
export default {
  name: 'dashboard',
  filters: {
    ellipsis(value) {
      if (!value) {
        return ''
      } else if (value.length > 20) {
        return value.slice(0, 20) + '...'
      } else {
        return value
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  // eslint-disable-next-line vue/order-in-components
  data() {
    return {
      store_url: '',
      id: '',
      websock: null,
      dashboardForm: {
        id: '',
        user_id: '',
        order: '',
        new_order: '',
        managed_product: '',
        product: '',
        sales_amount: '',
        stores_number: '',
        unfinished: '',
        complete: '',
        after_sales: [],
        line: [],
        logistics_information: []
      },
      afterTypes: {
        1: 'Damaged product',
        2: 'Product not received',
        3: 'Unable to query the logistics number',
        4: 'Did not receive the logistics order number',
        5: 'Incorrect recipient information',
        6: 'Wrong product',
        7: 'Logistics information is not updated in time',
        8: 'Other'
      },
      axisOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['To be delivered', 'To be received', 'Received goods']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center'
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'To be delivered',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0.4, 0.8, 1,
                [
                  { offset: 0, color: '#6898ed' },
                  { offset: 0.5, color: '#69bddf' },
                  { offset: 1, color: '#68dccf' }
                ]
              )
            }
          },
          {
            name: 'To be received',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0.4, 0.8, 1,
                [
                  { offset: 0, color: '#febb61' },
                  { offset: 0.5, color: '#f1c077' },
                  { offset: 1, color: '#f9c489' }
                ]
              )
            }
          },
          {
            name: 'Received goods',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0.4, 0.8, 1,
                [
                  { offset: 0, color: '#4fe2c2' },
                  { offset: 0.5, color: '#4fd8d2' },
                  { offset: 1, color: '#4ecde1' }
                ]
              )
            }
          }
        ]
      },
      lineOption: {
        legend: {
          data: []
        },
        xAxis: {
          name: 'Date',
          type: 'category',
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
        },
        yAxis: {
          name: 'Completed',
          type: 'value',
          data: []
        },
        series: []
      }
    }
  },
  created() {
    this.shopifyInit()
  },
  mounted() {
    const myChart = echarts.init(document.getElementById('myChart'))
    const twoChart = echarts.init(document.getElementById('twoChart'))
    baseChartIndex().then(res => {
      const delivered = []
      const received = []
      const received_goods = []
      const store_name = []
      const lineStores = []
      const datas = []
      const lineData = []
      const series = []
      if (res.code === 200) {
        res.data.logistics_information.map(it => {
          delivered.push(it.delivered)
          received.push(it.received)
          received_goods.push(it.received_goods)
          store_name.push(it.store_name)
        })
        for (const key in res.data.line) {
          lineStores.push(res.data.line[key].store_name)
          datas.push(res.data.line[key])
        }
        const lineStore = [...new Set(lineStores)]
        datas.map(it => {
          delete it.store_name
          delete it.store_url
          lineData.push(Object.values(it))
        })
        lineStore.map((item, index) => {
          series.push({
            name: item,
            data: lineData[index],
            itemStyle: {},
            type: 'line',
            smooth: true
          })
        })
        this.lineOption.series = series
        lineData.map((it, inx) => {
          this.$set(this.lineOption.series[inx].itemStyle, 'color', this.getColorRender())
        })
        this.dashboardForm = res.data
        this.$set(this.axisOption.series[0], 'data', delivered)
        this.$set(this.axisOption.series[1], 'data', received)
        this.$set(this.axisOption.series[2], 'data', received_goods)
        this.$set(this.axisOption.xAxis[0], 'data', store_name)
        this.$set(this.lineOption.legend, 'data', lineStore)
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(this.axisOption)
        twoChart.setOption(this.lineOption)
      }
    })
  },
  methods: {
    // 动态生成随机颜色
    getColorRender() {
      let c = '#'
      const cArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
      for (let i = 0; i < 6; i++) {
        const cIndex = Math.round(Math.random() * 15)
        c += cArray[cIndex]
      }
      return c
    },
    shopifyInit() {
      const shopify = getCookies('shopify')
      const shop = getCookies('shop')
      const id = getCookies('uid')
      this.store_url = shop
      this.id = id
      if (shopify && shop) {
        const shopifyQuery = JSON.parse(shopify)
        setCookies('shopify', shopifyQuery)
        setCookies('shop', shopifyQuery.shop)
        // shopifyApi({ ...shopifyQuery })
        // shopifyPush({ shop: shop })
      }
      this.initWebSocket()
    },
    // 初始化weosocket
    initWebSocket() {
      const wsuri = 'wss://socket.fbali.co/wss/test'
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonmessage(e) { // 数据接收
      const redata = JSON.parse(e.data)
      this.store_url = redata.store_url
      console.log('e.code', redata.code)
      if (redata.code === 2) {
        const shopify = getCookies('shopify')
        const shop = getCookies('shop')
        console.log('shopify', shopify)
        this.store_url = shop
        if (shopify) {
          const shopifyQuery = JSON.parse(shopify)
          setCookies('shopify', shopifyQuery)
          setCookies('shop', shopifyQuery.shop)
          shopifyApi({ ...shopifyQuery })
          // shopifyPush({ shop: shop })
        }
      } else {
        this.websocketclose()
      }
    },
    websocketonopen() { // 连接建立之后执行send方法发送数据
      if (this.store_url === '' || this.store_url === undefined || this.store_url === null) {
        const actions = { store_url: this.store_url, type: 'other', id: this.id }
        this.websocketsend(JSON.stringify(actions))
        console.log('当店铺为空时执行')
      } else {
        const actions = { store_url: this.store_url }
        this.websocketsend(JSON.stringify(actions))
        console.log('连接建立之后执行')
      }
    },
    websocketonerror() { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketsend(Data) { // 数据发送
      this.websock.send(Data)
      console.log(Data)
    },
    websocketclose(e) { // 关闭
      console.log('断开连接', e)
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
  .my-order-box {
    display: grid;
    grid-template-columns: 1fr 3.5fr;
    .order {
      margin-right: 20px;
      .box-card {
        border-radius: 10px;
        height: 600px;
        .top-box {
          h4 {
            font-weight: 400;
          }
          .radius {
            display: inline-block;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background-color: #ed7000;
            margin-right: 10px;
          }
          .main {
            text-align: center;
            .text {
              margin: 60px 0 40px;
              font-size: 40px;
              color: #ed7000;
              text-shadow: -4px 4px 3px rgba(0,0,0,.2);
            }
            .image-box {
              position: relative;
              .image {
              }
              .img-text {
                color: #e83f3f;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                p:nth-of-type(1) {
                  font-size: 26px;
                  margin: 0;
                }
              }
            }
            .main-footer {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
              padding: 0 40px;
              color: #8b8c8c;
              .line {
                height: 60px;
                width: 2px;
                background-color: #ddd;
              }
              .right {
                p:nth-of-type(2) {
                  color: #5fa39a;
                }
              }
            }
          }
        }
      }
    }
    .product-list-histogram {
      display: flex;
      flex-direction: column;
      .product-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        height: 166px;
        .box-card {
          position: relative;
          margin-left: 20px;
          border-radius: 10px;
          &:nth-of-type(1) {
            margin-left: 0;
          }
          &::after {
            content: '';
            display: block;
            width: 96%;
            height: 1px;
            background-color: #eee;
            position: absolute;
            top: 55px;
            left: 2%;
          }
          p {
            margin-top: 30px;
            text-align: center;
            font-size: 36px;
            font-weight: 500;
            color: #333;
          }
          span {
            font-weight: 500;
            color: #737373;
          }
          i {
            margin-right: 10px;
            font-size: 18px;
          }
          .first {
            color: #22d2c1;
          }
          .second {
            color: #f2ad50;
          }
          .third {
            color: #3ba9e2;
          }
          .fourth {
            color: #fdd375;
          }
        }
      }
      .line-chart {
        margin-top: 20px;
        display: grid;
        grid-template-columns: 2fr 1fr;
        .box-card {
          margin-left: 20px;
          border-radius: 10px;
          height: 413px;
          &:nth-of-type(1) {
            margin-left: 0;
          }
          .top-box {
            margin-bottom: 20px;
            .radius {
              display: inline-block;
              width: 13px;
              height: 13px;
              border-radius: 50%;
              background-color: #7182eb;
              margin-right: 10px;
            }
          }
          .space {
            display: flex;
            justify-content: space-between;
            .btn {
              padding: 0;
            }
          }
        }
      }
    }
  }
}
.sales-dashboard-box {
  display: grid;
  grid-template-columns: 3fr 1fr;
  margin-top: 20px;
  .sales-data-box {
    padding-right: 16px;
    .box-card {
      border-radius: 10px;
      .top-box {
        .radius {
          display: inline-block;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background-color: #7182eb;
          margin-right: 10px;
        }
      }
    }
  }
  .video-box {
    margin-left: 5px;
    .video {
      border-radius: 10px;
    }
  }
}
</style>
