<template>
  <div class="container">
    <div class="info clearfloat">
      <div class="info-detail">
        <span class="label">{{$t('pickingListNo')}}：</span> 
        <span class="underline name" title="">{{pickingCode}}</span>
      </div>
      <div class="total">
        <span class="pull-left">{{$t('total')}}： <span class="underline">{{pickingItemCnt || 0}}</span></span>
        <span class="pull-right">{{$t('picked')}}： <span class="underline">{{pickedQTY || 0}}</span></span>
      </div>
    </div>
    <div class="step" v-show="step===1">
      <div class="search">
        <span class="label">{{$t('newLocation')}}</span>
      </div>
      <div class="search search-last search-detail">
        <span class="label">{{lcCode}}</span>
      </div>
      <div class="search search-last">
        <span class="label">{{$t('pleaseScanTheLocation')}}</span>
      </div>
      <div class="search search-last">
        <scan-input :placeholder="$t('scanTheBarcodeOfStorageLocationHere')" :autofocus="'autofocus'" v-model="lcCodeP"></scan-input>
      </div>
    </div>
    <div class="step" v-show="step===2">
      <div class="search">
        <span class="label">{{$t('formLocation')}}</span>
      </div>
      <div class="search search-last search-detail">
        <span class="label">{{lcCode}}</span>
      </div>
      <div class="search">
        <span class="label">SKU</span>
      </div>
      <div class="search search-last search-detail">
        <span class="label">{{productBarcode}}</span>
      </div>
      <div class="search">
        <span class="label">{{$t('total')}}</span>
      </div>
      <div class="search search-last search-detail">
        <span class="label">{{pickSumQty}}</span>
      </div>
      <div class="search">
        <span class="label">{{$t('pleaseScanTheSKU')}}</span>
      </div>
      <div class="search search-last">
        <scan-input :placeholder="$t('scanTheSKUBarCodeHere')" v-model="productBarcodeP"></scan-input>
      </div>
      <div class="search">
        <span class="label">{{$t('remainQty')}}</span>
      </div>
      <div class="search search-last search-detail">
        <span class="label">{{remainQty}}</span>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#ff0000', '#ff0000']" @click.native="showExceptionMenus = true">{{$t('exception')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
      <div>
        <actionsheet :menus="exceptionMenus" v-model="showExceptionMenus" @on-click-menu="exception"></actionsheet>
      </div>
    </div>
    <div class="step" v-show="step===3">
      <div class="search">
        <span class="label">{{$t('total')}}：</span>
        <span class="detail">{{pickingItemCnt}}</span>
      </div>
      <div class="search">
        <span class="label">{{$t('picked')}}：</span>
        <span class="detail">{{pickedQTY}}</span>
      </div>
      <div class="search">
        <span class="label">{{$t('exceptionQTY')}}：</span>
        <span class="detail">{{exceptionQTY}}</span>
      </div>
      <div class="search">
        <span class="label">{{$t('totalTime')}}：</span>
        <span class="detail">{{totalTime}}</span>
      </div>
      <div class="search">
        <span class="label">{{$t('pickRate')}}：</span>
        <span class="detail">{{pickRate}}</span>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native.stop="returnTask">{{$t('finish')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem, Selector, Group, Actionsheet } from 'vux'
import qs from 'Qs'

export default {
  name: 'pickingOperate',
  components: {
    XButton,
    Flexbox,
    FlexboxItem,
    Selector,
    Group,
    Actionsheet
  },
  data () {
    return {
      step: 1,
      showExceptionMenus: false,
      pickingCode: '',
      pickingItemCnt: '',
      pickedQTY: '',
      lcCode: '',
      lcCodeP: '',
      pageType: '',
      pickSumQty: '',
      remainQty: '',
      productBarcode: '',
      productBarcodeP: '',
      productId: '',
      exceptionMenus: {
        '1': this.$t('thereIsNoSuchSKUOnTheTocation'),
        '2': this.$t('SKUHasBeenDamaged'),
        '3': this.$t('barcodeCannotBeScanned'),
        '4': this.$t('barcodeIsInconsistentWithPrinting'),
        '5': this.$t('otherReasons')
      }
    }
  },
  mounted () {
    let query = this.$route.query || {}
    this.pickingCode = query.pickingCode
    this.pickingItemCnt = query.pickingItemCnt
    this.searchDetail()
  },
  methods: {
    searchDetail () {
      let params = {
        warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId,
        pickingCode: this.pickingCode
      }
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/picking/pickingListDetailSearch`, qs.stringify(params), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        if (res.data.success) {
          if (res.data.data) {
            for (let i in res.data.data) {
              this[i] = res.data.data[i]
            }
            this.focusInput(0)
          }
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
    submit (type = '') {
      let params = {
        warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId,
        warehouseCode: JSON.parse(window.localStorage.getItem('warehouse')).warehouseCode,
        pickingCode: this.pickingCode,
        productBarcode: this.productBarcode,
        productId: this.productId,
        lcCode: this.lcCode,
        scanSku: this.productBarcodeP
      }
      if (type === 'exception') {
        params.exceptionType = this.exceptionType
        params.pickSumQty = this.pickSumQty
        params.remainQty = this.remainQty
      } else {
        params.scanSku = this.productBarcodeP
      }
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/picking/implementPick`, qs.stringify(params), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        if (res.data.success) {
          if (res.data.data) {
            for (let i in res.data.data) {
              this[i] = res.data.data[i]
            }
            this.productBarcodeP = ''
            if (res.data.data.pageType === 'detail') {
              if (res.data.data.lcCode.toUpperCase() !== this.lcCodeP.toUpperCase()) {
                this.step = 1
                this.lcCodeP = ''
                this.focusInput(0)
              } else {
                this.step = 2
                this.focusInput(1)
              }
            } else if (res.data.data.pageType === 'finish') {
              this.step = 3
            }
          }
        }
        this.$vux.toast.show({
          type: 'text',
          text: res.data.message
        })
      })
      .catch(res => {
        alert(this.$t('businessSystemException'))
      })
    },
    exception (menuKey) {
      this.exceptionType = menuKey
      this.submit('exception')
    },
    returnTask () {
      this.$router.go(-1)
    },
    focusInput (index) {
      setTimeout(function () {
        document.querySelectorAll('input')[`${index}`].focus()
      }, 200)
    }
  },
  watch: {
    lcCodeP () {
      if (this.lcCodeP.toUpperCase() === this.lcCode.toUpperCase()) {
        this.step = 2
        this.focusInput(1)
      }
    },
    productBarcodeP () {
      let a = this.productBarcodeP.split('-')
      let b = this.productBarcode.split('-')
      if (this.productBarcodeP.toUpperCase() === this.productBarcode.toUpperCase() || a[a.length - 1].toUpperCase() === b[b.length - 1].toUpperCase()) {
        this.submit()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    margin-bottom: 7rem;
  }
  .info>.search {
    padding: 5px 0;
  }
  .search {
    padding: 5px 1rem 0;
    line-height: 3rem;
    display: flex;
    .label {
      font-size: 1.5rem;
    }
    input {
      flex: 1;
      padding: 0 .5rem;
    }
    .detail {
      font-size: 1.5rem;
      color: blue;
    }
  }
  .search.search-last {
    padding-top: 0; 
  }
  .search.search-detail {
    color: blue;
  }
  .info {
    padding: 1rem 1rem 0;
    .info-detail {
      display: flex;
      .name {
        flex: 1;
        text-overflow: ellipsis;
      }
    }
  }
  .size {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem 10px;
    .size-item {
      input {
        height: 3rem;
        line-height: 3rem;
        padding: 0 6px;
        box-sizing: border-box;
        font-size: 1rem;
      }
      span {
        display: inline-block;
        text-align: center;
      }
    }
  }
  .photo {
    padding: 1.5rem 1rem;
    display: flex;
    .label {
      display: inline-block;
      line-height: 3rem;
      margin-right: 5px;
    }
    .photo-cont {
      display: flex;
      flex: 1;
      font-size: 2rem;
      line-height: 3rem;
      .img-con {
        height: 3rem;
        margin-right: .5rem;
        border: 1px solid #999;
        position: relative;
        img {
          height: 3rem;
        }
        .delete-icon {
          position: absolute;
          background: red;
          color: #fff;
          width: 16px;
          height: 16px;
          top: -8px;
          right: -8px;
          line-height: 16px;
          font-size: 12px;
          border-radius: 16px;
          text-align: center;
        }
      }
      .iconfont {
        border: 1px dashed #999;
        color: #999;
        font-size: 2rem;
        padding: 0px 7px 0;
      }
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
