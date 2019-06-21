<template>
  <div class="container">
    <tab :line-width=1>
      <tab-item :selected="index === 2" @on-item-click="changeIndex(2)">{{$t('shelfByTray')}}</tab-item>
      <tab-item :selected="index === 3" @on-item-click="changeIndex(3)">{{$t('accordingToTheLocationToCheck')}}</tab-item>
      <!-- <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">{{$t('hitSKU')}}</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">{{$t('shelfByCase')}}</tab-item> -->
    </tab>
    <div class="tab-swiper" v-show="index === 2">
      <div class="search">
        <scan-input :name="$t('trayNumber')" :placeholder="$t('scanTheTrayNumberHere')" v-model="trayData.trayCode"></scan-input>
      </div>
      <div class="search search-middle">
        <span class="label">SKU</span>
        <input type="text" disabled="disabled" v-model="trayData.productBarcode" v-select-val />
      </div>
      <div class="search search-last">
        <span class="label">{{$t('theNumber')}}</span>
        <input type="text" disabled="disabled" v-model="trayData.pdQuantity" v-select-val />
      </div>
      <p class="error-info" v-show="trayData.trayCode && trayData.errorInfo">{{trayData.errorInfo}}</p>
      <div class="info clearfloat">
        <div class="info-detail">
          <span class="label">{{$t('theNameOfTheSKU')}}：</span> 
          <span class="underline name" title="">{{trayData.productTitleEn}}</span>
        </div>
        <div class="total">
          <span class="pull-left">{{$t('quantityReceived')}}： <span class="underline">{{trayData.rdbReceivedQty}}</span></span>
          <span class="pull-right">{{$t('quantityOnShelves')}}： <span class="underline">{{trayData.rdbPutawayQty}}</span></span>
        </div>
      </div>
      <div class="search">
        <scan-input :name="$t('location')" :placeholder="trayData.lcCodeP ? trayData.lcCodeP : $t('scanTheBarcodeOfStorageLocationHere')" v-model="trayData.lcCode"></scan-input>
      </div>
      <div class="photo">
        <span class="label">{{$t('takePhotos')}}</span>
        <input class="tray-img hidden" @change="changeImg('tray')" type="file" name="cover" ref="trayinputer" accept="image/*" capture="camera" multiple/>
        <span class="photo-cont">
          <span class="img-con" v-for="(item, index) in $store.getters.getPhoneType === 'IOS' ? trayImgIOS :trayImg" :key="index">
            <img :src="item" @click="previewImg('tray', index)" preview="2">
            <span class="delete-icon" @click="deleteImg('tray', index)">x</span>
          </span>
          <span class="iconfont icon-camera" @click="chooseImage('tray')" v-show="trayImg.length <= 2"></span>
        </span>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('tray')">{{$t('reset')}}</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native.stop="submit('tray')">{{$t('confirm')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div class="tab-swiper" v-show="index === 3">
      <div class="search">
        <scan-input :placeholder="$t('scanTheBarcodeOfStorageLocationHere')" :name="$t('location')" v-model="lcCode"></scan-input>
      </div>
      <div class="total">
        <span class="pull-left">{{$t('SKUType')}} <span class="underline">{{lcCodeCount}}</span></span>
        <span class="pull-right">{{$t('total')}} <span class="underline">{{lcCodeAll}}</span></span>
      </div>
      <div class="table">
        <x-table full-bordered>
          <thead>
            <tr>
              <th>SKU</th>
              <th>{{$t('available')}}</th>
              <th>{{$t('forOutbound')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in lcCodeData" :key="index">
              <td>{{item.productBarcode}}</td>
              <td>{{item.piSellable}}</td>
              <td>{{item.piReserved}}</td>
            </tr>
            <tr v-if="!haslcCode">
              <td colspan="3">{{$t('noMatchingRecordsWereFound')}}</td>
            </tr>
          </tbody>
        </x-table>
      </div>
    </div>
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
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native.stop="submit('sku')">{{$t('confirm')}}</x-button>
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
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native.stop="submit('boxNo')">{{$t('confirm')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XButton, Flexbox, XTable, FlexboxItem } from 'vux'
import ScanInput from './scan_input'
/* import qs from 'Qs' */

export default {
  name: 'upperShelf',
  components: {
    Tab,
    TabItem,
    XButton,
    Flexbox,
    XTable,
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
      index: 2,
      skuData: {
        receivingCode: '',
        productBarcode: '',
        lcCode: '',
        pdQuantity: '',
        errorInfo: ''
      },
      skuImg: [],
      skuFiles: [],
      skuImgIOS: [],
      boxNoData: {
        boxCode: '',
        productBarcode: '',
        lcCode: '',
        pdQuantity: '',
        errorInfo: ''
      },
      boxNoImg: [],
      boxNoFiles: [],
      boxNoImgIOS: [],
      trayData: {
        boxCode: '',
        productBarcode: '',
        lcCode: '',
        pdQuantity: '',
        errorInfo: ''
      },
      trayImg: [],
      trayFiles: [],
      trayImgIOS: [],
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
      oldtrayData: {
        boxCode: '',
        productBarcode: '',
        lcCode: '',
        pdQuantity: '',
        errorInfo: ''
      },
      uploadIds: [],
      lcCode: '',
      lcCodeCount: '',
      lcCodeAll: '',
      lcCodeData: [],
      haslcCode: false
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
      if (type === 'lcCode') {
        if (JSON.parse(window.localStorage.getItem('warehouse')).warehouseId === undefined) {
          this.$router.push('/')
          return false
        }
        /* let queryCode = type === 'sku' ? this.sku : this.lcCode */
        let queryCode = this.lcCode
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
            warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId,
            queryCode: queryCode
          }
        })
        .then(res => {
          if (res.data.success) {
            let all = 0
            let that = this
            this[`${type}Data`] = []
            this[`${type}Count`] = 0
            this[`${type}All`] = 0
            setTimeout(function () {
              that[`${type}Data`] = res.data.data.rows
              that[`${type}Count`] = [...new Set(res.data.data.rows.map(item => type === 'sku' ? item.lcCode : item.productBarcode))].length
              res.data.data.rows.forEach(item => {
                all += item.piSellable
              })
              that[`${type}All`] = all
              if (res.data.data.rows.length === 0) {
                that[`has${type}`] = false
              } else {
                that[`has${type}`] = true
              }
              that[`${type}ButtonShow`] = true
            }, 50)
          } else {
            this[`${type}Data`] = []
            this[`${type}Count`] = 0
            this[`${type}All`] = 0
            this[`${type}ButtonShow`] = false
          }
        })
        .catch(res => {
          alert(this.$t('businessSystemException'))
        })
      } else {
        this.axios.get(`${this.$store.getters.getUrl}/weixinapi/putaway/putawayDetail`, {
          params: {
            receivingCode: this[`${type}Data`].receivingCode,
            warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId,
            productBarcode: this[`${type}Data`].productBarcode,
            boxNo: this[`${type}Data`].boxCode,
            trayCode: this[`${type}Data`].trayCode,
            codeType: type
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            res.data.data.boxCode = this[`${type}Data`].boxCode
            this[`${type}Data`] = res.data.data
            if (type === 'sku') {
              this[`old${type}Data`] = JSON.parse(JSON.stringify(res.data.data))
            } else if (type === 'tray') {
              this[`${type}Data`].lcCodeP = res.data.data.lcCode
              this[`${type}Data`].lcCode = ''
            }
          } else {
            this[`${type}Data`].pdQuantity = 0
            this[`${type}Data`].productId = 0
            this[`${type}Data`].productTitleEn = ''
            this[`${type}Data`].rdbPutawayQty = 0
            this[`${type}Data`].rdbReceivedQty = 0
            this[`${type}Data`].errorInfo = res.data.message
            this[`${type}Data`].lcCodeP = ''
          }
        })
        .catch(res => {
          alert(this.$t('businessSystemException'))
        })
      }
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
      } else if (type === 'boxNo') {
        if (!this[`${type}Data`].boxCode) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('pleaseEnterTheCaseNumber')
          })
          return false
        }
      } else if (type === 'tray') {
        if (!this[`${type}Data`].trayCode) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('pleaseEnterTheTrayNumber')
          })
          return false
        }
        if (this[`${type}Data`].lcCodeP && this[`${type}Data`].lcCodeP !== this[`${type}Data`].lcCode) {
          let r = confirm(this.$t('confirmTray'))
          if (!r) return false
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
        if (type !== 'tray') {
          this[`${type}Data`].pdQuantity = (this[`${type}Data`].rdbReceivedQty - this[`${type}Data`].rdbPutawayQty)
        }
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('moreThanTheActualQuantityReceived')
        })
        return false
      }
      this[`${type}Data`].putawayType = type
      this.$vux.loading.show({
        text: 'Loading'
      })
      // eslint-disable-next-line
      if (document.querySelector('#requestTerminal') && document.querySelector('#requestTerminal').value !== 'PC' && this[`${type}Img`].length) {
        this.uploadImg(type)
      } else {
        this.doAjax(type)
      }
    },
    doAjax (type) {
      this[`${type}Data`].lcCode = this[`${type}Data`].lcCode.toUpperCase()
      let form = new FormData()
      for (let i in this[`${type}Data`]) {
        form.append(i, this[`${type}Data`][i] === null ? '' : this[`${type}Data`][i])
      }
      form.append('serverIds', this.uploadIds)
      form.set('userEmail', window.localStorage.getItem('userEmail'))
      form.append('language', window.localStorage.getItem('lang') || 'cn')
      if (this[`${type}Files`]) {
        for (let i = 0; i <= this[`${type}Files`].length - 1; i++) {
          form.append('files', this[`${type}Files`][i] || '')
        }
      }
      /* this.axios.post(`${this.$store.getters.getUrl}/weixinapi/putaway/doPutaway`, qs.stringify(this[`${type}Data`]), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }) */
      const instance = this.axios.create({
        async: true,
        crossDomain: true,
        withCredentials: true
      })
      instance.post(`${this.$store.getters.getUrl}/weixinapi/putaway/doPutaway`, form, {
        headers: {
          'Content-type': 'multipart/form-data'
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
          this[`${type}Files`] = []
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
      if (document.querySelector('#requestTerminal') && document.querySelector('#requestTerminal').value !== 'PC') {
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
      } else {
        document.querySelector(`.${type}-img`).click()
      }
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
      if (this[`${type}Files`]) {
        this[`${type}Files`].splice(index, 1)
      }
    },
    previewImg (type, index) {
      let that = this
      try {
        // eslint-disable-next-line
        wx.previewImage({
          current: that[`${type}Img`][index],
          urls: that[`${type}Img`]
        })
      } catch (err) {
        console.log('On dev mode!')
      }
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
    },
    changeImg (type) {
      let that = this
      let inputDOM = this.$refs[`${type}inputer`]
      let inputFile = inputDOM.files
      let exit = that[`${type}Img`].length
      if ((inputFile.length + exit) > 3) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('canOnlyUploadUpTo3Images')
        })
        inputDOM.value = ''
        return false
      }
      for (let i = 0; i <= inputFile.length - 1; i++) {
        let reader = new FileReader()
        let item = inputFile[i]
        that[`${type}Files`].push(item)
        reader.onload = (function (theFile) {
          return function (e) {
            that[`${type}Img`].push(e.target.result)
            that.$previewRefresh()
          }
        })(item)
        reader.readAsDataURL(item)
      }
      inputDOM.value = ''
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
    },
    'trayData.trayCode' () {
      if (this.trayData.trayCode) {
        this.toSearch('tray')
      }
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
      margin-right: 1rem;
    }
    input {
      flex: 1;
      padding: 0 .5rem;
    }
  }
  .search.search-middle {
    padding-top: 0;
    padding-bottom: 5px;
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
