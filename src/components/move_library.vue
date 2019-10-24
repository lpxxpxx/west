<template>
  <div class="container move-library">
    <div class="tab-swiper" v-show="index === 0">
      <div class="search search-first">
        <scan-input :name="$t('location')" :placeholder="lcCodeP ? lcCodeP : $t('scanTheBarcodeOfStorageLocationHere')" v-model="lcCode"></scan-input>
      </div>
      <div class="cheak">
        <check-icon :value.sync="isAll" type="plain">{{$t('moveAllSKUOfCurrentStorageLocation')}}</check-icon>
      </div>
      <div class="search">
        <scan-input :name="'SKU'" :placeholder="$t('scanTheSKUBarCodeHere')" :disabled="isAll ? 'disabled' : false" v-model="productBarcode"></scan-input>
      </div>
      <div class="search search-plus" v-show="productBarcodeS && productBarcodeS !== productBarcode">
          <span>{{$t('productBarcode')}}：</span>
          <span class="underline name" title="">{{productBarcodeS}}</span>
      </div>
      <div class="search">
        <scan-input :name="$t('newLocation')" :placeholder="lcCodeNewP ? lcCodeNewP : $t('scanTheBarcodeOfStorageLocationHere')" v-model="lcCodeNew"></scan-input>
      </div>
      <div class="search search-last">
        <span class="label">{{$t('theNumber')}}</span>
        <input type="text" v-model="quantity" :disabled="isAll ? 'disabled' : false" placeholder="" v-select-val />
      </div>
      <div class="photo">
        <span class="label">{{$t('takePhotos')}}</span>
        <input class="img hidden" @change="changeImg()" type="file" name="cover" ref="inputer" accept="image/*" capture="camera" multiple/>
        <span class="photo-cont">
          <span class="img-con" v-for="(item, index) in $store.getters.getPhoneType === 'IOS' ? skuImgIOS :skuImg" :key="index">
            <img :src="item" @click="previewImg(index)" preview="1">
            <span class="delete-icon" @click="deleteImg(index)">x</span>
          </span>
          <span class="iconfont icon-camera" @click="chooseImage()" v-show="skuImg.length <= 2"></span>
        </span>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native.stop="submit(false)">{{$t('submit')}}</x-button>
            <x-button :gradients="['#ff0000', '#ff0000']" @click.native="showExceptionMenus = true" v-if="aid">{{$t('exception')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
      <div>
        <actionsheet :menus="exceptionMenus" v-model="showExceptionMenus" @on-click-menu="exception"></actionsheet>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="confirmShow"
      :title="$t('confirmNewLocation')"
      :confirm-text="$t('confirm')"
      :cancel-text="$t('cancel')"
      @on-confirm="submit(true)">
        <p style="text-align:center;">{{ $t('DoesContinue') }}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem, CheckIcon, Actionsheet, Confirm, TransferDomDirective as TransferDom } from 'vux'
import qs from 'Qs'

export default {
  name: 'moveLibrary',
  directives: {
    TransferDom
  },
  components: {
    XButton,
    Flexbox,
    FlexboxItem,
    CheckIcon,
    Actionsheet,
    Confirm
  },
  mounted () {
    let query = this.$route.query || {}
    this.productBarcode = query.productBarcode
    this.lcCodeP = query.lcCode
    this.lcCodeNewP = query.lcCodeNew
    this.quantity = query.quantity
    this.aid = query.aid
    this.isTask = !(query.aid === '')
  },
  data () {
    return {
      index: 0,
      isAll: true,
      isTask: false,
      confirmShow: false,
      productBarcode: '',
      productBarcodeS: '',
      lcCode: '',
      lcCodeP: '',
      lcCodeNew: '',
      lcCodeNewP: '',
      quantity: 0,
      aid: '',
      timeoutId: '',
      warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId,
      showExceptionMenus: false,
      skuImg: [],
      skuFiles: [],
      skuImgIOS: [],
      uploadIds: [],
      exceptionMenus: {
        '源库位为空 / SOURCE LOCATION IS EMPTY': this.$t('sourceLocationIsEmpty'),
        '目标库位有货 / TO LOCATION IS NOI EMPTY': this.$t('toLocationIsNotEmpty'),
        '源库位混SKU / SOURCE LOCATION IS MIXED': this.$t('sourceLocationIsMixed'),
        '源库位SKU不一致 / FROM LOCATION IS DIFFERENT SKU': this.$t('fromLocationIsDifferentSKU')
      }
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    reset () {
      this.isAll = false
      this.isTask = false
      this.productBarcode = ''
      this.productBarcodeS = ''
      this.lcCode = ''
      this.lcCodeP = ''
      this.lcCodeNew = ''
      this.lcCodeNewP = ''
      this.quantity = 0
      this.aid = ''
      this.skuImg = []
      this.skuFiles = []
      this.skuImgIOS = []
      this.uploadIds = []
    },
    setVal (res) {
      this.lcCode = res.data.lcCode
      this.lcCodeNew = res.data.lcCodeNew
      this.productBarcodeS = res.data.productBarcode
      this.quantity = res.data.quantity
      this.aid = res.data.aid
      this.warehouseId = res.data.warehouseId
      this.productId = res.data.productId
    },
    loadDetail () {
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/inventory/queryMoveWarehouseTask`, {
        params: {
          productBarcode: this.productBarcode,
          warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId,
          lcCode: this.lcCode,
          lcCodeNew: this.lcCodeNew
        }})
      .then(res => {
        this.productBarcodeS = ''
        if (res.data.aid) {
          if (this.isTask) {
            if (Number(this.aid) === Number(res.data.aid)) {
              this.setVal(res)
            } else {
              this.$vux.toast.show({
                type: 'text',
                text: this.$t('confirmLocation')
              })
              return false
            }
          } else {
            this.setVal(res)
          }
        }
      })
      .catch(res => {
        alert(this.$t('businessSystemException'))
      })
    },
    toSearch () {
      if (this.lcCode !== '' && this.lcCodeNew !== '' && this.productBarcode !== '') {
        let that = this
        clearTimeout(that.timeoutId)
        that.timeoutId = setTimeout(function () {
          if (!that.isTask && that.productBarcode && that.lcCode && that.lcCodeNew) that.loadDetail()
        }, 1000)
      }
    },
    submit (flag = false) {
      if (!this.lcCode) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterTheLocation')
        })
        return false
      }
      if (this.lcCodeP && this.lcCodeP.toUpperCase() !== this.lcCode.toUpperCase()) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('confirmLocation')
        })
        return false
      }
      if (!this.lcCodeNew) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterNewLocation')
        })
        return false
      }
      if (!this.isAll) {
        if (!this.productBarcode) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('pleaseEnterTheSKU')
          })
          return false
        }
        let reg = /^[1-9]\d{0,4}$/
        if (!reg.test(Number(this.quantity)) || Number(this.quantity) === 0) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('pleaseEnterTheCorrectQuantity')
          })
          return false
        }
      }
      if (!flag) {
        if (this.lcCodeNewP && this.lcCodeNewP.toUpperCase() !== this.lcCodeNew.toUpperCase()) {
          this.confirmShow = true
          return false
        }
      }
      this.$vux.loading.show({
        text: 'Loading'
      })
      // eslint-disable-next-line
      if (document.querySelector('#requestTerminal') && document.querySelector('#requestTerminal').value !== 'PC' && this.skuImg.length) {
        this.uploadImg()
      } else {
        this.doAjax()
      }
    },
    doAjax () {
      let query = {
        moveType: this.isAll ? 'All' : 'Part',
        productBarcode: this.productBarcode,
        quantity: this.isAll ? '' : this.quantity,
        lcCode: this.lcCode.toUpperCase(),
        lcCodeNew: this.lcCodeNew.toUpperCase(),
        aid: this.aid,
        warehouseId: this.warehouseId,
        productId: this.productId,
        serverIds: this.uploadIds,
        userEmail: window.localStorage.getItem('userEmail'),
        language: window.localStorage.getItem('lang') || 'cn'
      }
      let form = new FormData()
      for (let i in query) {
        if (query[i]) {
          if (typeof (query[i]) === 'string') {
            query[i] = query[i]
          }
          form.append(i, query[i])
        }
      }
      if (this.skuFiles.length) {
        for (let i = 0; i <= this.skuFiles.length - 1; i++) {
          form.append('files', this.skuFiles[i] || '')
        }
      }
      /* this.axios.post(`${this.$store.getters.getUrl}/weixinapi/inventory/moveWarehouse`, qs.stringify(query), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }) */
      const instance = this.axios.create({
        async: true,
        crossDomain: true,
        withCredentials: true
      })
      instance.post(`${this.$store.getters.getUrl}/weixinapi/inventory/moveWarehouse`, form, {
        headers: {
          'Content-type': 'multipart/form-data'
        }
      })
      .then(res => {
        this.$vux.loading.hide()
        if (res.data.success) {
          this.$vux.toast.show({
            type: 'text',
            text: res.data.message
          })
          this.reset()
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
    exception (menuKey) {
      let query = {
        aid: this.aid,
        errorReason: menuKey
      }
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/inventory/moveWarehouseException`, qs.stringify(query), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this.$vux.loading.hide()
        if (res.data.success) {
          this.$vux.toast.show({
            type: 'text',
            text: res.data.message
          })
          this.reset()
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
    chooseImage () {
      if (document.querySelector('#requestTerminal') && document.querySelector('#requestTerminal').value !== 'PC') {
        let that = this
        let count = 3 - that.skuImg.length
        // eslint-disable-next-line
        wx.chooseImage({
          count: count,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            that.skuImg = [...that.skuImg, ...res.localIds]
            if (this.$store.getters.getPhoneType === 'IOS') {
              that.skuImg.forEach((item, index) => {
                that.getLocalImgData(item, index)
              })
            }
          }
        })
      } else {
        document.querySelector(`.img`).click()
      }
    },
    getLocalImgData (item, index) {
      let that = this
      // eslint-disable-next-line
      wx.getLocalImgData({
        localId: 'item',
        success: function (res) {
          that.skuImgIOS[index] = res.localData
        }
      })
    },
    deleteImg (index) {
      this.skuImg.splice(index, 1)
      this.skuImgIOS.splice(index, 1)
      if (this.skuFiles) {
        this.skuFiles.splice(index, 1)
      }
    },
    previewImg (index) {
      let that = this
      try {
        // eslint-disable-next-line
        wx.previewImage({
          current: that.skuImg[index],
          urls: that.skuImg
        })
      } catch (err) {
        console.log('On dev mode!')
      }
    },
    uploadImg () {
      let that = this
      if (!that.skuImg.length) {
        that.doAjax()
      } else {
        let localId = that.skuImg.pop()
        // eslint-disable-next-line
        wx.uploadImage({
          localId: localId,
          success: function (res) {
            that.uploadIds.push(res.serverId)
            that.uploadImg()
          }
        })
      }
    },
    changeImg () {
      let that = this
      let inputDOM = this.$refs.inputer
      let inputFile = inputDOM.files
      let exit = that[`skuImg`].length
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
        that.skuFiles.push(item)
        reader.onload = (function (theFile) {
          return function (e) {
            that.skuImg.push(e.target.result)
            that.$previewRefresh()
          }
        })(item)
        reader.readAsDataURL(item)
      }
      inputDOM.value = ''
    }
  },
  watch: {
    lcCode () {
      this.toSearch()
    },
    lcCodeNew () {
      this.toSearch()
    },
    productBarcode () {
      this.toSearch()
    }
  }
}
</script>

<style lang="less" scoped>
  .search {
    padding: 0 1rem 10px;
    height: 3rem;
    line-height: 3rem;
    display: flex;
    .label {
      margin-right: .5rem;
      font-size: 1.5rem;
      text-align: right;
    }
    input {
      flex: 1;
      padding: 0 .5rem;
    }
  }
  .search-plus {
    padding: 0 1rem;
    margin-top: -.5rem;
  }
  .search.search-first {
    padding-top: 1rem; 
  }
  .search.search-last {
    padding-top: 0; 
  }
  .cheak {
    padding: 0 1rem 10px;
    margin-left: 3rem;
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
    padding: 0 1rem;
  }
</style>
