<template>
  <div v-loading="loading" class="message-list-box">
    <div class="message-list-title">
      <el-button size="small" :type="isSystem ? 'primary' : ''" class="w-300" @click="handleSystem">System Message</el-button>
      <el-button size="small" :type="isSystem ? '' : 'primary'" class="w-300" style="margin-left: 0" @click="handleVendor">Vendor Message</el-button>
    </div>
    <div class="message-list-main">
      <div v-if="messageList.length > 0">
        <div v-for="(item, index) in messageList" :key="index" class="message-main-box">
          <div class="message-inner">
            <h4 class="pointer" @click="$router.push({ name: 'messages-detail', query: { type: mapStatus[item.type] }})">{{ mapStatus[item.type] }}</h4>
            <p>
              <span>
                <span class="mr40">{{ item.msg_json.chinese_title }}</span>
                <span class="mr40">{{ item.msg_json.english_title }}</span>
                <el-button v-if="item.type !== 1" type="text" @click="handleToDetails(item)">View{{ mapStatus[item.type] }}</el-button>
              </span>
              <span class="right">{{ item.create_time }}</span>
            </p>
          </div>
          <el-divider/>
        </div>
      </div>
      <div v-if="messageList.length === 0" class="no-data-message">
        <div>
          <el-image :src="noData" style="width: 100px"/>
        </div>
        <span>No news notification</span>
      </div>
      <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="Inquire" />
    </div>
  </div>
</template>

<script>
import { getMapStatus, getList } from '@/api/notice'
import { getCookies } from '@/utils/cookies'

export default {
  name: 'list',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  data() {
    return {
      noData: require('@/assets/home/noData.png'),
      isSystem: true,
      loading: false,
      mapStatus: {},
      listQuery: {
        total: 0,
        page: 0,
        limit: 10
      },
      formQuery: {
        iDisplayStart: 0,
        iDisplayLength: 10
      },
      messageList: [],
      type: [1, 3, 4]
    }
  },
  created() {
    this.init()
    this.Inquire()
  },
  methods: {
    Inquire() {
      this.loading = true
      this.formQuery.iDisplayLength = this.listQuery.limit
      this.formQuery.iDisplayStart = (this.listQuery.page - 1) * this.listQuery.limit
      this.$set(this.formQuery, 'type', this.type)
      getList(this.formQuery).then(res => {
        if (res.code === 200) {
          this.messageList = res.data
          this.listQuery.total = +res.total
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(() => {
        this.loading = false
      })
    },
    handleSystem() {
      this.isSystem = true
      this.type = [1, 3, 4]
      this.Inquire()
    },
    handleVendor() {
      this.isSystem = false
      this.type = [2, 5, 6]
      this.Inquire()
    },
    init() {
      getMapStatus().then(res => {
        if (res.code === 200) {
          this.mapStatus = res.data
        }
      })
    },
    handleToDetails(val) {
      switch (val.type) {
        case 2: // Product
          this.$router.push({ name: 'productDetails', query: { type: 'edit', id: val.id, stroeType: 'all' }})
          break
        case 3: // Order
          this.$router.push({ name: 'orders-detail', query: { order_id: val.id, order_no: val.order_name, platForm: this.platForm }})
          break
        case 4: // AfterSale
          this.$router.push({ name: 'after-detail', query: { type: 'edit', id: val.id, order_no: val.order_name }})
          break
        case 5: // Quoted
          this.$router.push({ name: 'quoted-detail', query: { type: 'edit', id: val.id, product_id: val.product_id, storeList: getCookies('storeList') }})
          break
        case 6: // Bill
          this.$router.push({ name: 'bill-detail', query: { bill_id: val.id }})
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.message-list-box {
  padding: 30px;
 .message-list-title {
   margin-bottom: 30px;
 }
 .message-list-main {
   overflow: hidden;
   min-height: 80vh;
   background-color: #fff;
   padding: 20px 0;
   ::v-deep.el-divider--horizontal {
     margin: 20px 0;
   }
   .message-inner {
     padding: 0 20px;
     p {
       display: flex;
       justify-content: space-between;
       .right {
         color: #666;
       }
     }
   }
   .no-data-message {
     min-height: 70vh;
     text-align: center;
     padding: 30px;
     color: #e76c39;
   }
 }
}
</style>
