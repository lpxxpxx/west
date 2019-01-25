<template>
  <div class="container">
    <div class="search search-first">
        <scan-input :name="'SKU'" v-model="data.productBarcode"></scan-input>
    </div>
    <div class="search search-last" style="height: auto">
      <div class="info-detail">
        <span class="label">SKU名称：</span> 
        <span class="underline name" title="">{{data.productTitleEn}}</span>
      </div>
    </div>
    <divider>参数</divider>
    <div class="search search-first">
      <span class="label">重量</span>
      <input type="number" placeholder="0" v-model="data.productWeight" />
      <span class="type">KG</span>
    </div>
    <div class="search">
      <span class="label">长</span>
      <input type="number" placeholder="0" v-model="data.productLength" />
      <span class="type">CM</span>
    </div>
    <div class="search">
      <span class="label">宽</span>
      <input type="number" placeholder="0" v-model="data.productWidth" />
      <span class="type">CM</span>
    </div>
    <div class="search search-last">
      <span class="label">高</span>
      <input type="number" placeholder="0" v-model="data.productHeight" />
      <span class="type">CM</span>
    </div>
    <div class="button">
      <flexbox>
        <flexbox-item>
          <x-button :gradients="['#cccccc', '#cccccc']" @click.native="reset()">重置</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button :gradients="['#169bd5', '#169bd5']" @click.native="submit()">确认</x-button>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem, Divider } from 'vux'
import qs from 'Qs'

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
        productTitleEn: '',
        productLength: 0,
        productWidth: 0,
        productHeight: 0,
        productWeight: 0
      },
      oldData: {
        productBarcode: '',
        productTitleEn: '',
        productLength: 0,
        productWidth: 0,
        productHeight: 0,
        productWeight: 0
      }
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    reset (type) {
      this.data = JSON.parse(JSON.stringify(this.oldData))
    },
    searchDetail () {
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/product/productSkuAttr`, {
        params: {
          warehouseId: this.$store.getters.getWarehouse.warehouseId,
          productBarcode: this.data.productBarcode || ''
        }
      })
      .then(res => {
        if (res.data.productBarcode) {
          this.data = res.data
          this.oldData = JSON.parse(JSON.stringify(res.data))
        }
      })
      .catch(res => {
        alert(JSON.stringify(res))
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
      if (!this.data.productId) {
        alert(`请输入正确的SKU`)
        return false
      }
      if (!this.data.productWeight) {
        alert(`请输入产品重量`)
        return false
      }
      if (!this.data.productLength) {
        alert(`请输入产品长度`)
        return false
      }
      if (!this.data.productWidth) {
        alert(`请输入产品宽度`)
        return false
      }
      if (!this.data.productHeight) {
        alert(`请输入产品高度`)
        return false
      }
      this.$vux.loading.show({
        text: 'Loading'
      })
      let submitData = {}
      submitData.productId = this.data.productId
      submitData.productLength = this.data.productLength
      submitData.productWeight = this.data.productWeight
      submitData.productWidth = this.data.productWidth
      submitData.productHeight = this.data.productHeight
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/product/updateAttr`, qs.stringify(submitData), {
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
    }
  },
  watch: {
    'data.productBarcode' () {
      this.toSearch()
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
      text-align: right;
    }
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
</style>
