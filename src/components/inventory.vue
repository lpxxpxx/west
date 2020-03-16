<template>
  <div class="container adjustment">
    <!-- <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">{{$t('pressSKU')}}</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">{{$t('adjustByDtoragePosition')}}</tab-item>
    </tab> -->
    <div class="tab-swiper" v-show="index === 0">
      <div class="search">
        <div class="info-detail">
          <span class="label">{{$t('inventoryNumber')}}：</span> 
          <span class="underline name" title="">{{tsCode}}</span>
        </div>
      </div>
      <div class="table">
        <x-table full-bordered>
          <thead>
            <tr>
              <th>{{$t('location')}}</th>
              <th>SKU</th>
              <th>{{$t('theNumber')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data0" :key="index">
              <td>{{item.lcCode}}</td>
              <td>{{item.productBarcode}}</td>
              <td><input type="number" v-model="item.tsiQuantity" v-select-val /></td>
            </tr>
            <tr v-if="data0.length === 0">
              <td colspan="3">{{$t('noMatchingRecordsWereFound')}}</td>
            </tr>
          </tbody>
        </x-table>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset()">{{$t('reset')}}</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native.stop="submit()">{{$t('confirm')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div class="tab-swiper" v-show="index === 1">
      <div class="search">
        <div class="info-detail">
          <span class="label">{{$t('inventoryNumber')}}：</span> 
          <span class="underline name" title="">{{tsCode}}</span>
        </div>
      </div>
      <div class="table lcCode">
        <x-table full-bordered>
          <thead>
            <tr>
              <th>{{$t('location')}}</th>
              <th>SKU</th>
              <th>{{$t('theNumber')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data1" :key="index">
              <td>{{item.lcCode}}</td>
              <td>{{item.productBarcode}}</td>
              <td><input type="number" v-model="item.tsiQuantity" v-select-val /></td>
            </tr>
            <tr v-for="(item, index) in data1Extra" :key="index">
              <td><i class="iconfont icon-minus-circle-fill" @click="deleteDataNew(index)"></i>{{item.lcCode}}</td>
              <td><scan-input :placeholder="$t('scanTheSKUBarCodeHere')" v-model="item.productBarcode"></scan-input></td>
              <td><input type="number" v-model="item.tsiQuantity" v-select-val /></td>
            </tr>
          </tbody>
        </x-table>
        <x-button :gradients="['#169bd5', '#169bd5']" @click.native="addSku()"><i class="iconfont icon-jiajianzujianjiahao"></i></x-button>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset()">{{$t('reset')}}</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native.stop="submit()">{{$t('confirm')}}</x-button>
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
    this.tsCode = query.tsCode
    this.index = Number(query.tsType)
    this.searchDetail()
  },
  data () {
    return {
      index: 0,
      sku: '',
      tsCode: '',
      timeoutId: '',
      data0: [],
      oldData0: [],
      data1: [],
      oldData1: [],
      data1Extra: []
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    reset () {
      this[`data${this.index}`] = JSON.parse(JSON.stringify(this[`oldData${this.index}`]))
      this[`data${this.index}Extra`] = []
    },
    clearData () {
      this[`data${this.index}`] = []
      this[`data${this.index}Extra`] = []
    },
    addSku (type) {
      if (this[`data${this.index}Extra`].length >= 5) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('addUp')
        })
        return false
      }
      let that = this
      let data = {
        productBarcode: '',
        lcCode: that[`data${this.index}`][0].lcCode,
        tsCode: that.tsCode,
        tsiCurrentQuantity: 0,
        tsiQuantity: '',
        customerCode: ''
      }
      this[`data${this.index}Extra`].push(data)
      let focus = this[`data${this.index}Extra`].length * 3 - 3
      setTimeout(function () {
        document.querySelectorAll('.lcCode .cont input')[focus].focus()
      }, 200)
    },
    deleteDataNew (type, index) {
      this[`data${this.index}Extra`].splice(index, 1)
    },
    searchDetail () {
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/takeStock/selectTableTsCodeInfo`, qs.stringify({
        tsCode: this.tsCode
      }), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this.clearData()
        if (res.data.rows.length !== 0) {
          this[`data${this.index}`] = res.data.rows
          this[`oldData${this.index}`] = JSON.parse(JSON.stringify(res.data.rows))
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('networkAnomaly')
          })
        }
      })
      .catch(res => {
        alert(this.$t('businessSystemException'))
      })
    },
    submit () {
      /* let regZero = /^([1-9]\d*|[0]{1,1})$/ */
      let reg = /^[0-9]\d{0,4}$/
      let that = this
      let submitData = []
      /* let submitData = [...this[`data${this.index}`], ...this[`data${this.index}Extra`]] */
      for (let i = 0; i < this[`data${this.index}`].length; i++) {
        if (!reg.test(Number(this[`data${this.index}`][i].tsiQuantity)) && this[`data${this.index}`][i].tsiQuantity !== undefined) {
          this.$vux.toast.show({
            type: 'text',
            text: `SKU ${this[`data${this.index}`][i].productBarcode} ${this.$t('quantityInputError')}`
          })
          return false
        } else if (this[`data${this.index}`][i].tsiQuantity) {
          submitData.push(this[`data${this.index}`][i])
        }
      }
      if (this.index === 1) {
        if (this[`data${this.index}Extra`].length > 0) {
          let skuList = this[`data${this.index}`].map(item => item.productBarcode)
          let flag = false
          this[`data${this.index}Extra`].forEach((item, index) => {
            if (skuList.indexOf(item.productBarcode) !== -1) {
              this.$vux.toast.show({
                type: 'text',
                text: `${item.productBarcode}${this.$t('existing')}`
              })
              flag = true
              return false
            } else if (!reg.test(item.tsiQuantity) || Number(item.tsiQuantity) === 0) {
              this.$vux.toast.show({
                type: 'text',
                text: `SKU ${item.productBarcode} ${this.$t('pleaseEnterTheCorrectInventoryQuantity')}`
              })
              flag = true
              return false
            } else {
              submitData.push(item)
            }
          })
          if (flag) {
            return false
          }
        }
      }
      if (submitData.length === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: `${this.$t('thereIsNoChange')}`
        })
        return false
      }
      submitData.map(item => {
        item.tsiQuantity = Number(item.tsiQuantity)
        item.tsCode = that.tsCode
        return item
      })
      this.$vux.loading.show({
        text: 'Loading'
      })
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/takeStock/submitTakeToskExcelInfo`, qs.stringify({dataList: JSON.stringify(submitData)}), {
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
          this.$router.go(-1)
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