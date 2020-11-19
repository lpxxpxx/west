<template>
  <div class="container adjustment">
    <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">{{$t('accordingToTheLocationToCheck')}} - {{$t('moveIn')}}</tab-item>
    </tab>
    <div class="tab-swiper" v-show="index === 0">
      <div class="search">
        <span class="label">{{$t('moveInLcCode')}}</span>
        <span class="underline name" title="">{{lcCode}}</span>
      </div>
      <div class="search search-plus">
        <scan-input :placeholder="$t('scanTheSKUBarCodeHere')" :name="$t('moveInSKU')" v-model="sku"></scan-input>
      </div>
      <div class="table">
        <x-table full-bordered>
          <thead>
            <tr>
              <th>{{$t('location')}}</th>
              <th>{{$t('inventoryQty')}}</th>
              <th>{{$t('moveInQty')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in skuData" :key="index">
              <td>{{item.lcCode}}</td>
              <td>{{item.piSellable}}</td>
              <td><input type="number" placeholder="0" v-model="item.quantity" v-select-val /></td>
            </tr>
            <tr v-if="skuData.length === 0">
              <td colspan="3">{{$t('noMatchingRecordsWereFound')}}</td>
            </tr>
          </tbody>
        </x-table>
      </div>
      <div class="button" v-show="skuData.length !== 0">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native.stop="submit('sku')">{{$t('confirm')}}</x-button>
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
    this.lcCode = query.lcCode
  },
  data () {
    return {
      index: 0,
      sku: '',
      lcCode: '',
      timeoutId: '',
      skuData: []
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    blurInput () {
      document.querySelectorAll('.search input')[`${this.index}`].blur()
    },
    searchDetail (type) {
      let queryCode = type === 'sku' ? this.sku : this.lcCode
      if (!queryCode) {
        return false
      }
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/inventory/inventorySearch`, {
        params: {
          codeType: type,
          warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId,
          queryCode: queryCode
        }
      })
      .then(res => {
        if (res.data.success) {
          let that = this
          this[`${type}Data`] = []
          setTimeout(function () {
            res.data.data.rows.forEach(item => {
              if (item.lcCode !== that.lcCode) {
                that[`${type}Data`].push(item)
              }
            })
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
      const submitData = []
      let reg = /^[1-9]\d{0,4}$/
      for (let i = 0; i < this[`${type}Data`].length; i++) {
        let qty = this[`${type}Data`][i].quantity
        if (qty && (!reg.test(Number(qty)) || Number(qty) > Number(this[`${type}Data`][i].piSellable))) {
          this.$vux.toast.show({
            type: 'text',
            text: `${this.$t('location')} ${this[`${type}Data`][i].lcCode} ${this.$t('quantityInputError')}`
          })
          return false
        } else if (qty) {
          submitData.push({
            lcCode: this[`${type}Data`][i].lcCode,
            productBarcode: this.sku,
            lcCodeNew: this.lcCode,
            quantity: qty
          })
        }
      }
      if (submitData.length === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('thereIsNoChange')
        })
        return false
      }
      this.$vux.loading.show({
        text: 'Loading'
      })
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/inventory/moveInOrOutStock`, qs.stringify({
        buttonType: 1,
        dataJson: JSON.stringify(submitData)
      }), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        let that = this
        this.$vux.loading.hide()
        if (res.data.success) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('operationSuccessful')
          })
          setTimeout(function () {
            that.$router.push(`/stockInquiry?lcCode=${that.lcCode}`)
          }, 2000)
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
    margin-top: -.5rem;
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