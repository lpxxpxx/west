<template>
  <div class="container">
    <!-- <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">{{$t('accordingToTheSKUReceiving')}}</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">{{$t('accordingToTheCasesOfReceiving')}}</tab-item>
    </tab> -->
    <div class="tab-swiper" v-show="index === 0">
      <div class="info clearfloat">
        <div class="info-detail">
          <span class="label">{{$t('trakcingNo')}}：</span> 
          <span class="underline name" title="">{{editData.trackingNumber}}</span>
        </div>
        <div class="info-detail">
          <span class="label">{{$t('type')}}：</span> 
          <span class="underline name" title="">{{editData.spoTypeText}}</span>
        </div>
        <div class="info-detail">
          <span class="label">SKU*{{$t('theNumber')}}：</span> 
          <span class="underline name" title="">
            <p v-for="(item, index) in editData.specialOrdersProductList" :key="index">{{item.productBarcode}} * {{item.sopQuantity}}</p>
          </span>
        </div>
        <div class="info-detail">
          <span class="label">{{$t('refNo')}}：</span> 
          <span class="underline name" title="">{{editData.spoCode}}</span>
        </div>
        <div class="search search-last">
          <scan-input :name="'SKU'" :placeholder="$t('scanTheSKUOnTheShippingMarkHere')" v-model="editData.productBarcode"></scan-input>
        </div>
        <div class="total">
          <span class="pull-left">{{$t('forecastTheNumberOf')}}： <span class="underline">{{editData.sopQuantity || 0}}</span></span>
          <span class="pull-right">{{$t('numberOfReceived')}}： <span class="underline">{{editData.sopReceivedQty || 0}}</span></span>
        </div>
      </div>
      <div class="search">
        <span class="label" style="width: 11rem">{{$t('quantityReceivedThisTime')}}</span>
        <input type="number" placeholder="0" v-model="editData.rdReceivedNetReceiptsQty" v-select-val />
      </div>
      <div class="search search-last">
        <scan-input :name="$t('location')" :placeholder="$t('scanTheBarcodeOfStorageLocationHere')" v-model="editData.lcCode"></scan-input>
      </div>
      <div class="selector">
        <group>
          <selector v-model="editData.exception" :title="$t('exception')" :options="exceptionList"></selector>
        </group>
      </div>
      <div class="photo">
        <span class="label">{{$t('takePhotos')}}</span>
        <input class="edit-img hidden" @change="changeImg('edit')" type="file" name="cover" ref="editinputer" accept="image/*" capture="camera" multiple/>
        <span class="photo-cont">
          <span class="img-con" v-for="(item, index) in $store.getters.getPhoneType === 'IOS' ? editImgIOS : editImg" :key="index">
            <img :src="item" @click="previewImg('edit', index)">
            <span class="delete-icon" @click="deleteImg('edit', index)">x</span>
          </span>
          <span class="iconfont icon-camera" @click="chooseImage('edit')" v-show="editImg.length <= 2"></span>
        </span>
      </div>
      <div class="button">
        <flexbox>
          <!-- <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('edit')">{{$t('reset')}}</x-button>
          </flexbox-item> -->
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native.stop="submit('edit')">{{$t('confirm')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div class="tab-swiper" v-show="index === 1">
      <div class="search">
        <span class="label" style="width: 100%">{{$t('notMatchItemProcessing')}}:</span>
      </div>
      <div class="search">
        <scan-input :name="$t('trakcingNo')" :placeholder="$t('scanTrakcingNobarcode')" v-model="newData.trackingNumber"></scan-input>
      </div>
      <div class="search">
        <scan-input :name="'SKU'" :placeholder="$t('scanTheSKUOnTheShippingMarkHere')" v-model="newData.productBarcode"></scan-input>
      </div>
      <div class="search">
        <scan-input :name="$t('location')" :placeholder="$t('scanTheBarcodeOfStorageLocationHere')" v-model="newData.lcCode"></scan-input>
      </div>
      <div class="search">
        <span class="label" style="width: 11rem">{{$t('quantityReceivedThisTime')}}</span>
        <input type="number" placeholder="0" v-model="newData.rdReceivedNetReceiptsQty" style="width: 9rem" v-select-val />
      </div>
      <div class="selector">
        <group>
          <selector v-model="newData.exception" :title="$t('exception')" :options="exceptionList"></selector>
        </group>
      </div>
      <div class="photo">
        <span class="label">{{$t('takePhotos')}}</span>
        <input class="new-img hidden" @change="changeImg('new')" type="file" name="cover" ref="newinputer" accept="image/*" capture="camera" multiple/>
        <span class="photo-cont">
          <span class="img-con" v-for="(item, index) in $store.getters.getPhoneType === 'IOS' ? newImgIOS :newImg" :key="index">
            <img :src="item" @click="previewImg('new', index)">
            <span class="delete-icon" @click="deleteImg('new', index)">x</span>
          </span>
          <span class="iconfont icon-camera" @click="chooseImage('new')" v-show="newImg.length <= 2"></span>
        </span>
      </div>
      <div class="button">
        <flexbox>
          <!-- <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('new')">{{$t('reset')}}</x-button>
          </flexbox-item> -->
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native.stop="submit('new')">{{$t('confirm')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div class="tab-swiper" v-show="index === 2">
      <div class="info clearfloat">
        <div class="info-detail">
          <span class="label">{{$t('trakcingNo')}}：</span> 
          <span class="underline name" title="">{{editData.trackingNumber}}</span>
        </div>
        <div class="info-detail">
          <span class="label">{{$t('type')}}：</span> 
          <span class="underline name" title="">{{editData.spoTypeText}}</span>
        </div>
        <div class="info-detail">
          <span class="label">SKU*{{$t('theNumber')}}：</span> 
          <span class="underline name" title="">
            <p v-for="(item, index) in editData.specialOrdersProductList" :key="index">{{item.productBarcode}} * {{item.sopQuantity}}</p>
          </span>
        </div>
        <div class="info-detail">
          <span class="label">{{$t('refNo')}}：</span> 
          <span class="underline name" title="">{{editData.spoCode}}</span>
        </div>
      </div>
      <div class="button">
        <flexbox>
          <!-- <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('edit')">{{$t('reset')}}</x-button>
          </flexbox-item> -->
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native.stop="back()">{{$t('back')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem, Selector, Group } from 'vux'
import qs from 'Qs'

export default {
  name: 'receiving',
  components: {
    XButton,
    Flexbox,
    FlexboxItem,
    Selector,
    Group
  },
  mounted () {
    let query = this.$route.query || {}
    if (query.spoType === '10') {
      this.index = 2
      this.editData = this.$store.getters.getTemporary
    } else if (query.spoType !== '0') {
      this.index = 0
      this.editData = this.$store.getters.getTemporary
    } else {
      this.newData.trackingNumber = this.$store.getters.getTemporary.trackingNumber
      this.index = 1
    }
  },
  computed: {
    newDataboxNo () {
      return this.newData.boxNo
    }
  },
  data () {
    return {
      index: 0,
      timeoutId: '',
      editData: {
        spoType: '',
        productBarcode: '',
        rdReceivedNetReceiptsQty: 0,
        receivingQtyList: [{}]
      },
      editImg: [],
      editImgIOS: [],
      newImg: [],
      newImgIOS: [],
      newData: {
        spoType: '',
        productBarcode: '',
        trackingNumber: ''
      },
      oldeditData: {
        spoType: '',
        productBarcode: '',
        rdReceivedNetReceiptsQty: 0,
        receivingQtyList: [{}]
      },
      oldnewData: {
        spoType: '',
        productBarcode: '',
        trackingNumber: ''
      },
      uploadIds: [],
      exceptionList: [
        {key: '', value: this.$t('pleaseSelectTheCauseOfTheException')},
        {key: '1', value: this.$t('packagingDamage')},
        {key: '2', value: this.$t('goodsDamage')}
      ]
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    searchDetail (type) {
      let params = {
        productSku: this[`${type}Data`].productBarcode,
        warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId,
        spoCode: this[`${type}Data`].spoCode
      }
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/returnOrder/returnOrdersDetailSearch`, qs.stringify(params), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        if (res.data.success) {
          if (res.data.data) {
            this[`${type}Data`].sopQuantity = res.data.data.sopQuantity
            this[`${type}Data`].sopReceivedQty = res.data.data.sopReceivedQty
            this[`${type}Data`].rdReceivedNetReceiptsQty = 0
          } else {
            this[`${type}Data`].sopQuantity = 0
            this[`${type}Data`].sopReceivedQty = 0
            this[`${type}Data`].rdReceivedNetReceiptsQty = 0
            if (res.data.message) {
              this.$vux.toast.show({
                type: 'text',
                text: res.data.message
              })
            } else {
              this.$vux.toast.show({
                type: 'text',
                text: this.$t('mismatch')
              })
            }
          }
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('mismatch')
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
    reset (type) {
      this[`${type}Data`] = JSON.parse(JSON.stringify(this[`old${type}Data`]))
    },
    submit (type) {
      if (type === 'new') {
        if (!this[`${type}Data`].trackingNumber) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('pleaseEnterTheTrakcingNo')
          })
          return false
        }
      }
      let reg = /^[1-9]\d{0,4}$/
      if (!reg.test(Number(this[`${type}Data`].rdReceivedNetReceiptsQty)) || Number(this[`${type}Data`].rdReceivedNetReceiptsQty) === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterTheCorrectQuantity')
        })
        return false
      }
      /* if (Number(this[`${type}Data`].rdReceivedNetReceiptsQty) >= Number(this[`${type}Data`].sopQuantity) - Number(this[`${type}Data`].sopReceivedQty)) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('moreThanTheActualQuantityReceived')
        })
        return false
      } */
      if (!this[`${type}Data`].lcCode) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterTheLocation')
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
      this.$vux.loading.show({
        text: 'Loading'
      })
      this[`${type}Data`].codeType = type
      // eslint-disable-next-line
      if (document.querySelector('#requestTerminal') && document.querySelector('#requestTerminal').value !== 'PC' && this[`${type}Img`].length) {
        this.uploadImg(type)
      } else {
        this.doAjax(type)
      }
    },
    doAjax (type) {
      let params = {
        warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId,
        warehouseCode: JSON.parse(window.localStorage.getItem('warehouse')).warehouseCode,
        trackingNumber: this[`${type}Data`].trackingNumber,
        productBarcode: this[`${type}Data`].productBarcode,
        quantity: this[`${type}Data`].rdReceivedNetReceiptsQty,
        lcCode: this[`${type}Data`].lcCode,
        exception: this[`${type}Data`].exception,
        serverIds: this.uploadIds
      }
      let url = ''
      if (type === 'edit') {
        params = {
          productId: this[`${type}Data`].productId,
          type: this[`${type}Data`].spoType,
          relateOrderCode: this[`${type}Data`].spoCode,
          ...params
        }
        url = '/weixinapi/returnOrder/insertScanningList'
      } else {
        url = '/weixinapi/returnOrder/insertReturnClaimOrder'
      }
      // eslint-disable-next-line
      if (document.querySelector('#requestTerminal') && document.querySelector('#requestTerminal').value === 'PC') {
        params.img = this[`${type}Img`]
      }
      this.axios.post(`${this.$store.getters.getUrl}${url}`, qs.stringify(params), {
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
    back () {
      this.$router.go(-1)
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
        console.log(111)
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
        reader.onload = (function (theFile) {
          return function (e) {
            that[`${type}Img`].push(e.target.result)
          }
        })(item)
        reader.readAsDataURL(item)
      }
      inputDOM.value = ''
    }
  },
  watch: {
    'editData.productBarcode' () {
      if (this.editData.productBarcode) {
        this.toSearch('edit')
      }
    },
    'newData.trackingNumber' () {
      let that = this
      clearTimeout(that.timeoutId)
      that.timeoutId = setTimeout(function () {
        if (that.newData.trackingNumber && that.newData.trackingNumber.length === 34) {
          /* FEDEX  条码扫出来的长度是34，系统长度是12 */
          that.newData.trackingNumber = that.newData.trackingNumber.substring(that.newData.trackingNumber.length - 12)
        } else if (that.newData.trackingNumber && that.newData.trackingNumber.length === 30) {
          /* FEDEX_SMARTPOST  条码扫出来的长度是30，系统长度是20 */
          that.newData.trackingNumber = that.newData.trackingNumber.substring(that.newData.trackingNumber.length - 20)
        }
      }, 1000)
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
    padding: 5px 1rem;
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
