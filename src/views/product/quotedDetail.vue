<template>
  <div class="quoted-detail-box">
    <div class="box-card">
      <div class="btn-box p20">
        <el-button class="mr30" size="small" icon="el-icon-back" @click="$router.back()" />
        <el-button v-if="!someThingAdopt" type="primary" size="small" @click="cancellation">Cancellation</el-button>
        <el-button v-if="someThingAdopt" type="primary" size="small" @click="handleSave">Save</el-button>
      </div>
    </div>
    <el-form :model="formData" :rules="formDataRules" label-width="160px" label-position="top">
      <el-card class="m20 mt0">
        <div class="card-innerBox">
          <el-form-item label="Title" prop="title">
            <el-input v-model="formData.product_title" placeholder="Title" readonly />
          </el-form-item>
          <el-form-item label="Source URL" prop="url">
            <el-link v-if="platform_index_id" :href="`https://aliexpress.com/item/${platform_index_id}.html`" type="primary" target="_blank" style="margin-left:20px">
              {{ `https://aliexpress.com/item/${platform_index_id}.html` }}
            </el-link>
            <el-input v-model="formData.url" placeholder="Source URL" readonly />
          </el-form-item>
        </div>
      </el-card>
      <el-card class="m20 mt0">
        <h5 class="mt20 ml40">Media</h5>
        <el-divider />
        <div class="card-innerBox">
          <el-form-item label="">
            <el-image :src="formData.img" style="height: 180px;width: 200px" />
          </el-form-item>
        </div>
      </el-card>
      <el-card class="m20 mt0 pb20">
        <div class="btn-box p20">
          <h5>Quoted price</h5>
          <el-button type="primary" size="small" @click="isTotal = !isTotal">{{ isTotal ? 'Total' : 'Details' }}</el-button>
        </div>
        <draggable v-model="draggableList">
          <div v-for="(item, key) in draggableList" :key="key" class="price-box">
            <div class="title-box">
              <div class="title" :style="{'background-color': item.newData ? item.titleStyle : '#ccc'}" @click="item.newData = true">
                <img src="@/assets/home/drag.png" width="25px" height="25px">
                <span style="margin: 0 20px">{{ getValueOfLabel(item.title, storeList) }}</span>
                <span>{{ item.time }}</span>
              </div>
              <div v-if="item.pre.length > 0" class="title" :style="{'background-color': item.newData ? '#ccc' : item.titleStyle}" @click="item.newData = false">
                <span style="margin: 0 20px">{{ getValueOfLabel(item.title, storeList) }}</span>
                <span>{{ item.time }}</span>
              </div>
            </div>
            <el-table
              v-if="item.newData"
              ref="multipleTable"
              :data="item.next"
              style="width: 100%"
              highlight-current-row
              fit
              border
              :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
            >
              <el-table-column v-for="(item, idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width" fixed="left">
                <template slot-scope="scope">
                  <span v-if="item.type === undefined">{{ scope.row[item.value] }}</span>
                  <span v-if="item.type === 'serial'">
                    <span v-if="scope.row.someThingAdopt">
                      <el-checkbox v-model="item.check" @click="handleClickCheckbox(item)" @change="handleChangeCheckbox(item)" />
                    </span>
                    <span v-if="!scope.row.someThingAdopt">{{ scope.row[item.value] }}</span>
                  </span>
                  <span v-if="item.type === 'img'">
                    <el-image class="sku_image" style="width: 50px; height: 50px" :src="scope.row.img" fit="cover">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" style="font-size: 30px;" />
                      </div>
                    </el-image>
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-for="item2 in countryLabelList" :key="item2.label" :label="item2.label" :prop="item2.value" :width="item.width">
                <template slot="header" slot-scope="scope">
                  <div>{{ scope.column.label }}</div>
                </template>
                <template slot-scope="scope">
                  <span v-if="!isTotal">{{ scope.row[item2.value].total }}</span>
                  <span v-if="isTotal" class="change-style">
                    <span class="left">
                      <span class="title">Total</span>
                      <span>{{ scope.row[item2.value].total }}</span>
                    </span>
                    <span class="right">
                      <span class="title">Details</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Product: </span>{{ scope.row[item2.value].product_price }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Service: </span>{{ scope.row[item2.value].service_price }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Logistics: </span>{{ scope.row[item2.value].logistics_fee }}</span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="Operation" width="120" fixed="right">
                <template slot-scope="scope">
                  <span style="color: #ef6f38; cursor: pointer" @click="handleAdopt(scope.row, item)">Adopt</span>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-if="item.pre.length > 0 && !item.newData"
              ref="multipleTable"
              :data="item.pre"
              style="width: 100%"
              highlight-current-row
              fit
              border
              :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
            >
              <el-table-column v-for="(item, idx) in labelList" :key="idx" :label="item.label" :prop="item.value" :width="item.width" fixed="left">
                <template slot="header" slot-scope="scope">
                  <div>{{ scope.column.label }}</div>
                </template>
                <template slot-scope="scope">
                  <span v-if="item.type === undefined">{{ scope.row[item.value] }}</span>
                  <span v-if="item.type === 'serial'">
                    <span>{{ scope.$index + 1 }}</span>
                  </span>
                  <span v-if="item.type === 'img'">
                    <el-image class="sku_image" style="width: 50px; height: 50px" :src="scope.row.img" fit="cover">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" style="font-size: 30px;" />
                      </div>
                    </el-image>
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-for="item2 in countryLabelList" :key="item2.label" :label="item2.label" :prop="item2.value" :width="item.width">
                <template slot="header" slot-scope="scope">
                  <div>{{ scope.column.label }}</div>
                </template>
                <template slot-scope="scope">
                  <span v-if="!isTotal">{{ scope.row[item2.value].total }}</span>
                  <span v-if="isTotal" class="change-style">
                    <span class="left">
                      <span class="title">Total</span>
                      <span>{{ scope.row[item2.value].total }}</span>
                    </span>
                    <span class="right">
                      <span class="title">Details</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Product: </span>{{ scope.row[item2.value].product_price }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Service: </span>{{ scope.row[item2.value].service_price }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Logistics: </span>{{ scope.row[item2.value].logistics_fee }}</span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="Operation" width="120" fixed="right">
                <template>
                  <span>Adopt</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </draggable>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { getQuotedEdit, getAllProductEdit, getServiceList } from '@/api/product'
export default {
  name: 'quoted-detail',
  components: {
    draggable
  },
  data() {
    return {
      labelList: [
        { label: 'Serial', value: 'serial', type: 'serial', width: '80' },
        { label: 'Picture', value: 'img', type: 'img', width: '120' },
        { label: 'Size', value: 'size', width: '120' },
        { label: 'Weight(G)', value: 'weight', width: '120' },
        { label: 'Product_price', value: 'product_price', width: '150' },
        { label: 'Service_price', value: 'service_price', width: '150'}
      ],
      countryLabelList: [],
      formData: {
        product_title: '',
        url: '',
        img: '',
        pre: {
          sub_data: []
        },
        next: {
          sub_data: []
        },
        temporary: {}
      },
      formDataRules: {},
      isTotal: false,
      someThingAdopt: false,
      adoptTureList: [],
      adoptFalseList: [],
      adoptList: [],
      draggableList: [],
      id: '',
      product_id: '',
      platform_index_id: '',
      storeList: []
    }
  },
  created() {
    this.id = this.$route.query.id
    this.product_id = this.$route.query.product_id
    this.init()
  },
  methods: {
    init() {
      getServiceList().then(res => {
        if (res.code === 200) {
          this.storeList = res.data
        }
      })
      const data = {
        id: this.id
      }
      getQuotedEdit(data).then(res => {
        if (res.code === 200) {
          this.formData = res.data
          const temporary = res.data.sub_data
          for (const key in temporary) {
            this.$set(temporary[key], 'newData', true)
            this.$set(temporary[key], 'title', key)
            this.$set(temporary[key], 'titleStyle', this.getColorRender())
            this.draggableList.push(temporary[key])
          }
          const country = res.data.country.split(',')
          const labelList = []
          this.draggableList.map(it => {
            it.next.map((item, inx) => {
              this.$set(item, 'serial', inx + 1)
              this.$set(item, 'check', false)
              this.$set(item, 'someThingAdopt', false)
              country.map(e => {
                const sum = {
                  label: e,
                  value: e,
                  type: 'dynamic',
                  width: '500'
                }
                labelList.push(sum)
              })
            })
          })
          const newobj = {}
          const arr = labelList.reduce((preVal, curVal) => {
            newobj[curVal.label] ? '' : newobj[curVal.label] = preVal.push(curVal)
            return preVal
          }, [])
          this.countryLabelList = arr
          this.draggableList.map(it => {
            it.next.map(item => {
              if (item.result !== null) {
                item.result.map((it, inx) => {
                  if (item.result[inx].country_code === arr[inx].label) {
                    this.$set(item, arr[inx].label, item.result[inx])
                  }
                })
              } else {
                arr.map((it, inx) => {
                  const obj = {
                    country_code: arr[inx].label,
                    id: null,
                    logistics_fee: null,
                    product_price: null,
                    service_price: null,
                    total: null
                  }
                  this.$set(item, arr[inx].label, obj)
                })
              }
            })
            it.pre.map(item => {
              if (item.result !== null) {
                item.result.map((it, inx) => {
                  if (item.result[inx].country_code === arr[inx].label) {
                    this.$set(item, arr[inx].label, item.result[inx])
                  }
                })
              } else {
                arr.map((it, inx) => {
                  const obj = {
                    country_code: arr[inx].label,
                    id: null,
                    logistics_fee: null,
                    product_price: null,
                    service_price: null,
                    total: null
                  }
                  this.$set(item, arr[inx].label, obj)
                })
              }
            })
          })
        }
      })
      getAllProductEdit({ id: this.product_id }).then(res => {
        if (res.code === 200) {
          this.platform_index_id = res.data.platform_index_id
        }
      })
    },
    // Cancellation
    cancellation() {},
    // Determine whether the target node can be placed when dragging
    allowDrop(draggingNode, dropNode, type) {},
    // Adopt
    handleAdopt(row, item) {
      row.someThingAdopt = !row.someThingAdopt
      const list = []
      this.draggableList.map(it => {
        it.next.map(e => {
          list.push(e.someThingAdopt)
        })
      })
      let a = ''
      a = list.find(it => it === true)
      if (a === true) {
        this.someThingAdopt = a
      } else {
        this.someThingAdopt = false
      }
      if (row.someThingAdopt === false) {
        row.check = false
        this.handleChangeCheckbox(row)
      }
    },
    // Dynamically generate random colors
    getColorRender() {
      let c = '#'
      const cArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
      for (let i = 0; i < 6; i++) {
        const cIndex = Math.round(Math.random() * 15)
        c += cArray[cIndex]
      }
      return c
    },
    // Save
    handleSave() {
      if (this.adoptTureList.length === 0) {
        this.$message.warning('Please select at least one piece of data to adopt!')
      } else {
        this.adoptTureList.map(it => {
          this.adoptList.push(...it.value)
        })
        console.log('this.adoptList', this.adoptList)
      }
    },
    // Select to adopt
    handleClickCheckbox(item) {
      item.check = !item.check
    },
    // have a problem
    handleChangeCheckbox(val) {
      if (val.check === true) {
        this.adoptTureList.push({
          key: val.title,
          value: val.next
        })
      } else {
        this.adoptFalseList.push({
          key: val.title,
          value: val.next
        })
      }
      this.adoptFalseList.map((it, inx, arr) => {
        this.adoptTureList.map((value, index, array) => {
          if (value.key === it.key) {
            arr.splice(inx, 1)
            return array.splice(index, 1)
          }
        })
      })
    },
    getValueOfLabel(num, sum) {
      const obj = sum.find(it => it.id === num)
      if (obj) {
        return obj.service_name
      } else {
        return num
      }
    }
  }
}
</script>

<style scoped lang="scss">
.quoted-detail-box {
  margin: 20px!important;
  .btn-box {
    display: flex;
    justify-content: space-between;
  }
  ::v-deep.el-card__body {
    padding: 0;
  }
  .card-innerBox {
    margin: 20px 40px 40px;
  }
  .price-box {
    .title-box {
      display: flex;
      justify-content: left;
      .title {
        width: 25%;
        padding: 5px 10px;
        color: #fff;
        box-sizing: border-box;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .change-style {
      display: flex;
      justify-content: space-between;
      .left {
        flex: 1;
        .title {
          background-color: #ff8d19;
          display: inline-block;
          width: 100%;
        }
      }
      .right {
        flex: 1;
        .title {
          background-color: #ff5733;
          display: inline-block;
          width: 100%;
        }
        .spanOneLine {
          display: inline-block;
          width: 100%;
        }
      }
    }
    ::v-deep.el-table .cell {
      padding: 0;
    }
    ::v-deep.el-table--medium td {
      padding: 0;
    }
  }
}
</style>
