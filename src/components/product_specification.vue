<template>
  <div class="container">
    <div class="search search-first">
        <scan-input :placeholder="$t('scanTheSKUBarCodeHere')" :name="'SKU'" v-model="data.productBarcode"></scan-input>
    </div>
    <div class="search search-plus" v-show="data.productBarcodeS && data.productBarcodeS !== data.productBarcode">
        <span>{{$t('productBarcode')}}：</span>
        <span class="underline name" title="">{{data.productBarcodeS}}</span>
    </div>
    <div class="search search-last" style="height: auto">
      <div class="info-detail">
        <span class="label">{{$t('theNameOfTheSKU')}}：</span> 
        <span class="underline name" title="">{{data.productTitleEn}}</span>
      </div>
    </div>
    <divider>{{$t('parameters')}}</divider>
    <div class="search search-first">
      <span class="label">{{$t('weight')}}</span>
      <input type="number" placeholder="0" v-model="data.productWeightLb" class="weight" v-enter-number v-select-val />
      <span class="type">{{$t(data.cloudWeightUnit || 'KG')}}</span>
    </div>
    <div class="search">
      <span class="label">{{$t('long')}}</span>
      <input type="number" placeholder="0" v-model="data.productLengthIn" v-enter-number v-select-val />
      <span class="type">{{$t(data.cloudSizeUnit || 'CM')}}</span>
    </div>
    <div class="search">
      <span class="label">{{$t('wide')}}</span>
      <input type="number" placeholder="0" v-model="data.productWidthIn" v-enter-number v-select-val />
      <span class="type">{{$t(data.cloudSizeUnit || 'CM')}}</span>
    </div>
    <div class="search search-last">
      <span class="label">{{$t('high')}}</span>
      <input type="number" placeholder="0" v-model="data.productHeightIn" v-enter-number v-select-val />
      <span class="type">{{$t(data.cloudSizeUnit || 'CM')}}</span>
    </div>
    <div class="photo" v-show="needPic">
      <span class="label">{{$t('takePhotosMust')}}</span>
      <input id="img" class="img hidden" @change="changeImg()" type="file" name="cover" ref="inputer" accept="image/*" capture="camera" multiple/>
      <span class="photo-cont">
        <span class="img-con" v-for="(item, index) in img" :key="index">
          <img :src="item" @click="previewImg(index)" preview="1">
          <span class="delete-icon" @click="deleteImg(index)">x</span>
        </span>
        <span class="iconfont icon-camera" @click="chooseImage()" v-show="img.length <= 2"></span>
      </span>
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
</template>

<script>
import { XButton, Flexbox, FlexboxItem, Divider } from 'vux'
/* import qs from 'Qs' */

