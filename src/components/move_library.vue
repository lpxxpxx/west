<template>
  <div class="container move-library">
    <div class="tab-swiper" v-show="index === 0">
      <div class="search search-first">
        <scan-input :name="$t('location')" :placeholder="$t('scanTheBarcodeOfStorageLocationHere')" v-model="lcCode"></scan-input>
      </div>
      <div class="cheak">
        <check-icon :value.sync="isAll" type="plain">{{$t('moveAllSKUOfCurrentStorageLocation')}}</check-icon>
      </div>
      <div class="search">
        <scan-input :name="'SKU'" :placeholder="$t('scanTheSKUBarCodeHere')" :disabled="isAll ? 'disabled' : false" v-model="productBarcode"></scan-input>
      </div>
      <div class="search">
        <span class="label">{{$t('theNumber')}}</span>
        <input type="text" v-model="quantity" :disabled="isAll ? 'disabled' : false" placeholder="" />
      </div>
      <div class="search search-last">
        <scan-input :name="$t('newLocation')" :placeholder="$t('scanTheBarcodeOfStorageLocationHere')" v-model="lcCodeNew"></scan-input>
      </div>
      <div class="photo">
        <span class="label">{{$t('takePhotos')}}</span>
        <span class="photo-cont">
          <span class="img-con" v-for="(item, index) in $store.getters.getPhoneType === 'IOS' ? skuImgIOS :skuImg" :key="index">
            <img :src="item" @click="previewImg(index)">
            <span class="delete-icon" @click="deleteImg(index)">x</span>
          </span>
          <span class="iconfont icon-camera" @click="chooseImage()" v-show="skuImg.length <= 2"></span>
        </span>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native="submit">{{$t('submit')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem, CheckIcon } from 'vux'
import qs from 'Qs'

export default {
  name: 'moveLibrary',
  components: {
    XButton,
    Flexbox,
    FlexboxItem,
    CheckIcon
  },
  mounted () {
    let query = this.$route.query || {}
    this.productBarcode = query.productBarcode
    this.lcCode = query.lcCode
    this.lcCodeNew = query.lcCodeNew
    this.loadDetail()
  },
  data () {
    return {
      index: 0,
      isAll: false,
      productBarcode: '',
      lcCode: '',
      lcCodeNew: '',
      quantity: 0,
      aid: '',
      timeoutId: '',
      skuImg: [],
      skuImgIOS: [],
      uploadIds: []
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    loadDetail () {
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/inventory/queryMoveWarehouseTask`, {
        params: {
          productBarcode: this.productBarcode,
          warehouseId: this.$store.getters.getWarehouse.warehouseId,
          lcCode: this.lcCode,
          lcCodeNew: this.lcCodeNew
        }})
      .then(res => {
        if (res.data.aid) {
          this.lcCode = res.data.lcCode
          this.lcCodeNew = res.data.lcCodeNew
          this.productBarcode = res.data.productBarcode
          this.quantity = res.data.quantity
          this.aid = res.data.aid
          this.warehouseId = this.$store.getters.getWarehouse.warehouseId
          this.productId = res.data.productId
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
          that.loadDetail()
        }, 1000)
      }
    },
    submit () {
      if (!this.lcCode) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterTheLocation')
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
      this.$vux.loading.show({
        text: 'Loading'
      })
      if (this.skuImg.length) {
        this.uploadImg()
      } else {
        this.doAjax()
      }
    },
    doAjax () {
      let query = {
        moveType: this.isAll ? 'All' : 'Part',
        productBarcode: this.productBarcode,
        quantity: this.quantity,
        lcCode: this.lcCode,
        lcCodeNew: this.lcCodeNew,
        aid: this.aid,
        warehouseId: this.warehouseId,
        productId: this.productId,
        serverIds: this.uploadIds
      }
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/inventory/moveWarehouse`, qs.stringify(query), {
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
          this.isAll = false
          this.productBarcode = ''
          this.lcCode = ''
          this.lcCodeNew = ''
          this.quantity = 0
          this.aid = ''
          this.skuImg = []
          this.skuImgIOS = []
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
    chooseImage () {
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
    },
    previewImg (index) {
      let that = this
      // eslint-disable-next-line
      wx.previewImage({
        current: that.skuImg[index],
        urls: that.skuImg
      })
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
      width: 5rem;
      text-align: right;
    }
    input {
      flex: 1;
      padding: 0 .5rem;
    }
  }
  .search.search-first {
    padding-top: 1rem; 
  }
  .search.search-last {
    padding-top: 0; 
  }
  .cheak {
    padding: 0 1rem 10px;
    margin-left: 5rem;
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
