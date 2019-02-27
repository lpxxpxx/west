<template>
  <div class="container">
    <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">{{$t('accordingToTheSKUReceiving')}}</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">{{$t('accordingToTheCasesOfReceiving')}}</tab-item>
    </tab>
    <div class="tab-swiper" v-show="index === 0">
      <div class="search">
        <scan-input :name="$t('orderNo')" :placeholder="$t('theWarehouseEntryNumberIsScannedHere')" v-model="skuData.receivingCode"></scan-input>
      </div>
      <div class="search search-last">
        <scan-input :name="'SKU'" :placeholder="$t('scanTheSKUOnTheShippingMarkHere')" v-model="skuData.productBarcode"></scan-input>
      </div>
      <div class="info clearfloat">
        <div class="info-detail">
          <span class="label">{{$t('theNameOfTheSKU')}}：</span> 
          <span class="underline name" title="">{{skuData.productTitleEn}}</span>
        </div>
        <div class="total">
          <span class="pull-left">{{$t('forecastTheNumberOf')}}： <span class="underline">{{skuData.rdReceivingQtySubset || 0}}</span></span>
          <span class="pull-right">{{$t('numberOfReceived')}}： <span class="underline">{{skuData.rdReceivedQtySubset || 0}}</span></span>
        </div>
      </div>
      <div class="size">
        <div class="size-item" style="width: 23%;">
          <input type="number" placeholder="0" v-model="skuData.productLength" style="width: calc(100% - 22px)" v-enter-number /><span style="width: 20px"> x </span>
        </div>
        <div class="size-item" style="width: 23%;">
          <input type="number" placeholder="0" v-model="skuData.productWidth" style="width: calc(100% - 22px)" v-enter-number /><span style="width: 20px"> x </span>
        </div>
        <div class="size-item" style="width: 27%;">
          <input type="number" placeholder="0" v-model="skuData.productHeight" style="width: calc(100% - 37px)" v-enter-number /><span style="width: 35px"> CM </span>
        </div>
        <div class="size-item" style="width: 27%;">
          <input type="number" placeholder="0" v-model="skuData.productWeight" style="width: calc(100% - 37px)" class="weight" v-enter-number /><span style="width: 35px"> KG</span>
        </div>
      </div>
      <div class="search search-last">
        <span class="label" style="width: 10rem">{{$t('quantityReceivedThisTime')}}</span>
        <input type="number" placeholder="0" v-model="skuData.rdReceivedNetReceiptsQty" />
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
        <scan-input :name="$t('caseNumber')" :placeholder="$t('scanTheContainerNumberOnTheShippingMarkHere')" v-model="boxData.boxNo"></scan-input>
      </div>
      <div class="search search-last">
        <span class="label">SKU</span>
        <input type="text" disabled="disabled" v-model="boxData.productBarcode" />
      </div>
      <div class="info clearfloat">
        <div class="info-detail">
          <span class="label">{{$t('theNameOfTheSKU')}}：</span> 
          <span class="underline name" title="">{{boxData.productTitleEn}}</span>
        </div>
        <div class="total">
          <span class="pull-left">{{$t('forecastTheNumberOf')}}： <span class="underline">{{boxData.rdReceivingQtySubset || 0}}</span></span>
          <span class="pull-right">{{$t('numberOfReceived')}}： <span class="underline">{{boxData.rdReceivedQtySubset || 0}}</span></span>
        </div>
      </div>
      <div class="size">
        <div class="size-item" style="width: 23%;">
          <input type="number" placeholder="0" v-model="boxData.productLength" style="width: calc(100% - 22px)" v-enter-number /><span style="width: 20px"> x </span>
        </div>
        <div class="size-item" style="width: 23%;">
          <input type="number" placeholder="0" v-model="boxData.productWidth" style="width: calc(100% - 22px)" v-enter-number /><span style="width: 20px"> x </span>
        </div>
        <div class="size-item" style="width: 27%;">
          <input type="number" placeholder="0" v-model="boxData.productHeight" style="width: calc(100% - 37px)" v-enter-number /><span style="width: 35px"> CM </span>
        </div>
        <div class="size-item" style="width: 27%;">
          <input type="number" placeholder="0" v-model="boxData.productWeight" style="width: calc(100% - 37px)" v-enter-number /><span style="width: 35px"> KG</span>
        </div>
      </div>
      <div class="search search-last">
        <span class="label" style="width: 10rem">{{$t('quantityReceivedThisTime')}}</span>
        <input type="number" placeholder="0" v-model="boxData.rdReceivedNetReceiptsQty" style="width: 9rem" />
      </div>
      <div class="photo">
        <span class="label">{{$t('takePhotos')}}</span>
        <span class="photo-cont">
          <span class="img-con" v-for="(item, index) in $store.getters.getPhoneType === 'IOS' ? boxImgIOS :boxImg" :key="index">
            <img :src="item" @click="previewImg('box', index)">
            <span class="delete-icon" @click="deleteImg('box', index)">x</span>
          </span>
          <span class="iconfont icon-camera" @click="chooseImage('box')" v-show="boxImg.length <= 2"></span>
        </span>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('box')">{{$t('reset')}}</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native="submit('box')">{{$t('confirm')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XButton, Flexbox, FlexboxItem } from 'vux'
import qs from 'Qs'

