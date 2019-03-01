<template>
  <div class="container">
    <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">{{$t('hitSKU')}}</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">{{$t('shelfByCase')}}</tab-item>
    </tab>
    <div class="tab-swiper" v-show="index === 0">
      <div class="search">
        <scan-input :name="$t('orderNo')" :placeholder="$t('theWarehouseEntryNumberIsScannedHere')" v-model="skuData.receivingCode"></scan-input>
      </div>
      <div class="search search-last">
        <scan-input :name="'SKU'" :placeholder="$t('scanTheSKUOnTheShippingMarkHere')" v-model="skuData.productBarcode"></scan-input>
      </div>
      <p class="error-info" v-show="skuData.receivingCode && skuData.productBarcode">{{skuData.errorInfo}}</p>
      <div class="info clearfloat">
        <div class="info-detail">
          <span class="label">{{$t('theNameOfTheSKU')}}：</span> 
          <span class="underline name" title="">{{skuData.productTitleEn}}</span>
        </div>
        <div class="total">
          <span class="pull-left">{{$t('quantityReceived')}}： <span class="underline">{{skuData.rdbReceivedQty}}</span></span>
          <span class="pull-right">{{$t('quantityOnShelves')}}： <span class="underline">{{skuData.rdbPutawayQty}}</span></span>
        </div>
      </div>
      <div class="search">
        <scan-input :name="$t('location')" :placeholder="$t('scanTheBarcodeOfStorageLocationHere')" v-model="skuData.lcCode"></scan-input>
      </div>
      <div class="search search-last">
        <span class="label">{{$t('theNumber')}}</span>
        <input type="text" v-model="skuData.pdQuantity" v-select-val />
      </div>
      <div class="photo">
        <span class="label">{{$t('takePhotos')}}</span>
        <span class="photo-cont">
          <span class="img-con" v-for="(item, index) in $store.getters.getPhoneType === 'IOS' ? skuImgIOS :skuImg" :key="index">
            <img :src="item" @click="previewImg('sku', index)">
            <span class="delete-icon" @click="deleteImg('sku', index)">x</span>
          </span>
          <span class="iconfont icon-camera" @click="chooseImage('sku')" v-show="skuImg.length <= 2"></span>
        </span>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('sku')">{{$t('reset')}}</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native="submit('sku')">{{$t('confirm')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div class="tab-swiper" v-show="index === 1">
      <div class="search">
        <scan-input :name="$t('caseNumber')" :placeholder="$t('scanTheShippingMarkHere')" v-model="boxNoData.boxCode"></scan-input>
      </div>
      <div class="search search-last">
        <scan-input :name="'SKU'" :placeholder="$t('scanTheSKUOnTheShippingMarkHere')" v-model="boxNoData.productBarcode"></scan-input>
      </div>
      <p class="error-info" v-show="boxNoData.boxCode && boxNoData.productBarcode">{{boxNoData.errorInfo}}</p>
      <div class="info clearfloat">
        <div class="info-detail">
          <span class="label">{{$t('theNameOfTheSKU')}}：</span> 
          <span class="underline name" title="">{{boxNoData.productTitleEn}}</span>
        </div>
        <div class="total">
          <span class="pull-left">{{$t('quantityReceived')}}： <span class="underline">{{boxNoData.rdbReceivedQty}}</span></span>
          <span class="pull-right">{{$t('quantityOnShelves')}}： <span class="underline">{{boxNoData.rdbPutawayQty}}</span></span>
        </div>
      </div>
      <div class="search">
        <scan-input :name="$t('location')" :placeholder="$t('scanTheBarcodeOfStorageLocationHere')" v-model="boxNoData.lcCode"></scan-input>
      </div>
      <div class="search search-last">
        <span class="label">{{$t('theNumber')}}</span>
        <input type="number" v-model="boxNoData.pdQuantity" v-select-val />
      </div>
      <div class="photo">
        <span class="label">{{$t('takePhotos')}}</span>
        <span class="photo-cont">
          <span class="img-con" v-for="(item, index) in $store.getters.getPhoneType === 'IOS' ? boxNoImgIOS :boxNoImg" :key="index">
            <img :src="item" @click="previewImg('boxNo', index)">
            <span class="delete-icon" @click="deleteImg('boxNo', index)">x</span>
          </span>
          <span class="iconfont icon-camera" @click="chooseImage('boxNo')" v-show="boxNoImg.length <= 2"></span>
        </span>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('boxNo')">{{$t('reset')}}</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native="submit('boxNo')">{{$t('confirm')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XButton, Flexbox, FlexboxItem } from 'vux'
