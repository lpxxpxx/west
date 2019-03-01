<template>
  <div class="container">
    <div class="input">
        <scan-input :placeholder="$t('LTR')" v-model="businessNumber"></scan-input>
    </div>
    <div v-for="(item, index) in taskList" :key="index" class="task-list">
      <div class="task-item" @click="goToDetail(item.receivingCode, item.boxCode, item.productBarcode)">
        <p class="full">{{$t('warehouseEntry')}}：{{item.receivingCode}}</p>
        <p>{{$t('trackingNumber')}}：{{item.trackingNumber}}</p>
        <p>{{$t('referenceNumber')}}：{{item.referenceNo}}</p>
        <p>SKU：{{item.productBarcode}}</p>
        <p>{{$t('quantityToBePutOnShelves')}}：{{item.pdQuantity}}</p>
      </div>
    </div>
    <div class="task-list task-list-none" v-show="isLoading">
      {{$t('inTheLoad')}}
    </div>
    <div class="task-list task-list-none" v-show="!hasTask">
      {{$t('noTask')}}
    </div>
    <div class="button">
      <x-button :gradients="['#1D62F0', '#19D5FD']" @click.native="goToDetail('', '', '', '')">{{$t('skip')}}</x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux'
import ScanInput from './scan_input'

export default {
  name: 'upperShelfTask',
  components: {
    XButton,
    ScanInput
  },
  mounted () {
    this.search()
    window.addEventListener('scroll', this.scroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scroll)
  },
  data () {
    return {
      taskList: [],
      businessNumber: '',
      total: 0,
      page: 0,
      isLoading: false,
      hasTask: true,
      timeoutId: ''
    }
  },
  methods: {
    goToDetail (receivingCode = '', boxCode = '', productBarcode = '') {
      this.$router.push(`/upperShelf?receivingCode=${receivingCode}&boxCode=${boxCode}&productBarcode=${productBarcode}`)
    },
    scroll () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let clientHeight = document.documentElement.clientHeight
      let scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight > scrollHeight - 20 && this.isLoading === false && this.page * 20 < this.total) {
        this.search()
        this.isLoading = true
      }
    },
    search () {
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/putaway/putawaySearch`, {
        params: {
          pageNumber: ++this.page,
          limit: 20,
          businessNumber: this.businessNumber,
          warehouseId: this.$store.getters.getWarehouse.warehouseId
        }})
      .then(res => {
        this.isLoading = false
        if (res.data.rows.length === 0) {
          this.hasTask = false
        } else {
          this.taskList = this.taskList.concat(res.data.rows)
          this.total = res.data.total
          this.hasTask = true
        }
      })
      .catch(res => {
        this.isLoading = false
        this.page--
        alert(`${this.$store.getters.getUrl}/weixinapi/putaway/putawaySearch`)
        alert(this.$t('businessSystemException'))
      })
    }
  },
  watch: {
    businessNumber () {
      let that = this
      clearTimeout(that.timeoutId)
      that.timeoutId = setTimeout(function () {
        that.page = 0
        that.taskList = []
        that.search()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    margin-bottom: 7rem;
  }
  .task-list{
    display: flex;
    font-size: 1rem;
    border-bottom: 1px solid #999;
    color: #333;
    padding: 0.7rem 1rem;
    font-size: 0.8rem;
  }
  .task-item {
    width: 100%;
  }
  .task-item p.full {
    width: 100%;
  }
  .task-item p {
    width: 49%;
    display: inline-block;
  }
  .task-list-none {
    display: inherit;
    text-align: center;
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
