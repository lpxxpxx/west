<template>
  <div class="photo">
    <span class="label">{{name}}</span>
    <input class="img hidden" @change="changeImg()" type="file" name="cover" ref="inputer" accept="image/*" capture="camera" multiple/>
    <span class="photo-cont">
      <span class="img-con" v-for="(item, index) in $store.getters.getPhoneType === 'IOS' ? skuImgIOS : skuImg" :key="index">
        <img :src="item" @click="previewImg(index)" preview="1">
        <span class="delete-icon" @click="deleteImg(index)">x</span>
      </span>
      <span class="iconfont icon-camera" @click="chooseImage()" v-show="skuImg.length <= 2"></span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'imgCont',
  data () {
    return {
      _img: this.value
    }
  },
  model: {
    prop: 'value',
    event: 'changev'
  },
  props: [ 'name', 'placeholder', 'disabled', 'autofocus', 'value' ],
  methods: {
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
    val () {
      this.$emit('changev', this.val)
    },
    value () {
      this.val = this.value
    }
  }
}
</script>

<style lang="less" scoped>
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
