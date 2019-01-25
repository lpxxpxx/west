<template>
  <div class="container">
    <div class="input">
        <scan-input :placeholder="'库位/SKU'" v-model="queryCode"></scan-input>
    </div>
    <div v-for="(item, index) in taskList" :key="index" class="task-list" @click="goToDetail(item.productBarcode, $store.getters.getWarehouse.warehouseId, item.lcCode, item.lcCodeNew)">
      <div class="task-item">
        <p>库位：{{item.lcCode}}</p>
        <p>新库位：{{item.lcCodeNew}}</p>
        <p>SKU：{{item.productBarcode}}</p>
        <p>数量：{{item.quantity}}</p>
      </div>
    </div>
    <div class="task-list task-list-none" v-show="!hasTask">
      暂无任务
    </div>
    <div class="button">
      <x-button :gradients="['#1D62F0', '#19D5FD']" @click.native="goToDetail('', '', '', '')">跳过</x-button>
    </div>
  </div>
</template>

<script>
import { XButton, XInput } from 'vux'

export default {
  name: 'moveLibraryTask',
  components: {
    XButton,
    XInput
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
    goToDetail (productBarcode, warehouseId, lcCode, lcCodeNew) {
      this.$router.push(`/moveLibrary?productBarcode=${productBarcode}&warehouseId=${warehouseId}&lcCode=${lcCode}&lcCodeNew=${lcCodeNew}`)
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
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/inventory/moveWarehouseTaskSearch`, {
        params: {
          pageNumber: ++this.page,
          limit: 20,
          queryCode: this.queryCode,
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
        alert('业务系统异常！')
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
  .task-list {
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
