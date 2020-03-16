<template>
  <div class="container adjustment">
    <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">{{$t('pressSKU')}}</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">{{$t('adjustByDtoragePosition')}}</tab-item>
    </tab>
    <div class="tab-swiper" v-show="index === 0">
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
              <th>{{$t('inventoryQty')}}</th>
              <th>{{$t('setTo')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in skuData" :key="index">
              <td>{{item.lcCode}}</td>
              <td>{{item.piSellableOld}}</td>
              <td><input type="number" placeholder="0" value="25" v-model="item.piSellable" v-select-val /></td>
            </tr>
            <tr v-if="!hassku">
              <td colspan="3">{{$t('noMatchingRecordsWereFound')}}</td>
            </tr>
          </tbody>
        </x-table>
      </div>
      <div class="selector">
        <group>
          <selector v-model="skuException" :title="$t('exception')" :options="exceptionList"></selector>
        </group>
      </div>
      <div class="search reasons" v-show="skuException === 'other'">
        <input type="text" :placeholder="$t('otherReasons')" v-model="skuOtherReasons" v-select-val />
      </div>
      <div class="button" v-show="skuButtonShow">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('sku')">{{$t('reset')}}</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native.stop="submit('sku')">{{$t('confirm')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div class="tab-swiper" v-show="index === 1">
      <div class="search">
        <scan-input :placeholder="$t('scanTheBarcodeOfStorageLocationHere')" :name="$t('location')" v-model="lcCode"></scan-input>
      </div>
      <div class="total">
        <span class="pull-left">{{$t('SKUType')}} <span class="underline">{{lcCodeCount}}</span></span>
        <span class="pull-right">{{$t('total')}} <span class="underline">{{lcCodeAll}}</span></span>
      </div>
      <div class="table lcCode">
        <x-table full-bordered>
          <thead>
            <tr>
              <th>SKU</th>
              <th>{{$t('inventoryQty')}}</th>
              <th>{{$t('setTo')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in lcCodeData" :key="index">
              <td>{{item.productBarcode}}</td>
              <td>{{item.piSellableOld}}</td>
              <td><input type="number" placeholder="0" value="25" v-model="item.piSellable" v-select-val /></td>
            </tr>
            <tr v-for="(item, index) in lcCodeDataNew" :key="index">
              <td><i class="iconfont icon-minus-circle-fill" @click="deleteDataNew('lcCode', index)"></i><scan-input :placeholder="$t('scanTheSKUBarCodeHere')" v-model="item.productBarcode"></scan-input></td>
              <td>{{item.piSellableOld}}</td>
              <td><input type="number" placeholder="0" value="25" v-model="item.piSellable" v-select-val /></td>
            </tr>
            <tr v-if="!haslcCode && lcCodeDataNew.length === 0">
              <td colspan="3">{{$t('noMatchingRecordsWereFound')}}</td>
            </tr>
          </tbody>
        </x-table>
        <x-button v-show="lcCodeButtonShow" :gradients="['#169bd5', '#169bd5']" @click.native="addSku('lcCode')"><i class="iconfont icon-jiajianzujianjiahao"></i></x-button>
      </div>
      <div class="selector">
        <group>
          <selector v-model="lcCodeException" :title="$t('exception')" :options="exceptionList"></selector>
        </group>
      </div>
      <div class="search reasons" v-show="lcCodeException === 'other'">
        <input type="text" :placeholder="$t('otherReasons')" v-model="lcCodeOtherReasons" v-select-val />
      </div>
      <div class="button" v-show="lcCodeButtonShow">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('lcCode')">{{$t('reset')}}</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native.stop="submit('lcCode')">{{$t('confirm')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XTable, XButton, Flexbox, FlexboxItem, Selector, Group } from 'vux'
import qs from 'Qs'

export default {
  name: 'inventoryAdjustment',
  components: {
    Tab,
    TabItem,
    XTable,
    XButton,
    Flexbox,
    FlexboxItem,
    Selector,
    Group
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
      productBarcode: '',
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
      skuException: '',
      lcCodeException: '',
      skuOtherReasons: '',
      lcCodeOtherReasons: '',
      skuButtonShow: false,
      lcCodeButtonShow: false,
      exceptionList: [
        {key: '实物与系统不符 / Physical and system do not match', value: this.$t('physicalAndSystemDoNotMatch')},
        {key: '箱规问题 / Box gauge problem', value: this.$t('boxGaugeProblem')},
        {key: 'SKU混箱 / SKU mixing box', value: this.$t('SKUMixingBox')},
        {key: '移库数据差异 / Transfer database data difference', value: this.$t('transferDatabaseDataDifference')},
        {key: 'other', value: this.$t('otherReasons')}
      ]
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
      this[`${type}Exception`] = '实物与系统不符 / Physical and system do not match'
      this[`${type}OtherReasons`] = ''
      this.productBarcode = ''
    },
    addSku (type) {
      if (this[`${type}DataNew`].length >= 5) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('addUp')
        })
        return false
      }
      let data = {
        productBarcode: '',
        piSellable: 0,
        piSellableOld: 0,
        isNewSku: true,
        warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId,
        lcCode: this[`${type}`]
      }
      this[`${type}DataNew`].push(data)
      let length = this[`${type}DataNew`].length - 1
      setTimeout(function () {
        document.querySelectorAll('.lcCode .cont input')[length].focus()
      }, 200)
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
          warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId,
          queryCode: queryCode
        }
      })
      .then(res => {
        this.clearData(type)
        if (res.data.success) {
          let all = 0
          let that = this
          this[`${type}Data`] = []
          this[`${type}Count`] = 0
          this[`${type}All`] = 0
          res.data.data.map(item => {
            all += item.piSellable
            item.piSellableOld = item.piSellable
            return item
          })
          setTimeout(function () {
            that[`${type}Data`] = res.data.data
            that[`old${type}Data`] = JSON.parse(JSON.stringify(res.data.data))
            that[`${type}Count`] = [...new Set(res.data.data.map(item => type === 'sku' ? item.lcCode : item.productBarcode))].length
            that[`${type}All`] = all
            if (res.data.data.length === 0) {
              that[`has${type}`] = false
            } else {
              that[`has${type}`] = true
              that.productBarcode = type === 'sku' ? res.data.data[0].productBarcode : ''
            }
            that.blurInput()
            that[`${type}ButtonShow`] = true
          }, 50)
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.data.message
          })
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
            text: `SKU ${this[`${type}Data`][i].productBarcode} ${this.$t('quantityInputError')}`
          })
          return false
        }
        let quantity = this[`${type}Data`][i].piSellable - this[`${type}Data`][i].piSellableOld
        if (quantity !== 0) {
          this[`${type}Data`][i].quantity = quantity
          this[`${type}Data`][i].warehouseId = JSON.parse(window.localStorage.getItem('warehouse')).warehouseId
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
                text: `${item.productBarcode}${this.$t('existing')}`
              })
              flag = true
              return false
            }
            if (!reg.test(item.piSellable) || Number(item.piSellable) === 0) {
              this.$vux.toast.show({
                type: 'text',
                text: `SKU ${item.productBarcode} ${this.$t('pleaseEnterTheCorrectInventoryQuantity')}`
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
          text: this.$t('thereIsNoChange')
        })
        return false
      }
      let remarks = ''
      if (!this[`${type}Exception`]) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseSelectTheCauseOfTheException')
        })
        return false
      } else if (this[`${type}Exception`] === 'other') {
        if (!this[`${type}OtherReasons`]) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('pleaseFillInTheReasonForTheException')
          })
          return false
        }
        remarks = this[`${type}OtherReasons`]
      } else {
        remarks = this[`${type}Exception`]
      }
      this.$vux.loading.show({
        text: 'Loading'
      })
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/inventory/inventoryAdjustment`, qs.stringify({receivedManageVo: JSON.stringify(submitData), remarks: remarks}), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this.$vux.loading.hide()
        if (res.data.success) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('operationSuccessful')
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
        alert(this.$t('businessSystemException'))
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
  .search-plus {
    padding: 0 1rem;
    margin-top: -1.5rem;
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
  .reasons {
    padding: 5px 1rem;
    input {
      padding: 0 2rem 0 .5rem;
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