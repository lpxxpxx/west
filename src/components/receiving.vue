<template>
  <div class="container">
    <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">按SKU收货</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">按箱收货</tab-item>
    </tab>
    <div class="tab-swiper" v-show="index === 0">
      <div class="search">
        <scan-input :name="'单号'" :placeholder="'此处扫描入库单号'" v-model="skuData.receivingCode"></scan-input>
      </div>
      <div class="search search-last">
        <scan-input :name="'SKU'" :placeholder="'此处扫描箱唛上的SKU'" v-model="skuData.productBarcode"></scan-input>
      </div>
      <div class="info clearfloat">
        <div class="info-detail">
          <span class="label">SKU名称：</span> 
          <span class="underline name" title="">{{skuData.productTitleEn}}</span>
        </div>
        <div class="total">
          <span class="pull-left">预报数量： <span class="underline">{{skuData.rdReceivingQtySubset || 0}}</span></span>
          <span class="pull-right">已收数量： <span class="underline">{{skuData.rdReceivedQtySubset || 0}}</span></span>
        </div>
      </div>
      <div class="size">
        <div class="size-item" style="width: 23%;">
          <input type="number" placeholder="0" v-model="skuData.productLength" style="width: calc(100% - 22px)" /><span style="width: 20px"> x </span>
        </div>
        <div class="size-item" style="width: 23%;">
          <input type="number" placeholder="0" v-model="skuData.productWidth" style="width: calc(100% - 22px)" /><span style="width: 20px"> x </span>
        </div>
        <div class="size-item" style="width: 27%;">
          <input type="number" placeholder="0" v-model="skuData.productHeight" style="width: calc(100% - 37px)" /><span style="width: 35px"> CM </span>
        </div>
        <div class="size-item" style="width: 27%;">
          <input type="number" placeholder="0" v-model="skuData.productWeight" style="width: calc(100% - 37px)" /><span style="width: 35px"> KG</span>
        </div>
      </div>
      <div class="search search-last">
        <span class="label" style="width: 10rem">本次收货数量</span>
        <input type="number" placeholder="0" v-model="skuData.rdReceivedNetReceiptsQty" />
      </div>
      <div class="photo">
        <span class="label">拍照（可选）</span>
        <span class="photo-cont">
          <span class="iconfont icon-camera" @click="chooseImage"></span>
        </span>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('sku')">重置</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native="submit('sku')">确认</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div class="tab-swiper" v-show="index === 1">
      <div class="search">
        <scan-input :name="'箱号'" :placeholder="'此处扫描箱唛上的箱号'" v-model="boxData.boxNo"></scan-input>
      </div>
      <div class="search search-last">
        <span class="label">SKU</span>
        <input type="text" disabled="disabled" v-model="boxData.productBarcode" />
      </div>
      <div class="info clearfloat">
        <div class="info-detail">
          <span class="label">SKU名称：</span> 
          <span class="underline name" title="">{{boxData.productTitleEn}}</span>
        </div>
        <div class="total">
          <span class="pull-left">预报数量： <span class="underline">{{boxData.rdReceivingQtySubset || 0}}</span></span>
          <span class="pull-right">已收数量： <span class="underline">{{boxData.rdReceivedQtySubset || 0}}</span></span>
        </div>
      </div>
      <div class="size">
        <div class="size-item" style="width: 23%;">
          <input type="number" placeholder="0" v-model="boxData.productLength" style="width: calc(100% - 22px)" /><span style="width: 20px"> x </span>
        </div>
        <div class="size-item" style="width: 23%;">
          <input type="number" placeholder="0" v-model="boxData.productWidth" style="width: calc(100% - 22px)" /><span style="width: 20px"> x </span>
        </div>
        <div class="size-item" style="width: 27%;">
          <input type="number" placeholder="0" v-model="boxData.productHeight" style="width: calc(100% - 37px)" /><span style="width: 35px"> CM </span>
        </div>
        <div class="size-item" style="width: 27%;">
          <input type="number" placeholder="0" v-model="boxData.productWeight" style="width: calc(100% - 37px)" /><span style="width: 35px"> KG</span>
        </div>
      </div>
      <div class="search search-last">
        <span class="label" style="width: 10rem">本次收货数量</span>
        <input type="number" placeholder="0" v-model="boxData.rdReceivedNetReceiptsQty" style="width: 9rem" />
      </div>
      <div class="photo">
        <span class="label">拍照（可选）</span>
        <span class="photo-cont">
          <span class="iconfont icon-camera" @click="chooseImage"></span>
        </span>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('box')">重置</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native="submit('box')">确认</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XButton, XInput, Flexbox, FlexboxItem } from 'vux'
import qs from 'Qs'

export default {
  name: 'receiving',
  components: {
    Tab,
    TabItem,
    XButton,
    XInput,
    Flexbox,
    FlexboxItem
  },
  mounted () {
    let query = this.$route.query || {}
    this.skuData.receivingCode = query.receivingCode
    this.boxData.receivingCode = query.receivingCode
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
      localIds: {
        skuImg: [],
        boxImg: []
      },
      skuData: {
        receivingCode: '',
        productBarcode: '',
        receivingQtyList: [{}]
      },
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
      }
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
        if (res.data.receivingId) {
          this[`${type}Data`] = res.data
          this[`old${type}Data`] = JSON.parse(JSON.stringify(res.data))
        }
        console.log(res)
      })
      .catch(res => {
        alert('业务系统异常！')
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
          alert(`请输入入库单号`)
          return false
        }
        if (!this[`${type}Data`].productBarcode) {
          alert(`请输入SKU`)
          return false
        }
      } else {
        if (!this[`${type}Data`].boxNo) {
          alert(`请输入箱号`)
          return false
        }
      }
      if (!this[`${type}Data`].productLength) {
        alert(`请输入产品长度`)
        return false
      }
      if (!this[`${type}Data`].productWidth) {
        alert(`请输入产品宽度`)
        return false
      }
      if (!this[`${type}Data`].productHeight) {
        alert(`请输入产品高度`)
        return false
      }
      if (!this[`${type}Data`].productWeight) {
        alert(`请输入产品重量`)
        return false
      }
      if (!this[`${type}Data`].rdReceivedNetReceiptsQty) {
        alert(`请输入本次收货数量`)
        return false
      }
      if (this[`${type}Data`].rdReceivedNetReceiptsQty > (this[`${type}Data`].rdReceivingQtySubset - this[`${type}Data`].rdReceivedQtySubset)) {
        this[`${type}Data`].rdReceivedNetReceiptsQty = (this[`${type}Data`].rdReceivingQtySubset - this[`${type}Data`].rdReceivedQtySubset)
        alert(`超出实际收货数量`)
        return false
      }
      this.$vux.loading.show({
        text: 'Loading'
      })
      this[`${type}Data`].codeType = type
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
            text: '操作成功'
          })
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.data.message
          })
        }
      })
      .catch(res => {
        this.$vux.loading.hide()
        alert(JSON.stringify(res))
      })
    },
    chooseImage () {
      let that = this
      // eslint-disable-next-line
      wx.chooseImage({
        count: 3,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (a) {
          that.localIds.skuImg.push(a.localIds)
          alert(JSON.stringify(a))
        }
      })
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
        font-size: 1.5rem;
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