export default {
  name: 'receiving',
  components: {
    Tab,
    TabItem,
    XButton,
    Flexbox,
    FlexboxItem
  },
  mounted () {
    let query = this.$route.query || {}
    this.skuData.receivingCode = query.receivingCode
  },
  computed: {
    boxDataboxNo () {
      return this.boxData.boxNo
    }
  },
  data () {
    return {
      index: 0,
      timeoutId: '',
      skuData: {
        receivingCode: '',
        productBarcode: '',
        receivingQtyList: [{}]
      },
      skuImg: [],
      skuImgIOS: [],
      boxImg: [],
      boxImgIOS: [],
      boxData: {
        receivingCode: '',
        productBarcode: '',
        receivingQtyList: [{
          boxNo: ''
        }]
      },
      oldskuData: {
        receivingCode: '',
        productBarcode: '',
        receivingQtyList: [{}]
      },
      oldboxData: {
        receivingCode: '',
        productBarcode: '',
        receivingQtyList: [{
          boxNo: ''
        }]
      },
      uploadIds: []
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    searchDetail (type, code, receivingCode) {
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/receiving/receivingDetailSearch`, {
        params: {
          codeType: type,
          warehouseId: this.$store.getters.getWarehouse.warehouseId,
          queryCode: code,
          receivingCode: receivingCode
        }
      })
      .then(res => {
        if (res.data.success) {
          if (res.data.data) {
            res.data.data.rdReceivedNetReceiptsQty = res.data.data.rdReceivingQtySubset - res.data.data.rdReceivedQtySubset
            res.data.data.productHeight = Number(res.data.data.productHeight)
            res.data.data.productLength = Number(res.data.data.productLength)
            res.data.data.productWidth = Number(res.data.data.productWidth)
            res.data.data.productWeight = Number(res.data.data.productWeight)
            this[`${type}Data`] = res.data.data
            this[`old${type}Data`] = JSON.parse(JSON.stringify(res.data.data))
          } else {
            if (type === 'box') {
              this[`${type}Data`].productBarcode = ''
            }
            this[`${type}Data`].productTitleEn = ''
            this[`${type}Data`].rdReceivingQtySubset = 0
            this[`${type}Data`].rdReceivedQtySubset = 0
            this[`${type}Data`].productLength = 0
            this[`${type}Data`].productWidth = 0
            this[`${type}Data`].productHeight = 0
            this[`${type}Data`].productWeight = 0
            this[`${type}Data`].rdReceivedNetReceiptsQty = 0
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
    toSearch (type) {
      let that = this
      let code = type === 'sku' ? this[`${type}Data`].productBarcode : this[`${type}Data`].boxNo
      clearTimeout(that.timeoutId)
      that.timeoutId = setTimeout(function () {
        that.searchDetail(type, code, that[`${type}Data`].receivingCode)
      }, 1000)
    },
    reset (type) {
      this[`${type}Data`] = JSON.parse(JSON.stringify(this[`old${type}Data`]))
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
        if (!this[`${type}Data`].productBarcode) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('pleaseEnterTheSKU')
          })
          return false
        }
      } else {
        if (!this[`${type}Data`].boxNo) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('pleaseEnterTheCaseNumber')
          })
          return false
        }
      }
      if (!this[`${type}Data`].productLength) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterProductLength')
        })
        return false
      }
      if (!this[`${type}Data`].productWidth) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterProductWidth')
        })
        return false
      }
      if (!this[`${type}Data`].productHeight) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterProductHeight')
        })
        return false
      }
      if (!this[`${type}Data`].productWeight) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseInputProductWeight')
        })
        return false
      }
      if (!this[`${type}Data`].rdReceivedNetReceiptsQty || Number(this[`${type}Data`].rdReceivedNetReceiptsQty) === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseInputTheQuantityReceived')
        })
        return false
      }
      let reg = /^[1-9]\d{0,4}$/
      if (!reg.test(Number(this[`${type}Data`].rdReceivedNetReceiptsQty)) || Number(this[`${type}Data`].rdReceivedNetReceiptsQty) === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterTheCorrectQuantity')
        })
        return false
      }
      if (this[`${type}Data`].rdReceivedNetReceiptsQty > (this[`${type}Data`].rdReceivingQtySubset - this[`${type}Data`].rdReceivedQtySubset)) {
        this[`${type}Data`].rdReceivedNetReceiptsQty = (this[`${type}Data`].rdReceivingQtySubset - this[`${type}Data`].rdReceivedQtySubset)
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('moreThanTheActualQuantityReceived')
        })
        return false
      }
      this.$vux.loading.show({
        text: 'Loading'
      })
      this[`${type}Data`].codeType = type
      if (this[`${type}Img`].length) {
        this.uploadImg(type)
      } else {
        this.doAjax(type)
      }
    },
    doAjax (type) {
      this[`${type}Data`].serverIds = this.uploadIds
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/receiving/confirmArrival`, qs.stringify({receivingWeixinDetailVo: JSON.stringify(this[`${type}Data`])}), {
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
          this[`${type}Img`] = []
          this[`${type}ImgIOS`] = []
          this.uploadIds = []
          this.searchDetail(type, type === 'sku' ? this[`${type}Data`].productBarcode : this[`${type}Data`].boxNo, this[`${type}Data`].receivingCode)
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
    boxDataboxNo () {
      this.toSearch('box')
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    margin-bottom: 7rem;
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
