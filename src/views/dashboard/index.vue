<template>
  <div class="dashboard-editor-container">
    <div class="my-order-box">
      <div class="order">
        <el-card class="box-card">
          <div class="top-box">
            <h4><span class="radius"></span>Order</h4>
            <div class="main">
              <p class="text">16,6556,254</p>
              <div class="image-box">
                <img src="@/assets/home/order-circle.png" class="image">
                <div class="img-text">
                  <p>1000</p>
                  <p>Newly Added</p>
                </div>
              </div>
              <div class="main-footer">
                <div class="left">
                  <p>Complete</p>
                  <p>2300</p>
                </div>
                <div class="line"></div>
                <div class="right">
                  <p>Unfinished</p>
                  <p>2300</p>
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
            <p>50</p>
          </el-card>
          <el-card class="box-card">
            <div>
              <i class="el-icon-message-solid second"></i>
              <span>Managed products</span>
            </div>
            <p>50</p>
          </el-card>
          <el-card class="box-card">
            <div>
              <i class="el-icon-location third"></i>
              <span>Number of stores</span>
            </div>
            <p>50</p>
          </el-card>
          <el-card class="box-card">
            <div>
              <i class="el-icon-coin fourth"></i>
              <span>Sales amount</span>
            </div>
            <p>50</p>
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
              <el-button type="text" class="btn">ALL<i class="el-icon-arrow-right"></i></el-button>
            </div>
            <el-table
              :data="tableData"
              :header-cell-style="{background: '#f6f5fb'}">
              <el-table-column
                prop="name"
                label="Name">
              </el-table-column>
              <el-table-column
                prop="state"
                label="State">
              </el-table-column>
              <el-table-column
                prop="type"
                label="Type">
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
    </div>
    <div class="flexbox justify-center align-center" style="height:80vh">
      <div class="text-center" style="width:100%">
        <h2 class="_281hA">Welcome to FbAli</h2>
        <h4 class="dashboard__sub-title">Build Your Business With FbAli</h4>
        <!-- <div class="nodata">
          <img src="data:image/png;base64,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">
        </div> -->
        <iframe
          class="mt20"
          width="60%"
          height="550px"
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
export default {
  name: 'dashboard',
  components: {
  },
  data() {
    return {
      tableData: [
        {
          name: '#1133',
          state: 'In process',
          type: 'Product damage'
        },
        {
          name: '#1133',
          state: 'Processed',
          type: 'Logistics information'
        },
        {
          name: '#1133',
          state: 'In process',
          type: 'Product damage'
        },
        {
          name: '#1133',
          state: 'Processed',
          type: 'Logistics information'
        }
      ]
    }
  },
  computed: {
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    drawChart() {
      const echarts = require('echarts')
      const myChart = echarts.init(document.getElementById('myChart'))
      // 指定图表的配置项和数据
      const option = {
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
            data: ['1', '5', '10', '15', '20', '25', '30']
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
            data: [320, 332, 301, 334, 390, 200, 230],
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
            data: [220, 182, 191, 234, 290, 250, 270],
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
            data: [150, 232, 201, 154, 190, 320, 370],
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
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
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
  .chart-wrapper {
    background: #fff;
    padding: 20px 20px;
  }
}
.dashboard__sub-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  padding-top: 8px;
  color: #6f6f85;
}
</style>
