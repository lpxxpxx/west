<template>
  <div class="container">
    <div class="input">
      <scan-input :placeholder="'物流跟踪号'" :disabled="noDis" :autofocus="'autofocus'" v-model="no"></scan-input>
    </div>
    <div class="input">
      <scan-input :placeholder="'SKU条码'" :disabled="skuDis" v-model="sku"></scan-input>
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
import { XButton, Flexbox, FlexboxItem } from 'vux'
import qs from 'Qs'

export default {
  name: 'inventoryAdjustment',
  components: {
    XButton,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      index: 0,
      no: '',
      sku: '',
      noDis: false,
      skuDis: true,
      timeoutId: ''
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    },
    reset () {
      this.noDis = false
      this.skuDis = true
      this.no = ''
      this.sku = ''
      this.focusInput(0)
    },
    focusInput (index) {
      setTimeout(function () {
        document.querySelectorAll('input')[`${index}`].focus()
      }, 200)
    },
    searchNo () {
      if (this.no.length > 33) {
        this.no = this.no.substring(this.no.length - 12)
      }
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/shipment/searchByTrackingNumber`, {
        params: {
          trackingNumber: this.no
        }
      })
      .then(res => {
        if (res.data.success) {
          this.noDis = true
          this.skuDis = false
          this.focusInput(1)
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.data.message
          })
        }
      })
      .catch(res => {
        alert('业务系统异常！')
      })
    },
    submit () {
      let query = {
        trackingNumber: this.no,
        warehouseId: this.$store.getters.getWarehouse.warehouseId,
        productSku: this.sku
      }
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/shipment/searchBySkuAndSignout`, qs.stringify(query), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        if (res.data.success) {
          this.reset()
        }
        this.$vux.toast.show({
          type: 'text',
          text: res.data.message
        })
      })
      .catch(res => {
        alert('业务系统异常！')
      })
    }
  },
  watch: {
    sku () {
      if (this.sku === '') return false
      let that = this
      clearTimeout(that.timeoutId)
      that.timeoutId = setTimeout(function () {
        that.submit()
      }, 1000)
    },
    no () {
      if (this.no === '') return false
      let that = this
      clearTimeout(that.timeoutId)
      that.timeoutId = setTimeout(function () {
        that.searchNo()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    margin-bottom: 7rem;
  }
  .search {
    padding: 1.5rem 1rem;
    height: 3rem;
    line-height: 3rem;
    display: flex;
    .label {
      margin-right: 1rem;
      font-size: 1.5rem;
    }
    input {
      flex: 1;
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
