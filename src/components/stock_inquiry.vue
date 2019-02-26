<template>
  <div class="container">
    <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">按SKU查</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">按库位查</tab-item>
    </tab>
    <div class="tab-swiper" v-show="index === 0">
      <div class="search">
        <scan-input :placeholder="'此处扫描SKU条码'" :name="'SKU'" v-model="sku"></scan-input>
      </div>
      <div class="total">
        <span class="pull-left">库位数 <span class="underline">{{skuCount}}</span></span>
        <span class="pull-right">总计 <span class="underline">{{skuAll}}</span></span>
      </div>
      <div class="table">
        <x-table full-bordered>
          <thead>
            <tr>
              <th>库位</th>
              <th>可用</th>
              <th>待出库</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in skuData" :key="index">
              <td>{{item.lcCode}}</td>
              <td v-once>{{item.piSellable}}</td>
              <td v-once>{{item.piReserved}}</td>
            </tr>
            <tr v-if="!hassku">
              <td colspan="3">没有找到匹配的记录</td>
            </tr>
          </tbody>
        </x-table>
      </div>
      <div class="button">
        <x-button :gradients="['#1D62F0', '#19D5FD']" @click.native="goToDetail(sku, '')" v-show="skuButtonShow">调库存</x-button>
      </div>
    </div>
    <div class="tab-swiper" v-show="index === 1">
      <div class="search">
        <scan-input :placeholder="'此处扫描库位条码'" :name="'库位'" v-model="lcCode"></scan-input>
      </div>
      <div class="total">
        <span class="pull-left">SKU种类 <span class="underline">{{lcCodeCount}}</span></span>
        <span class="pull-right">总计 <span class="underline">{{lcCodeAll}}</span></span>
      </div>
      <div class="table">
        <x-table full-bordered>
          <thead>
            <tr>
              <th>SKU</th>
              <th>可用</th>
              <th>待出库</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in lcCodeData" :key="index">
              <td>{{item.productBarcode}}</td>
              <td>{{item.piSellable}}</td>
              <td>{{item.piReserved}}</td>
            </tr>
            <tr v-if="!haslcCode">
              <td colspan="3">没有找到匹配的记录</td>
            </tr>
          </tbody>
        </x-table>
      </div>
      <div class="button">
        <x-button :gradients="['#1D62F0', '#19D5FD']" @click.native="goToDetail('', lcCode)" v-show="lcCodeButtonShow">调库存</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XTable, XButton } from 'vux'
import ScanInput from './scan_input'

export default {
  name: 'stockInquiry',
  components: {
    Tab,
    TabItem,
    XTable,
    XButton,
    ScanInput
  },
  data () {
    return {
      index: 0,
      sku: '',
      lcCode: '',
      skuCount: '',
      lcCodeCount: '',
      skuAll: '',
      lcCodeAll: '',
      hassku: false,
      haslcCode: false,
      timeoutId: '',
      skuData: [],
      lcCodeData: [],
      skuButtonShow: false,
      lcCodeButtonShow: false
    }
  },
  methods: {
    changeIndex (val) {
      this.index = val
    },
    goToDetail (productBarcode, lcCode) {
      this.$router.push(`/inventoryAdjustment?productBarcode=${productBarcode}&lcCode=${lcCode}`)
    },
    blurInput () {
      document.querySelectorAll('input')[`${this.index}`].blur()
    },
    search (type) {
      if (this.$store.getters.getWarehouse.warehouseId === undefined) {
        this.$router.push('/')
        return false
      }
      let queryCode = type === 'sku' ? this.sku : this.lcCode
      if (!queryCode) {
        this[`${type}Data`] = []
        this[`${type}Count`] = 0
        this[`${type}All`] = 0
        this[`${type}ButtonShow`] = false
        return false
      }
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/inventory/inventorySearch`, {
        params: {
          codeType: type,
          warehouseId: this.$store.getters.getWarehouse.warehouseId,
          queryCode: queryCode
        }
      })
      .then(res => {
        if (res.data.success) {
          let all = 0
          this[`${type}Data`] = res.data.data.rows
          this[`${type}Count`] = [...new Set(res.data.data.rows.map(item => type === 'sku' ? item.lcCode : item.productBarcode))].length
          res.data.data.rows.forEach(item => {
            all += item.piSellable
          })
          this[`${type}All`] = all
          if (res.data.data.rows.length === 0) {
            this[`has${type}`] = false
          } else {
            this[`has${type}`] = true
          }
          this.blurInput()
          this[`${type}ButtonShow`] = true
        } else {
          this[`${type}Data`] = []
          this[`${type}Count`] = 0
          this[`${type}All`] = 0
          this[`${type}ButtonShow`] = false
        }
      })
      .catch(res => {
        alert('业务系统异常！')
      })
    },
    toSearch (type) {
      let that = this
      clearTimeout(that.timeoutId)
      that.timeoutId = setTimeout(function () {
        that.search(type)
      }, 1000)
    }
  },
  watch: {
    lcCode () {
      this.toSearch('lcCode')
    },
    sku () {
      this.toSearch('sku')
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
  .total {
    padding: 0rem 1rem 1.5rem;
  }
  .table {
    padding: 1rem;
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