export default {
  name: 'productSpecification',
  components: {
    XButton,
    Flexbox,
    FlexboxItem,
    Divider
  },
  mounted () {
    let query = this.$route.query || {}
    this.data.productBarcode = query.productBarcode
  },
  data () {
    return {
      index: 0,
      timeoutId: '',
      data: {
        productBarcode: '',
        productBarcodeS: '',
        productTitleEn: '',
        productLengthIn: 0,
        productWidthIn: 0,
        productHeightIn: 0,
        productWeightLb: 0,
        productLength: 0,
        productWidth: 0,
        productHeight: 0,
        productWeight: 0
      },
      oldData: {
        productBarcode: '',
        productBarcodeS: '',
        productTitleEn: '',
        productLengthIn: 0,
        productWidthIn: 0,
        productHeightIn: 0,
        productWeightLb: 0,
        productLength: 0,
        productWidth: 0,
        productHeight: 0,
        productWeight: 0
      },
      needPic: false,
      img: [],
      files: [],
      imgIOS: [],
      uploadIds: []
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    reset (type) {
      this.data = JSON.parse(JSON.stringify(this.oldData))
      this.img = []
      this.imgIOS = []
      this.uploadIds = []
    },
    searchDetail () {
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/product/productSkuAttr`, {
        params: {
          warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId,
          productBarcode: this.data.productBarcode || ''
        }
      })
      .then(res => {
        if (res.data.productBarcode) {
          res.data.productBarcodeS = res.data.productBarcode
          res.data.productBarcode = this.data.productBarcode
          this.data = res.data
          this.oldData = JSON.parse(JSON.stringify(res.data))
        } else {
          this.data.productBarcodeS = ''
          this.data.productTitleEn = ''
          this.data.productLengthIn = 0
          this.data.productWidthIn = 0
          this.data.productHeightIn = 0
          this.data.productWeightLb = 0
        }
      })
      .catch(res => {
        alert(this.$t('businessSystemException'))
      })
    },
    toSearch () {
      let that = this
      clearTimeout(that.timeoutId)
      that.timeoutId = setTimeout(function () {
        that.searchDetail()
      }, 1000)
    },
    submit (type) {
      /* let cloudSizeUnitRate = 0.3937008
      let cloudWeightUnitRate = 2.2046226 */
      /* if (!this.data.productId) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterTheCorrectSKU')
        })
        return false
      } */
      if (!this.data.productWeightLb || Number(this.data.productWeightLb) === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseInputProductWeight')
        })
        return false
      } else if (Number(this.data.productWeightLb) < 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseInputProductCorrectWeight')
        })
        return false
      }
      if (!this.data.productLengthIn || Number(this.data.productLengthIn) === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterProductLength')
        })
        return false
      } else if (Number(this.data.productLengthIn) < 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseInputProductCorrectLength')
        })
        return false
      }
      if (!this.data.productWidthIn || Number(this.data.productWidthIn) === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterProductWidth')
        })
        return false
      } else if (Number(this.data.productWidthIn) < 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseInputProductCorrectWidth')
        })
        return false
      }
      if (!this.data.productHeightIn || Number(this.data.productHeightIn) === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseEnterProductHeight')
        })
        return false
      } else if (Number(this.data.productHeightIn) < 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('pleaseInputProductCorrectHeight')
        })
        return false
      }
      if (this.needPic && this.img.length === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: this.$t('uploadAtLeastOneImage')
        })
        return false
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
      const submitData = {}
      submitData.productId = this.data.productId
      /* if (this.data.cloudSizeUnit === 'IN') {
        submitData.productLength = (this.data.productLength * cloudSizeUnitRate).toFixed(2)
        submitData.productWidth = (this.data.productWidth * cloudSizeUnitRate).toFixed(2)
        submitData.productHeight = (this.data.productHeight * cloudSizeUnitRate).toFixed(2)
      } else { */
      submitData.productLengthIn = this.data.productLengthIn
      submitData.productWidthIn = this.data.productWidthIn
      submitData.productHeightIn = this.data.productHeightIn
      /* }
      if (this.data.cloudWeightUnit === 'LB') {
        submitData.productWeight = (this.data.productWeight * cloudWeightUnitRate).toFixed(3)
      } else { */
      submitData.productWeightLb = this.data.productWeightLb
      submitData.cloudWeightUnit = this.data.cloudWeightUnit
      submitData.cloudSizeUnit = this.data.cloudSizeUnit
      /* } */
      submitData.serverIds = this.uploadIds
      submitData.warehouseId = JSON.parse(window.localStorage.getItem('warehouse')).warehouseId
      submitData.language = window.localStorage.getItem('lang') || 'cn'
      submitData.productBarcode = this.data.productBarcode
      submitData.userEmail = window.localStorage.getItem('userEmail')
      submitData.pwaId = this.data.pwaId
      const form = new FormData()
      for (let i in submitData) {
        if (submitData[i]) {
          if (typeof (submitData[i]) === 'string') {
            submitData[i] = submitData[i]
          }
          form.append(i, submitData[i])
        }
      }
      if (this.needPic && this.files.length) {
        for (let i = 0; i <= this.files.length - 1; i++) {
          form.append('files', this.files[i] || '')
        }
      }
      /* this.axios.post(`${this.$store.getters.getUrl}/weixinapi/product/updateAttr`, qs.stringify(submitData), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }) */
      const instance = this.axios.create({
        async: true,
        crossDomain: true,
        withCredentials: true
      })
      instance.post(`${this.$store.getters.getUrl}/weixinapi/product/updateAttr`, form, {
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
          this.data.productBarcode = ''
          this.data.productTitleEn = ''
          this.data.productLengthIn = 0
          this.data.productWidthIn = 0
          this.data.productHeightIn = 0
          this.data.productWeightLb = 0
          this.oldData = JSON.parse(JSON.stringify(this.data))
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
    },
    overSize (type) {
      if (this.data.pwaId) {
        let flag = false
        let unit = 0
        const arr = ['Weight', 'Length', 'Width', 'Height']
        arr.forEach(type => {
          switch (type) {
            case 'Weight':
              unit = this.data.cloudWeightUnit === 'KG' ? this.data[`product${type}Lb`] : this.data[`product${type}Lb`] / 2.2046226
              flag = Math.abs(unit - this.oldData[`product${type}`]) > 2.2 ? true : flag
              break
            case 'Length':
            case 'Width':
            case 'Height':
              unit = this.data.cloudSizeUnit === 'CM' ? this.data[`product${type}In`] : this.data[`product${type}In`] / 0.3937008
              flag = Math.abs(unit - this.oldData[`product${type}`]) > 5 ? true : flag
          }
        })
        this.needPic = flag
      }
    },
    chooseImage () {
      if (document.querySelector('#requestTerminal') && document.querySelector('#requestTerminal').value !== 'PC') {
        let that = this
        let count = 3 - that.img.length
        // eslint-disable-next-line
        wx.chooseImage({
          count: count,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            that.img = [...that.img, ...res.localIds]
            if (this.$store.getters.getPhoneType === 'IOS') {
              that.img.forEach((item, index) => {
                that.getLocalImgData(item, index)
              })
            }
          }
        })
      } else {
        document.querySelector(`#img`).click()
      }
    },
    getLocalImgData (item, index) {
      let that = this
      // eslint-disable-next-line
      wx.getLocalImgData({
        localId: 'item',
        success: function (res) {
          that.imgIOS[index] = res.localData
        }
      })
    },
    deleteImg (index) {
      this.img.splice(index, 1)
      this.imgIOS.splice(index, 1)
      if (this.files) {
        this.files.splice(index, 1)
      }
    },
    previewImg (index) {
      let that = this
      try {
        // eslint-disable-next-line
        wx.previewImage({
          current: that.img[index],
          urls: that.img
        })
      } catch (err) {
        console.log('On dev mode!')
      }
    },
    uploadImg () {
      let that = this
      if (!that.img.length) {
        that.doAjax()
      } else {
        let localId = that.img.pop()
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
      let exit = that[`img`].length
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
        that.files.push(item)
        reader.onload = (function (theFile) {
          return function (e) {
            that.img.push(e.target.result)
            that.$previewRefresh()
          }
        })(item)
        reader.readAsDataURL(item)
      }
      inputDOM.value = ''
    }
  },
  watch: {
    'data.productBarcode' () {
      this.toSearch()
    },
    'data.productWeightLb' () {
      this.overSize()
    },
    'data.productLengthIn' () {
      this.overSize()
    },
    'data.productWidthIn' () {
      this.overSize()
    },
    'data.productHeightIn' () {
      this.overSize()
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    margin-bottom: 7rem;
  }
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
    input[type='number'] {
      text-align: right;
    }
    .type {
      width: 2rem;
      margin-left: .5rem;
      text-align: right;
    }
  }
  .search-plus {
    padding: 0 1rem;
    margin-top: -.5rem;
  }
  .name {
    flex: 1;
    font-size: 1.5rem;
    text-overflow: ellipsis;
  }
  .search.search-first {
    padding-top: 1rem; 
  }
  .search.search-last {
    padding-top: 0; 
  }
  .button {
    position: fixed;
    padding: 1rem 1rem;
    bottom: 3rem;
    width: 100%;
    box-sizing: border-box;
    background: #fbf9fe;
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
</style>
