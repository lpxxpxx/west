<template>
  <div class="container">
    <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">{{$t('returnScan')}}</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">{{$t('accordingToTheSKUCheck')}}</tab-item>
      <tab-item :selected="index === 2" @on-item-click="changeIndex(2)">{{$t('accordingToThePalletToCheck')}}</tab-item>
    </tab>
    <div class="tab-swiper" v-show="index === 0">
      <div class="input">
        <scan-input :placeholder="$t('trackingNumberRefNo')" v-model="queryCode"></scan-input>
      </div>
      <!-- <div v-for="(item, index) in taskList" :key="index" class="task-list" @click="goToDetail(item.spoType, item)">
        <div class="task-item">
          <p class="clearfloat">
            <span class="pull-left">{{$t('orderNo')}}：{{item.spoCode}}</span>
            <span class="pull-right">{{$t('type')}}：{{item.spoTypeText}}</span>
          </p>
          <p>{{$t('trakcingNo')}}：{{item.trackingNumber}}</p>
          <p>
            <span class="inline-block" style="vertical-align: top;">SKU*{{$t('theNumber')}}：</span>
            <span class="inline-block">
              <p v-for="(item1, index1) in item.specialOrdersProductList" :key="index1">{{item1.productBarcode}} * {{item1.sopQuantity}}</p>
            </span>
          </p>
        </div>
      </div>
      <div class="task-list task-list-none" v-show="isLoading">
        {{$t('inTheLoad')}}
      </div>
      <div class="task-list task-list-none" v-show="!hasTask">
        {{$t('noDataFound')}}
      </div>
      <div class="button">
        <x-button :gradients="['#1D62F0', '#19D5FD']" @click.native="goToDetail(0, {trakcingNo: queryCode})">{{$t('noMatch')}}</x-button>
      </div> -->
    </div>
    <div class="tab-swiper" v-show="index === 1">
      <div class="search">
        <scan-input :placeholder="$t('scanTheSKUBarCodeHere')" :name="'SKU'" v-model="sku"></scan-input>
      </div>
      <div class="search search-plus" v-show="productBarcode && productBarcode !== sku">
          <span>{{$t('productBarcode')}}：</span>
          <span class="underline name" title="">{{productBarcode}}</span>
      </div>
      <div class="total">
        <span class="pull-left">{{$t('locationNumber')}} <span class="underline">{{skuCount}}</span></span>
        <span class="pull-right">{{$t('total')}} <span class="underline">{{skuAll}}</span></span>
      </div>
      <div class="table">
        <x-table full-bordered>
          <thead>
            <tr>
              <th>{{$t('location')}}</th>
              <th>{{$t('theNumber')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in skuData" :key="index">
              <td>{{item.lcCode}}</td>
              <td>{{item.quantity}}</td>
            </tr>
            <tr v-if="!hassku">
              <td colspan="2">{{$t('noMatchingRecordsWereFound')}}</td>
            </tr>
          </tbody>
        </x-table>
      </div>
    </div>
    <div class="tab-swiper" v-show="index === 2">
      <div class="search">
        <scan-input :placeholder="$t('scanTheTrayNumberHere')" :name="$t('trayNumber')" v-model="tray"></scan-input>
      </div>
      <div class="total">
        <span class="pull-left">{{$t('SKUType')}} <span class="underline">{{trayCount}}</span></span>
        <span class="pull-right">{{$t('total')}} <span class="underline">{{trayAll}}</span></span>
      </div>
      <div class="table">
        <x-table full-bordered>
          <thead>
            <tr>
              <th>SKU</th>
              <th>{{$t('method')}}</th>
              <th>{{$t('status')}}</th>
              <th>{{$t('theNumber')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in trayData" :key="index">
              <td>{{item.productBarcode}}</td>
              <td>{{methodsType[item.requestHandleStatus ? item.requestHandleStatus : '-']}}</td>
              <td>{{getStatus(item.remark, item.status)}}</td>
              <td>{{item.quantity}}</td>
            </tr>
            <tr v-if="!hastray">
              <td colspan="4">{{$t('noMatchingRecordsWereFound')}}</td>
            </tr>
          </tbody>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, Tab, TabItem, XTable } from 'vux'
import qs from 'Qs'

export default {
  name: 'returnManagementTask',
  components: {
    XButton,
    Tab,
    TabItem,
    XTable
  },
  /* mounted () {
    this.search()
  }, */
  data () {
    return {
      taskList: [],
      index: 0,
      queryCode: '',
      total: 0,
      page: 0,
      isLoading: false,
      hasTask: true,
      sku: '',
      productBarcode: '',
      tray: '',
      skuCount: '',
      trayCount: '',
      skuAll: '',
      trayAll: '',
      hassku: false,
      hastray: false,
      skuData: [],
      trayData: [],
      timeoutId: '',
      ws: {
        '0': this.$t('toBeProcessed'),
        '1': this.$t('confirmed'),
        '2': this.$t('completed'),
        '3': this.$t('deleted'),
        '-': '-'
      },
      rco: {
        '0': this.$t('unclaimed'),
        '1': this.$t('claimed'),
        '2': this.$t('completed'),
        '3': this.$t('deleted'),
        '-': '-'
      },
      methodsType: {
        '1': this.$t('shelves'),
        '2': this.$t('destroy'),
        '3': this.$t('temporary'),
        '-': '-'
      }
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    goToDetail (spoType = '', item = {}) {
      this.$store.dispatch('setTemporary', item)
      this.$router.push(`/returnManagement?spoType=${spoType}`)
    },
    getStatus (type = '-', num = '-') {
      if (type === 'ws') {
        return this.ws[num]
      } else if (type === 'rco') {
        return this.rco[num]
      } else {
        return '-'
      }
    },
    scroll () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let clientHeight = document.documentElement.clientHeight
      let scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight > scrollHeight - 20 && this.isLoading === false && this.page * 20 < this.total) {
        this.search()
        this.isLoading = true
      }
    },
    search () {
      if (this.queryCode.length === 34) {
        /* FEDEX  条码扫出来的长度是34，系统长度是12 */
        this.queryCode = this.queryCode.substring(this.queryCode.length - 12)
        return false
      } else if (this.queryCode.length === 30) {
        /* FEDEX_SMARTPOST  条码扫出来的长度是30，系统长度是20 */
        this.queryCode = this.queryCode.substring(this.queryCode.length - 20)
        return false
      } else if (this.queryCode.length === 28) {
        /* 欧洲DPD渠道 扫码长度为28  %WS151LX15501804030530812826  系统长度为14   15501804030530 */
        this.queryCode = this.queryCode.substring(8, 22)
        return false
      }
      let params = {
        pageNumber: ++this.page,
        limit: 20,
        queryCode: this.queryCode,
        warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId
      }
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/returnOrder/returnOrdersSearch`, qs.stringify(params), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this.isLoading = false
        /* if (res.data.rows.length === 0 && this.taskList.length === 0) {
          this.hasTask = false
        } else {
          this.taskList = this.taskList.concat(res.data.rows)
          this.total = res.data.total
          this.hasTask = true
        } */
        if (res.data.rows.length === 1) {
          this.goToDetail(res.data.rows[0].spoType, res.data.rows[0])
        } else if (res.data.rows.length === 0) {
          this.goToDetail(0, {trackingNumber: this.queryCode})
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('pleaseEnterTheCompleteNo')
          })
        }
      })
      .catch(res => {
        this.isLoading = false
        this.page--
        alert(JSON.stringify(res))
      })
    },
    searchTable (type) {
      let queryCode = this[type]
      let query = {}
      if (type === 'sku') {
        query.productSku = queryCode.replace(/(^\s*)|(\s*$)/g, '')
      } else {
        query.trayCode = queryCode.replace(/(^\s*)|(\s*$)/g, '')
      }
      if (!queryCode) {
        this[`${type}Data`] = []
        this[`${type}Count`] = 0
        this[`${type}All`] = 0
        this.productBarcode = ''
        return false
      }
      /* this.axios.get(`${this.$store.getters.getUrl}/weixinapi/returnOrder/returnOrdersListSearchBySku`, {
        params: query
      }) */
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/returnOrder/returnOrdersListSearchBySku`, qs.stringify(query), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this[`${type}Data`] = []
        this[`${type}Count`] = 0
        this[`${type}All`] = 0
        this.productBarcode = ''
        if (res.data.success) {
          let that = this
          setTimeout(function () {
            let all = 0
            that[`${type}Data`] = res.data.data
            that[`${type}Count`] = [...new Set(res.data.data.map(item => type === 'sku' ? item.lcCode : item.productBarcode))].length
            res.data.data.forEach(item => {
              all += item.quantity
            })
            that[`${type}All`] = all
            if (res.data.data.length === 0) {
              that[`has${type}`] = false
            } else {
              that[`has${type}`] = true
              that.productBarcode = type === 'sku' ? res.data.data[0].productBarcode : ''
            }
          }, 10)
        }
      })
      .catch(res => {
        alert(this.$t('businessSystemException'))
      })
    },
    toSearch (type) {
      let that = this
      clearTimeout(that.timeoutId)
      that.timeoutId = setTimeout(function () {
        if (type) {
          that.searchTable(type)
        } else {
          that.page = 0
          that.taskList = []
          that.search()
        }
      }, 1000)
    }
  },
  watch: {
    queryCode () {
      if (this.queryCode.length >= 12) this.toSearch('')
    },
    sku () {
      this.toSearch('sku')
    },
    tray () {
      this.toSearch('tray')
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    margin-bottom: 7rem;
  }
  .search {
    padding: 1.5rem 1rem;
  }
  .search-plus {
    padding: 0 1rem;
    margin-top: -1rem;
  }
  .total {
    padding: 0rem 1rem 1.5rem;
  }
  .table {
    padding: 1rem;
  }
  .task-list{
    display: flex;
    font-size: 1rem;
    border-bottom: 1px solid #999;
    color: #333;
    padding: 0.7rem 1rem;
    font-size: 0.8rem;
  }
  .task-list-none {
    display: inherit;
    text-align: center;
  }
  .task-item {
    width: 100%;
  }
  .button {
    position: fixed;
    padding: 1rem 1rem;
    bottom: 3rem;
    width: 100%;
    box-sizing: border-box;
    background: #fbf9fe;
  }
</style>
