<template>
  <div class="dashboard-editor-container">
    <div class="my-order-box">
      <div class="order">
        <el-card class="box-card">
          <div class="top-box">
            <h4><span class="radius"></span>Order</h4>
            <div class="main">
              <p class="text">{{dashboardForm.order}}</p>
              <div class="image-box">
                <img src="@/assets/home/order-circle.png" class="image">
                <div class="img-text">
                  <p>{{dashboardForm.new_order}}</p>
                  <p>Newly Added</p>
                </div>
              </div>
              <div class="main-footer">
                <div class="left">
                  <p>Complete</p>
                  <p>{{dashboardForm.complete}}</p>
                </div>
                <div class="line"></div>
                <div class="right">
                  <p>Unfinished</p>
                  <p>{{dashboardForm.unfinished}}</p>
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
              <i class="el-icon-user-solid first"></i>
              <span>My product</span>
            </div>
            <p>{{dashboardForm.product}}</p>
          </el-card>
          <el-card class="box-card">
            <div>
              <i class="el-icon-message-solid second"></i>
              <span>Managed products</span>
            </div>
            <p>{{dashboardForm.managed_product}}</p>
          </el-card>
          <el-card class="box-card">
            <div>
              <i class="el-icon-location third"></i>
              <span>Number of stores</span>
            </div>
            <p>{{dashboardForm.stores_number}}</p>
          </el-card>
          <el-card class="box-card">
            <div>
              <i class="el-icon-coin fourth"></i>
              <span>Sales amount</span>
            </div>
            <p>{{dashboardForm.sales_amount}}</p>
          </el-card>
        </div>
        <div class="line-chart">
          <el-card class="box-card">
            <div class="top-box">
              <span class="radius"></span>
              <span>Logistics information</span>
            </div>
            <div id="myChart" style="width: 100%;height:320px;"></div>
          </el-card>
          <el-card class="box-card">
            <div class="top-box space">
              <div>
                <span class="radius"></span>
                <span>After sales information</span>
              </div>
              <el-button type="text" class="btn" @click="$router.push({name: 'after'})">ALL<i class="el-icon-arrow-right"></i></el-button>
            </div>
            <el-table
              :data="dashboardForm.after_sales"
              :header-cell-style="{background: '#f6f5fb'}">
              <el-table-column
                prop="order_name"
                label="Name">
              </el-table-column>
              <el-table-column
                prop="state"
                label="State">
              </el-table-column>
              <el-table-column
                prop="after_type"
                label="Type">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="afterTypes[scope.row.after_type]" placement="top">
                    <span>{{ afterTypes[scope.row.after_type] | ellipsis}}</span>
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
            <span class="radius"></span>
            <span>Sales data</span>
          </div>
          <div id="twoChart" style="width: 100%;height:320px;"></div>
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
  data() {
    return {
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
          name: 'Number',
          type: 'value',
          data: [10, 20, 30, 40]
        },
        series: [
          {
            name: 'live-by-test',
            type: 'line',
            smooth: true,
            emphasis: {
              focus: 'series'
            },
            data: [1, 5, 33, 22, 8, 25, 36, 5, 34, 14, 8, 25, 5, 5, 33, 35, 8, 25, 12, 5, 22, 11, 8, 25, 37, 5, 24, 25, 8, 25],
            itemStyle: {
              color: '#6898ed'
            }
          },
          {
            name: 'live-by-testing',
            type: 'line',
            smooth: true,
            emphasis: {
              focus: 'series'
            },
            data: [7, 5, 27, 22, 8, 33, 36, 5, 5, 14, 8, 25, 5, 5, 33, 35, 8, 7, 36, 5, 22, 12, 8, 25, 37, 5, 12, 25, 8, 25],
            itemStyle: {
              color: '#68dccf'
            }
          }
        ]
      }
    }
  },
  mounted() {
    const arr = [320, 332, 301, 334, 390, 200, 230]
    const myChart = echarts.init(document.getElementById('myChart'))
    const twoChart = echarts.init(document.getElementById('twoChart'))
    baseChartIndex().then(res => {
      const delivered = []
      const received = []
      const received_goods = []
      const store_name = []
      const lineStores = []
      const lineAxis = []
      let firstDay = 1
      if (res.code === 200) {
        res.data.logistics_information.map(it => {
          delivered.push(it.delivered)
          received.push(it.received)
          received_goods.push(it.received_goods)
          store_name.push(it.store_name)
        })
        console.log('res.data.line===', res.data.line)
        firstDay = res.data.line[0].date.slice(8)
        console.log('123123', firstDay)
        res.data.line.map(it => {
          it.stores.map(i => {
            lineStores.push(i.store_name)
            lineAxis.push(i.sale_amount)
          })
        })
        const lineStore = [...new Set(lineStores)]
        const lineAxisD = [...new Set(lineAxis)]
        console.log('lineAxisD===', lineAxisD)
        this.dashboardForm = res.data
        this.$set(this.axisOption.series[0], 'data', delivered)
        this.$set(this.axisOption.series[1], 'data', received)
        this.$set(this.axisOption.series[2], 'data', received_goods)
        this.$set(this.axisOption.xAxis[0], 'data', store_name)
        this.$set(this.lineOption.legend, 'data', lineStore)
        // 当销售额不为0时放开该段代码
        // this.$set(this.lineOption.yAxis, 'data', lineAxisD)
        this.$set(this.lineOption.series, 'data', arr)
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(this.axisOption)
        twoChart.setOption(this.lineOption)
      }
    })
  },
  methods: {
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
