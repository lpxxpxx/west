<template>
  <div class="container">
    <div class="input">
      <scan-input :placeholder="$t('trackingNumber')" v-model="queryCode"></scan-input>
    </div>
    <div v-for="(item, index) in taskList" :key="index" class="task-list" @click="goToDetail(item.spoType, item)">
      <div class="task-item">
        <p class="clearfloat">
          <span class="pull-left">{{$t('orderNo')}}：{{item.spoCode}}</span>
          <span class="pull-right">{{$t('type')}}：{{item.spoTypeText}}</span>
        </p>
        <p>{{$t('trakcingNo')}}：{{item.trackingNumber}}</p>
        <p>
          <span class="inline-block" style="vertical-align: top;">SKU*{{$t('theNumber')}}：</span>
          <span class="inline-block">
            <p v-for="(item1, index1) in item.specialOrdersProductList" :key="index1">{{item1.productBarcode}} * {{item1.sopQuantity}}</p>
          </span>
        </p>
      </div>
    </div>
    <div class="task-list task-list-none" v-show="isLoading">
      {{$t('inTheLoad')}}
    </div>
    <div class="task-list task-list-none" v-show="!hasTask">
      {{$t('noDataFound')}}
    </div>
    <div class="button">
      <x-button :gradients="['#1D62F0', '#19D5FD']" @click.native="goToDetail(0, {trakcingNo: queryCode})">{{$t('noMatch')}}</x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux'
import qs from 'Qs'

export default {
  name: 'returnManagementTask',
  components: {
    XButton
  },
  mounted () {
    this.search()
  },
  data () {
    return {
      taskList: [],
      queryCode: '',
      total: 0,
      page: 0,
      isLoading: false,
      hasTask: true,
      timeoutId: ''
    }
  },
  methods: {
    goToDetail (spoType = '', item = {}) {
      this.$store.dispatch('setTemporary', item)
      this.$router.push(`/returnManagement?spoType=${spoType}`)
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
      if (this.queryCode.length === 34) {
        /* FEDEX  条码扫出来的长度是34，系统长度是12 */
        this.queryCode = this.queryCode.substring(this.queryCode.length - 12)
      } else if (this.queryCode.length === 30) {
        /* FEDEX_SMARTPOST  条码扫出来的长度是30，系统长度是20 */
        this.queryCode = this.queryCode.substring(this.queryCode.length - 20)
      }
      let params = {
        pageNumber: ++this.page,
        limit: 20,
        queryCode: this.queryCode,
        warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId
      }
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/returnOrder/returnOrdersSearch`, qs.stringify(params), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this.isLoading = false
        if (res.data.rows.length === 0 && this.taskList.length === 0) {
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
        alert(JSON.stringify(res))
      })
    }
  },
  watch: {
    queryCode () {
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
  .task-list-none {
    display: inherit;
    text-align: center;
  }
  .task-item {
    width: 100%;
  }
  .button {
    padding: 1rem 1rem;
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
