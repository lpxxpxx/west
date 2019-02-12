<template>
  <div class="container move-library">
    <div class="tab-swiper" v-show="index === 0">
      <div class="search search-first">
        <scan-input :name="'库位'" :placeholder="'此处扫描库位条码'" v-model="lcCode"></scan-input>
      </div>
      <div class="cheak">
        <check-icon :value.sync="isAll" type="plain">移动当前库位所有SKU</check-icon>
      </div>
      <div class="search">
        <scan-input :name="'SKU'" :placeholder="'此处扫描SKU条码'" :disabled="isAll ? 'disabled' : false" v-model="productBarcode"></scan-input>
      </div>
      <div class="search">
        <span class="label">数量</span>
        <input type="text" v-model="quantity" :disabled="isAll ? 'disabled' : false" placeholder="" />
      </div>
      <div class="search search-last">
        <scan-input :name="'新库位'" :placeholder="'此处扫描库位条码'" v-model="lcCodeNew"></scan-input>
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
            <x-button :gradients="['#169bd5', '#169bd5']" @click.native="submit">提交</x-button>
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
    this.loadDetail(query.productBarcode, query.warehouseId, query.lcCode, query.lcCodeNew)
  },
  data () {
    return {
      index: 0,
      isAll: false,
      productBarcode: '',
      lcCode: '',
      lcCodeNew: '',
      quantity: 0,
      aid: ''
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    loadDetail (productBarcode = '', warehouseId = '', lcCode = '', lcCodeNew = '') {
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/inventory/queryMoveWarehouseTask`, {
        params: {
          productBarcode: productBarcode,
          warehouseId: warehouseId,
          lcCode: lcCode,
          lcCodeNew: lcCodeNew
        }})
      .then(res => {
        this.lcCode = res.data.lcCode
        this.lcCodeNew = res.data.lcCodeNew
        this.productBarcode = res.data.productBarcode
        this.quantity = res.data.quantity
        this.aid = res.data.aid
        this.warehouseId = this.$store.getters.getWarehouse.warehouseId
        this.productId = res.data.productId
      })
      .catch(res => {
        alert('业务系统异常！')
      })
    },
    submit () {
      if (!this.lcCode) {
        alert(`请输入库位`)
        return false
      }
      if (!this.lcCodeNew) {
        alert(`请输入新库位`)
        return false
      }
      if (!this.isAll) {
        if (!this.productBarcode) {
          alert(`请输入SKU`)
          return false
        }
        if (!this.lcCode) {
          alert(`请输入数量`)
          return false
        }
      }
      this.$vux.loading.show({
        text: 'Loading'
      })
      let query = {
        moveType: this.isAll ? 'All' : 'Part',
        productBarcode: this.productBarcode,
        quantity: this.quantity,
        lcCode: this.lcCode,
        lcCodeNew: this.lcCodeNew,
        aid: this.aid,
        warehouseId: this.warehouseId,
        productId: this.productId
      }
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/inventory/moveWarehouse`, qs.stringify(query), {
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
