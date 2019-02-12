<template>
  <div class="container">
    <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">按SKU上架</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">按箱上架</tab-item>
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
          <span class="pull-left">收货数量： <span class="underline">{{skuData.rdbReceivedQty}}</span></span>
          <span class="pull-right">已上架数量： <span class="underline">{{skuData.rdbPutawayQty}}</span></span>
        </div>
      </div>
      <div class="search">
        <scan-input :name="'库位'" :placeholder="'此处扫描库位条码'" v-model="skuData.lcCode"></scan-input>
      </div>
      <div class="search search-last">
        <span class="label">数量</span>
        <input type="text" v-model="skuData.pdQuantity" />
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
        <scan-input :name="'箱号'" :placeholder="'此处扫描箱唛'" v-model="boxNoData.boxCode"></scan-input>
      </div>
      <div class="search search-last">
        <scan-input :name="'SKU'" :placeholder="'此处扫描箱唛上的SKU'" v-model="boxNoData.productBarcode"></scan-input>
      </div>
      <div class="info clearfloat">
        <div class="info-detail">
          <span class="label">SKU名称：</span> 
          <span class="underline name" title="">{{boxNoData.productTitleEn}}</span>
        </div>
        <div class="total">
          <span class="pull-left">收货数量： <span class="underline">{{boxNoData.rdbReceivedQty}}</span></span>
          <span class="pull-right">已上架数量： <span class="underline">{{boxNoData.rdbPutawayQty}}</span></span>
        </div>
      </div>
      <div class="search">
        <scan-input :name="'库位'" :placeholder="'此处扫描库位条码'" v-model="boxNoData.lcCode"></scan-input>
      </div>
      <div class="search search-last">
        <span class="label">数量</span>
        <input type="number" v-model="boxNoData.pdQuantity" />
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
            <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset('boxNo')">重置</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native="submit('boxNo')">确认</x-button>
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
        pdQuantity: ''
      },
      boxNoData: {
        boxCode: '',
        productBarcode: '',
        lcCode: '',
        pdQuantity: ''
      },
      boxNoData1: '',
      oldskuData: {
        receivingCode: '',
        productBarcode: '',
        lcCode: '',
        pdQuantity: ''
      },
      oldboxNoData: {
        boxCode: '',
        productBarcode: '',
        lcCode: '',
        pdQuantity: ''
      }
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
          queryCode: type === 'sku' ? this[`${type}Data`].productBarcode : this[`${type}Data`].boxCode,
          codeType: type
        }
      })
      .then(res => {
        if (res.data) {
          this[`${type}Data`] = res.data
          this[`old${type}Data`] = JSON.parse(JSON.stringify(res.data))
        }
      })
      .catch(res => {
        alert('业务系统异常！')
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
          alert(`请输入入库单号`)
          return false
        }
      } else {
        if (!this[`${type}Data`].boxCode) {
          alert(`请输入箱号`)
          return false
        }
      }
      if (!this[`${type}Data`].lcCode) {
        alert(`请输入库位`)
        return false
      }
      if (!this[`${type}Data`].pdQuantity) {
        alert(`请输入数量`)
        return false
      }
      this.$vux.loading.show({
        text: 'Loading'
      })
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/putaway/doPutaway`, qs.stringify(this[`${type}Data`]), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this.$vux.loading.hide()
        if (res.success) {
          this.$vux.toast.show({
            type: 'text',
            text: '操作成功'
          })
        } else {
          alert(JSON.stringify(res))
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
