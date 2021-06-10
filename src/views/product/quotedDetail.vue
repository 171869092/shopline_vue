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
            <el-input v-model="formData.title" placeholder="Title" />
          </el-form-item>
          <el-form-item label="Source URL" prop="url">
            <el-input v-model="formData.url" placeholder="Title" />
          </el-form-item>
        </div>
      </el-card>
      <el-card class="m20 mt0">
        <h5 class="mt20 ml40">Media</h5>
        <el-divider />
        <div class="card-innerBox">
          <el-form-item label="">
            <span v-for="(it, key) in formData.image" :key="key" class="mr30">
              <el-image :src="it" style="height: 180px;width: 200px" />
            </span>
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
                <span style="margin: 0 20px">{{ item.title }}</span>
                <span>{{ item.time }}</span>
              </div>
              <div v-if="item.oldTableData.length > 0" class="title" :style="{'background-color': item.newData ? '#ccc' : item.titleStyle}" @click="item.newData = false">
                <span style="margin: 0 20px">{{ item.title }}</span>
                <span>{{ item.time }}</span>
              </div>
            </div>
            <el-table
              v-if="item.newData"
              ref="multipleTable"
              :data="item.newTableData"
              style="width: 100%"
              highlight-current-row
              fit
              border
              :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
            >
              <el-table-column label="Serial" prop="serial">
                <template slot-scope="scope">
                  <span v-if="item.someThingAdopt">
                    <el-checkbox v-model="item.check" @click="handleClickCheckbox(item)" @change="handleChangeCheckbox(item.check ? scope : scope.$index)" />
                  </span>
                  <span v-if="!item.someThingAdopt">{{ scope.row.serial }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Picture" prop="picture">
                <template slot-scope="scope">
                  <el-image class="sku_image" style="width: 50px; height: 50px" :src="scope.row.picture" fit="cover">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" style="font-size: 30px;" />
                    </div>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column label="Color" prop="color" />
              <el-table-column label="Color1" prop="color1" />
              <el-table-column :label="'FR_('+ '~' + 'days)'" prop="fr" :min-width="isTotal ? '300px' : ''">
                <template slot-scope="scope">
                  <span v-if="!isTotal">{{ scope.row.fr }}</span>
                  <span v-if="isTotal" class="change-style">
                    <span class="left">
                      <span class="title">Total</span>
                      <span>{{ scope.row.frTotal }}</span>
                    </span>
                    <span class="right">
                      <span class="title">Details</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Product: </span>{{ scope.row.frDetailP }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Service: </span>{{ scope.row.frDetailS }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Logistics: </span>{{ scope.row.frDetailL }}</span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="'UK_('+ '~' + 'days)'" prop="uk" :min-width="isTotal ? '300px' : ''">
                <template slot-scope="scope">
                  <span v-if="!isTotal">{{ scope.row.uk }}</span>
                  <span v-if="isTotal" class="change-style">
                    <span class="left">
                      <span class="title">Total</span>
                      <span>{{ scope.row.frTotal }}</span>
                    </span>
                    <span class="right">
                      <span class="title">Details</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Product: </span>{{ scope.row.frDetailP }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Service: </span>{{ scope.row.frDetailS }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Logistics: </span>{{ scope.row.frDetailL }}</span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="'US_('+ '~' + 'days)'" prop="us" :min-width="isTotal ? '300px' : ''">
                <template slot-scope="scope">
                  <span v-if="!isTotal">{{ scope.row.us }}</span>
                  <span v-if="isTotal" class="change-style">
                    <span class="left">
                      <span class="title">Total</span>
                      <span>{{ scope.row.frTotal }}</span>
                    </span>
                    <span class="right">
                      <span class="title">Details</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Product: </span>{{ scope.row.frDetailP }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Service: </span>{{ scope.row.frDetailS }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Logistics: </span>{{ scope.row.frDetailL }}</span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="'AU_('+ '~' + 'days)'" prop="au" :min-width="isTotal ? '300px' : ''">
                <template slot-scope="scope">
                  <span v-if="!isTotal">{{ scope.row.au }}</span>
                  <span v-if="isTotal" class="change-style">
                    <span class="left">
                      <span class="title">Total</span>
                      <span>{{ scope.row.frTotal }}</span>
                    </span>
                    <span class="right">
                      <span class="title">Details</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Product: </span>{{ scope.row.frDetailP }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Service: </span>{{ scope.row.frDetailS }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Logistics: </span>{{ scope.row.frDetailL }}</span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="'CA_('+ '~' + 'days)'" prop="ca" :min-width="isTotal ? '300px' : ''">
                <template slot-scope="scope">
                  <span v-if="!isTotal">{{ scope.row.ca }}</span>
                  <span v-if="isTotal" class="change-style">
                    <span class="left">
                      <span class="title">Total</span>
                      <span>{{ scope.row.frTotal }}</span>
                    </span>
                    <span class="right">
                      <span class="title">Details</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Product: </span>{{ scope.row.frDetailP }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Service: </span>{{ scope.row.frDetailS }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Logistics: </span>{{ scope.row.frDetailL }}</span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="Operation">
                <template slot-scope="scope">
                  <span style="color: #ef6f38; cursor: pointer" @click="handleAdopt(scope, item)">Adopt</span>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-if="item.oldTableData.length > 0 && !item.newData"
              ref="multipleTable"
              :data="item.oldTableData"
              style="width: 100%"
              highlight-current-row
              fit
              border
              :header-cell-style="{background: '#F3F5F9',color:'#262B3EFF'}"
            >
              <el-table-column label="Serial" prop="serial" />
              <el-table-column label="Picture" prop="picture">
                <template slot-scope="scope">
                  <el-image class="sku_image" style="width: 50px; height: 50px" :src="scope.row.picture" fit="cover">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" style="font-size: 30px;" />
                    </div>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column label="Color" prop="color" />
              <el-table-column label="Color1" prop="color1" />
              <el-table-column :label="'FR_('+ '~' + 'days)'" prop="fr" :min-width="isTotal ? '300px' : ''">
                <template slot-scope="scope">
                  <span v-if="!isTotal">{{ scope.row.fr }}</span>
                  <span v-if="isTotal" class="change-style">
                    <span class="left">
                      <span class="title">Total</span>
                      <span>{{ scope.row.frTotal }}</span>
                    </span>
                    <span class="right">
                      <span class="title">Details</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Product: </span>{{ scope.row.frDetailP }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Service: </span>{{ scope.row.frDetailS }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Logistics: </span>{{ scope.row.frDetailL }}</span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="'UK_('+ '~' + 'days)'" prop="uk" :min-width="isTotal ? '300px' : ''">
                <template slot-scope="scope">
                  <span v-if="!isTotal">{{ scope.row.uk }}</span>
                  <span v-if="isTotal" class="change-style">
                    <span class="left">
                      <span class="title">Total</span>
                      <span>{{ scope.row.frTotal }}</span>
                    </span>
                    <span class="right">
                      <span class="title">Details</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Product: </span>{{ scope.row.frDetailP }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Service: </span>{{ scope.row.frDetailS }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Logistics: </span>{{ scope.row.frDetailL }}</span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="'US_('+ '~' + 'days)'" prop="us" :min-width="isTotal ? '300px' : ''">
                <template slot-scope="scope">
                  <span v-if="!isTotal">{{ scope.row.us }}</span>
                  <span v-if="isTotal" class="change-style">
                    <span class="left">
                      <span class="title">Total</span>
                      <span>{{ scope.row.frTotal }}</span>
                    </span>
                    <span class="right">
                      <span class="title">Details</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Product: </span>{{ scope.row.frDetailP }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Service: </span>{{ scope.row.frDetailS }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Logistics: </span>{{ scope.row.frDetailL }}</span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="'AU_('+ '~' + 'days)'" prop="au" :min-width="isTotal ? '300px' : ''">
                <template slot-scope="scope">
                  <span v-if="!isTotal">{{ scope.row.au }}</span>
                  <span v-if="isTotal" class="change-style">
                    <span class="left">
                      <span class="title">Total</span>
                      <span>{{ scope.row.frTotal }}</span>
                    </span>
                    <span class="right">
                      <span class="title">Details</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Product: </span>{{ scope.row.frDetailP }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Service: </span>{{ scope.row.frDetailS }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Logistics: </span>{{ scope.row.frDetailL }}</span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="'CA_('+ '~' + 'days)'" prop="ca" :min-width="isTotal ? '300px' : ''">
                <template slot-scope="scope">
                  <span v-if="!isTotal">{{ scope.row.ca }}</span>
                  <span v-if="isTotal" class="change-style">
                    <span class="left">
                      <span class="title">Total</span>
                      <span>{{ scope.row.frTotal }}</span>
                    </span>
                    <span class="right">
                      <span class="title">Details</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Product: </span>{{ scope.row.frDetailP }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Service: </span>{{ scope.row.frDetailS }}</span>
                      <span class="spanOneLine"><span style="font-weight: 600">Logistics: </span>{{ scope.row.frDetailL }}</span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="Operation">
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
export default {
  name: 'quoted-detail',
  components: {
    draggable
  },
  data() {
    return {
      formData: {
        title: 'With Box luxury brand sunglasses women sun glasses mens sunglasses vintage brand designer Fashion Cat Eye sunglasses womens',
        url: 'https://fbali.co/storeProduct/productDetails?type=edit&id=11663&storeType=store&platform=1',
        image: ['https://ae01.alicdn.com/kf/H3db85a897ef148c5a6c1447d31515e34K/With-Box-luxury-brand-sunglasses-women-sun-glasses-mens-sunglasses-vintage-brand-designer-Fashion-Cat-Eye.jpg', 'https://ae01.alicdn.com/kf/H3db85a897ef148c5a6c1447d31515e34K/With-Box-luxury-brand-sunglasses-women-sun-glasses-mens-sunglasses-vintage-brand-designer-Fashion-Cat-Eye.jpg', 'https://ae01.alicdn.com/kf/H3db85a897ef148c5a6c1447d31515e34K/With-Box-luxury-brand-sunglasses-women-sun-glasses-mens-sunglasses-vintage-brand-designer-Fashion-Cat-Eye.jpg'],
        temporary: {
          'live-by-test': {
            time: '2020-02-05 15:15:15',
            newTableData: [
              {
                serial: '1',
                picture: 'https://ae01.alicdn.com/kf/H3db85a897ef148c5a6c1447d31515e34K/With-Box-luxury-brand-sunglasses-women-sun-glasses-mens-sunglasses-vintage-brand-designer-Fashion-Cat-Eye.jpg',
                color: 'red',
                color1: 'red1',
                fr: '$ 4.21',
                uk: '$ 4.21',
                us: '$ 4.21',
                au: '$ 4.21',
                ca: '$ 4.21',
                frTotal: '$ 55554.21',
                frDetailP: '2222.21',
                frDetailS: '2222.21',
                frDetailL: '2222.21'
              }
            ],
            oldTableData: [
              {
                serial: '1',
                picture: 'https://ae01.alicdn.com/kf/H3db85a897ef148c5a6c1447d31515e34K/With-Box-luxury-brand-sunglasses-women-sun-glasses-mens-sunglasses-vintage-brand-designer-Fashion-Cat-Eye.jpg',
                color: 'black',
                color1: 'black1',
                fr: '$ 110.21',
                uk: '$ 110.21',
                us: '$ 110.21',
                au: '$ 110.21',
                ca: '$ 110.21',
                frTotal: '$ 54.21',
                frDetailP: '2.21',
                frDetailS: '2.21',
                frDetailL: '22.21'
              }
            ]
          },
          'live-by-testing': {
            time: '2020-02-05 15:15:15',
            newTableData: [
              {
                serial: '1',
                picture: 'https://ae01.alicdn.com/kf/H3db85a897ef148c5a6c1447d31515e34K/With-Box-luxury-brand-sunglasses-women-sun-glasses-mens-sunglasses-vintage-brand-designer-Fashion-Cat-Eye.jpg',
                color: 'red',
                color1: 'red1',
                fr: '$ 4.21',
                uk: '$ 4.21',
                us: '$ 4.21',
                au: '$ 4.21',
                ca: '$ 4.21',
                frTotal: '$ 55554.21',
                frDetailP: '2222.21',
                frDetailS: '2222.21',
                frDetailL: '2222.21'
              }
            ],
            oldTableData: []
          },
          'deguisement-mania': {
            time: '2020-02-05 15:15:15',
            newTableData: [
              {
                serial: '1',
                picture: 'https://ae01.alicdn.com/kf/H3db85a897ef148c5a6c1447d31515e34K/With-Box-luxury-brand-sunglasses-women-sun-glasses-mens-sunglasses-vintage-brand-designer-Fashion-Cat-Eye.jpg',
                color: 'red',
                color1: 'red1',
                fr: '/',
                uk: '/',
                us: '/',
                au: '/',
                ca: '/',
                frTotal: '/',
                frDetailP: '/',
                frDetailS: '/',
                frDetailL: '/'
              }
            ],
            oldTableData: []
          }
        }
      },
      formDataRules: {},
      isTotal: false,
      someThingAdopt: false,
      adoptList: [],
      draggableList: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      for (const key in this.formData.temporary) {
        this.$set(this.formData.temporary[key], 'newData', true)
        this.$set(this.formData.temporary[key], 'title', key)
        this.$set(this.formData.temporary[key], 'titleStyle', this.getColorRender())
        this.$set(this.formData.temporary[key], 'check', false)
        this.$set(this.formData.temporary[key], 'someThingAdopt', false)
        this.draggableList.push(this.formData.temporary[key])
      }
      console.log('this.draggableList', this.draggableList)
    },
    // Cancellation
    cancellation() {},
    // Determine whether the target node can be placed when dragging
    allowDrop(draggingNode, dropNode, type) {},
    // Adopt
    handleAdopt(scope, item) {
      item.someThingAdopt = !item.someThingAdopt
      const list = []
      for (const key in this.formData.temporary) {
        list.push(this.formData.temporary[key].someThingAdopt)
      }
      let a = ''
      a = list.find(it => it === true)
      if (a === true) {
        this.someThingAdopt = a
      } else {
        this.someThingAdopt = false
      }
      if (item.someThingAdopt === false) {
        item.check = false
        this.handleChangeCheckbox(scope.$index)
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
      if (this.adoptList.length === 0) {
        this.$message.warning('Please select at least one piece of data to adopt!')
      } else {
        this.adoptList = [...new Set(this.adoptList)]
        console.log('this.adoptList', this.adoptList)
      }
    },
    // Select to adopt
    handleClickCheckbox(item) {
      item.check = !item.check
    },
    // have a problem
    handleChangeCheckbox(scope) {
      const re = /^[0-9]+.?[0-9]*/
      if (!re.test(scope)) {
        this.adoptList.push(scope.row)
      } else {
        console.log('arr11', this.adoptList)
        console.log('scope', scope)
        this.adoptList = this.adoptList.splice(scope, 1)
        console.log('arr', this.adoptList)
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
