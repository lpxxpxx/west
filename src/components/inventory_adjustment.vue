<template>
  <div class="container">
    <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">按SKU调</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">按库位调</tab-item>
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
              <th>库存数</th>
              <th>调整为</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in skuData" :key="index">
              <td>{{item.lcCode}}</td>
              <td>{{item.piSellableOld}}</td>
              <td><input type="number" placeholder="0" value="25" v-model="item.piSellable" /></td>
            </tr>
            <tr v-if="!hassku">
              <td colspan="3">没有找到匹配的记录</td>
            </tr>
          </tbody>
        </x-table>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('sku')">重置</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native="submit('sku')">确认</x-button>
          </flexbox-item>
        </flexbox>
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
              <th>库存数</th>
              <th>调整为</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in lcCodeData" :key="index">
              <td>{{item.productBarcode}}</td>
              <td>{{item.piSellableOld}}</td>
              <td><input type="number" placeholder="0" value="25" v-model="item.piSellable" /></td>
            </tr>
            <tr v-if="!haslcCode">
              <td colspan="3">没有找到匹配的记录</td>
            </tr>
          </tbody>
        </x-table>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('lcCode')">重置</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native="submit('lcCode')">确认</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XTable, XButton, Flexbox, FlexboxItem } from 'vux'
import qs from 'Qs'

export default {
  name: 'inventoryAdjustment',
  components: {
    Tab,
    TabItem,
    XTable,
    XButton,
    Flexbox,
    FlexboxItem
  },
  mounted () {
    let query = this.$route.query || {}
    this.sku = query.productBarcode
    this.lcCode = query.lcCode
    this.index = this.lcCode ? 1 : 0
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
      oldskuData: [],
      oldlcCodeData: []
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    reset (type) {
      this[`${type}Data`] = JSON.parse(JSON.stringify(this[`old${type}Data`]))
    },
    searchDetail (type) {
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/inventory/inventoryAdjustmentSearch`, {
        params: {
          codeType: type,
          warehouseId: this.$store.getters.getWarehouse.warehouseId,
          queryCode: type === 'sku' ? this.sku : this.lcCode
        }
      })
      .then(res => {
        let all = 0
        res.data.rows.map(item => {
          all += item.piSellable
          item.piSellableOld = item.piSellable
          return item
        })
        this[`${type}Data`] = res.data.rows
        this[`old${type}Data`] = JSON.parse(JSON.stringify(res.data.rows))
        this[`${type}Count`] = [...new Set(res.data.rows.map(item => type === 'sku' ? item.lcCode : item.productBarcode))].length
        this[`${type}All`] = all
        if (res.data.rows.length === 0) {
          this[`has${type}`] = false
        } else {
          this[`has${type}`] = true
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
        that.searchDetail(type)
      }, 1000)
    },
    submit (type) {
      let submitData = []
      for (let i = 0; i < this[`${type}Data`].length; i++) {
        let quantity = this[`${type}Data`][i].piSellable - this[`${type}Data`][i].piSellableOld
        if (quantity !== 0) {
          this[`${type}Data`][i].quantity = quantity
          this[`${type}Data`][i].warehouseId = this.$store.getters.getWarehouse.warehouseId
          submitData.push(this[`${type}Data`][i])
        }
      }
      if (submitData.length === 0) {
        alert(`无更改`)
        return false
      }
      this.$vux.loading.show({
        text: 'Loading'
      })
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/inventory/inventoryAdjustment`, qs.stringify({receivedManageVo: JSON.stringify(submitData)}), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this.$vux.loading.hide()
        if (res.data.success) {
          this.$vux.toast.show({
            type: 'text',
            text: '操作成功'
          })
          this.searchDetail(this.index === 0 ? 'sku' : 'lcCode')
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.data.message
          })
        }
      })
      .catch(res => {
        alert('业务系统异常！')
      })
    }
  },
  watch: {
    sku () {
      this.toSearch('sku')
    },
    lcCode () {
      this.toSearch('lcCode')
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
    height: 3rem;
    line-height: 3rem;
    display: flex;
    .label {
      margin-right: 1rem;
      font-size: 1.5rem;
    }
    input {
      flex: 1;
    }
  }
  .total {
    padding: 0rem 1rem 1.5rem;
  }
  .table {
    padding: 1rem;
    input {
      width: 3rem;
      font-size: 1rem;
      text-align: center;
    }
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
