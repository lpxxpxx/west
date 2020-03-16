<template>
  <div class="container">
    <div class="input">
        <scan-input :placeholder="$t('ISC')" v-model="queryCode"></scan-input>
    </div>
    <div v-for="(item, index) in taskList" :key="index" class="task-list">
      <div class="task-item" @click="goToDetail(item.tsCode, item.tsType)">
        <p class="full">{{$t('inventoryNumber')}}：{{item.tsCode}}</p>
        <p class="full">{{$t('inventoryType')}}：{{item.tsTypeText}}</p>
        <p class="full">{{$t('creationTime')}}：{{item.tsUpdateTime ? new Date(item.tsUpdateTime).format('yyyy-MM-dd hh:mm:ss') : ''}}</p>
      </div>
    </div>
    <div class="task-list task-list-none" v-show="isLoading">
      {{$t('inTheLoad')}}
    </div>
    <div class="task-list task-list-none" v-show="!hasTask">
      {{$t('noTask')}}
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux'
import ScanInput from './scan_input'
import qs from 'Qs'

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
      queryCode: '',
      total: 0,
      page: 0,
      isLoading: false,
      hasTask: true,
      timeoutId: ''
    }
  },
  methods: {
    goToDetail (tsCode = '', tsType = '') {
      this.$router.push(`/inventory?tsCode=${tsCode}&tsType=${tsType}`)
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
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/takeStock/takeStockListSearch`, qs.stringify({
        pageNumber: ++this.page,
        limit: 20,
        queryCode: this.queryCode,
        warehouseId: JSON.parse(window.localStorage.getItem('warehouse')).warehouseId
      }), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
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