import ScanInput from './scan_input'
import qs from 'Qs'

export default {
  name: 'upperShelf',
  components: {
    Tab,
    TabItem,
    XButton,
    Flexbox,
    FlexboxItem,
    ScanInput
  },
  mounted () {
    let query = this.$route.query || {}
    this.skuData.receivingCode = query.receivingCode
    this.skuData.productBarcode = query.productBarcode
    this.loadDetail('sku')
  },
  data () {
    return {
      index: 0,
      skuData: {
        receivingCode: '',
        productBarcode: '',
        lcCode: '',
        pdQuantity: '',
        errorInfo: ''
      },
      skuImg: [],
      skuImgIOS: [],
      boxNoData: {
        boxCode: '',
        productBarcode: '',
        lcCode: '',
        pdQuantity: '',
        errorInfo: ''
      },
      boxNoImg: [],
      boxNoImgIOS: [],
      oldskuData: {
        receivingCode: '',
        productBarcode: '',
        lcCode: '',
        pdQuantity: '',
        errorInfo: ''
      },
      oldboxNoData: {
        boxCode: '',
        productBarcode: '',
        lcCode: '',
        pdQuantity: '',
        errorInfo: ''
      },
      uploadIds: []
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    reset (type) {
      this[`${type}Data`] = JSON.parse(JSON.stringify(this[`old${type}Data`]))
    },
    loadDetail (type) {
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/putaway/putawayDetail`, {
        params: {
          receivingCode: this[`${type}Data`].receivingCode,
          warehouseId: this.$store.getters.getWarehouse.warehouseId,
          productBarcode: this[`${type}Data`].productBarcode,
          boxNo: this[`${type}Data`].boxCode,
          codeType: type
        }
      })
      .then(res => {
        if (res.data.success) {
          res.data.data.boxCode = this[`${type}Data`].boxCode
          this[`${type}Data`] = res.data.data
          this[`old${type}Data`] = JSON.parse(JSON.stringify(res.data.data))
        } else {
          this[`${type}Data`].pdQuantity = 0
          this[`${type}Data`].productId = 0
          this[`${type}Data`].productTitleEn = ''
          this[`${type}Data`].rdbPutawayQty = 0
          this[`${type}Data`].rdbReceivedQty = 0
          this[`${type}Data`].errorInfo = res.data.message
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
        that.loadDetail(type)
      }, 1000)
    },
    submit (type) {
      if (type === 'sku') {
        if (!this[`${type}Data`].receivingCode) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('pleaseEnterTheWarehouseEntryNumber')
          })
          return false
        }
      } else {
        if (!this[`${type}Data`].boxCode) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('pleaseEnterTheCaseNumber')
          })
          return false
        }
      }
      if (!this[`${type}Data`].lcCode) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterTheLocation')
        })
        return false
      }
      if (!this[`${type}Data`].pdQuantity || Number(this[`${type}Data`].pdQuantity) === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterQuantity')
        })
        return false
      }
      let reg = /^[1-9]\d{0,4}$/
      if (!reg.test(Number(this[`${type}Data`].pdQuantity)) || Number(this[`${type}Data`].pdQuantity) === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterTheCorrectQuantity')
        })
        return false
      }
      if (Number(this[`${type}Data`].pdQuantity) > (this[`${type}Data`].rdbReceivedQty - this[`${type}Data`].rdbPutawayQty)) {
        this[`${type}Data`].pdQuantity = (this[`${type}Data`].rdbReceivedQty - this[`${type}Data`].rdbPutawayQty)
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('moreThanTheActualQuantityReceived')
        })
        return false
      }
      this[`${type}Data`].putawayType = type === 'sku' ? 'sku' : 'boxNo'
      this.$vux.loading.show({
        text: 'Loading'
      })
      if (this[`${type}Img`].length) {
        this.uploadImg(type)
      } else {
        this.doAjax(type)
      }
    },
    doAjax (type) {
      this[`${type}Data`].serverIds = this.uploadIds
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/putaway/doPutaway`, qs.stringify(this[`${type}Data`]), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this.$vux.loading.hide()
        if (res.data.success) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('operationSuccessful')
          })
          this[`${type}Img`] = []
          this[`${type}ImgIOS`] = []
          this.uploadIds = []
          this.toSearch(type)
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.data.message
          })
          this.uploadIds = []
        }
      })
      .catch(res => {
        this.$vux.loading.hide()
        alert(this.$t('businessSystemException'))
      })
    },
    chooseImage (type) {
      let that = this
      let count = 3 - that[`${type}Img`].length
      // eslint-disable-next-line
      wx.chooseImage({
        count: count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          that[`${type}Img`] = [...that[`${type}Img`], ...res.localIds]
          if (this.$store.getters.getPhoneType === 'IOS') {
            that[`${type}Img`].forEach((item, index) => {
              that.getLocalImgData(item, index, type)
            })
          }
        }
      })
    },
    getLocalImgData (item, index, type) {
      let that = this
      // eslint-disable-next-line
      wx.getLocalImgData({
        localId: 'item',
        success: function (res) {
          that[`${type}ImgIOS`][index] = res.localData
        }
      })
    },
    deleteImg (type, index) {
      this[`${type}Img`].splice(index, 1)
      this[`${type}ImgIOS`].splice(index, 1)
    },
    previewImg (type, index) {
      let that = this
      // eslint-disable-next-line
      wx.previewImage({
        current: that[`${type}Img`][index],
        urls: that[`${type}Img`]
      })
    },
    uploadImg (type) {
      let that = this
      if (!that[`${type}Img`].length) {
        that.doAjax(type)
      } else {
        let localId = that[`${type}Img`].pop()
        // eslint-disable-next-line
        wx.uploadImage({
          localId: localId,
          success: function (res) {
            that.uploadIds.push(res.serverId)
            that.uploadImg(type)
          }
        })
      }
    }
  },
  watch: {
    'skuData.receivingCode' () {
      if (this.skuData.receivingCode && this.skuData.productBarcode) {
        this.toSearch('sku')
      }
    },
    'skuData.productBarcode' () {
      if (this.skuData.receivingCode && this.skuData.productBarcode) {
        this.toSearch('sku')
      }
    },
    'boxNoData.boxCode' () {
      if (this.boxNoData.boxCode && this.boxNoData.productBarcode) {
        this.toSearch('boxNo')
      }
    },
    'boxNoData.productBarcode' () {
      if (this.boxNoData.boxCode && this.boxNoData.productBarcode) {
        this.toSearch('boxNo')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    margin-bottom: 7rem;
  }
  .error-info {
    margin-left: 5rem;
    color: red;
  }
  .search {
    padding: 1rem 1rem 5px;
    height: 3rem;
    line-height: 3rem;
    display: flex;
    .label {
      font-size: 1.5rem;
      width: 4rem;
    }
    input {
      flex: 1;
      padding: 0 .5rem;
    }
  }
  .search.search-last {
    padding-top: 0; 
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
