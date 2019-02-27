<template>
  <div class="container adjustment">
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
      <div class="button" v-show="skuButtonShow">
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
            <tr v-for="(item, index) in lcCodeDataNew" :key="index">
              <td><i class="iconfont icon-minus-circle-fill" @click="deleteDataNew('lcCode', index)"></i><scan-input :placeholder="'此处扫描SKU条码'" v-model="item.productBarcode"></scan-input></td>
              <td>{{item.piSellableOld}}</td>
              <td><input type="number" placeholder="0" value="25" v-model="item.piSellable" /></td>
            </tr>
            <tr v-if="!haslcCode && lcCodeDataNew.length === 0">
              <td colspan="3">没有找到匹配的记录</td>
            </tr>
          </tbody>
        </x-table>
        <x-button v-show="lcCodeButtonShow" :gradients="['#169bd5', '#169bd5']" @click.native="addSku('lcCode')"><i class="iconfont icon-jiajianzujianjiahao"></i></x-button>
      </div>
      <div class="button" v-show="lcCodeButtonShow">
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
    if (this.sku) {
      this.searchDetail('sku')
    } else if (this.lcCode) {
      this.searchDetail('lcCode')
    }
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
      lcCodeDataNew: [],
      oldskuData: [],
      oldlcCodeData: [],
      skuButtonShow: false,
      lcCodeButtonShow: false
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    reset (type) {
      this[`${type}Data`] = JSON.parse(JSON.stringify(this[`old${type}Data`]))
      this[`${type}DataNew`] = []
    },
    blurInput () {
      document.querySelectorAll('.search input')[`${this.index}`].blur()
    },
    clearData (type) {
      this[`${type}Data`] = []
      this[`${type}DataNew`] = []
      this[`${type}Count`] = ''
      this[`${type}All`] = ''
      this[`has${type}`] = false
      this[`${type}ButtonShow`] = false
    },
    addSku (type) {
      if (this[`${type}DataNew`].length >= 5) {
        this.$vux.toast.show({
          type: 'text',
          text: '一次最多新增5条SKU'
        })
        return false
      }
      let data = {
        productBarcode: '',
        piSellable: 0,
        piSellableOld: 0,
        isNewSku: true,
        warehouseId: this.$store.getters.getWarehouse.warehouseId,
        lcCode: this[`${type}`]
      }
      this[`${type}DataNew`].push(data)
    },
    deleteDataNew (type, index) {
      this[`${type}DataNew`].splice(index, 1)
    },
    searchDetail (type) {
      let queryCode = type === 'sku' ? this.sku : this.lcCode
      if (!queryCode) {
        this.clearData(type)
        return false
      }
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/inventory/inventoryAdjustmentSearch`, {
        params: {
          codeType: type,
          warehouseId: this.$store.getters.getWarehouse.warehouseId,
          queryCode: queryCode
        }
      })
      .then(res => {
        this.clearData(type)
        if (res.data.success) {
          let all = 0
          res.data.data.map(item => {
            all += item.piSellable
            item.piSellableOld = item.piSellable
            return item
          })
          this[`${type}Data`] = res.data.data
          this[`old${type}Data`] = JSON.parse(JSON.stringify(res.data.data))
          this[`${type}Count`] = [...new Set(res.data.data.map(item => type === 'sku' ? item.lcCode : item.productBarcode))].length
          this[`${type}All`] = all
          if (res.data.data.length === 0) {
            this[`has${type}`] = false
          } else {
            this[`has${type}`] = true
          }
          this.blurInput()
          this[`${type}ButtonShow`] = true
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
      let regZero = /^([1-9]\d*|[0]{1,1})$/
      let reg = /^[1-9]\d{0,4}$/
      for (let i = 0; i < this[`${type}Data`].length; i++) {
        if (!regZero.test(Number(this[`${type}Data`][i].piSellable))) {
          this.$vux.toast.show({
            type: 'text',
            text: `SKU ${this[`${type}Data`][i].productBarcode} 数量输入有误`
          })
          return false
        }
        let quantity = this[`${type}Data`][i].piSellable - this[`${type}Data`][i].piSellableOld
        if (quantity !== 0) {
          this[`${type}Data`][i].quantity = quantity
          this[`${type}Data`][i].warehouseId = this.$store.getters.getWarehouse.warehouseId
          submitData.push(this[`${type}Data`][i])
        }
      }
      if (type === 'lcCode') {
        if (this.lcCodeDataNew.length > 0) {
          let skuList = this.lcCodeData.map(item => item.productBarcode)
          let flag = false
          this.lcCodeDataNew.forEach((item, index) => {
            if (skuList.indexOf(item.productBarcode) !== -1) {
              this.$vux.toast.show({
                type: 'text',
                text: `${item.productBarcode}已存在`
              })
              flag = true
              return false
            }
            if (!reg.test(item.piSellable) || Number(item.piSellable) === 0) {
              this.$vux.toast.show({
                type: 'text',
                text: `SKU ${item.productBarcode} 请输入正确的库存数量`
              })
              flag = true
              return false
            }
          })
          if (flag) {
            return false
          }
          submitData = [...submitData, ...this.lcCodeDataNew]
        }
      }
      if (submitData.length === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: '无更改'
        })
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
          this.clearData(type)
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.data.message
          })
        }
      })
      .catch(res => {
        this.$vux.loading.hide()
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
    button {
      margin-top: 1rem;
      width: 3rem;
      float: right;
      height: 2rem;
      line-height: 2rem;
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