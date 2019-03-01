<template>
  <div class="container">
    <div class="input">
        <scan-input :placeholder="$t('LTR')" v-model="queryCode"></scan-input>
    </div>
    <!-- <div v-for="(item, index) in taskList" :key="index" class="task-list" @click="goToDetail(item.receivingCode)">
      <div class="task-item">
        <p>入库单：{{item.receivingCode}}</p>
        <p>跟踪号：{{item.trackingNumber}}</p>
        <p>参考号：{{item.referenceNo}}</p>
      </div>
    </div> -->
    <ul>
      <li class="task-item" v-for="(item, index) in taskList" :key="index" data-type="0">
        <div class="task-list" @touchstart.capture="touchStart" @touchend.capture="touchEnd" @click="goToDetail(item.receivingCode)">
          <div class="list-content">
            <p>{{$t('warehouseEntry')}}：{{item.receivingCode}}</p>
            <p>{{$t('trackingNumber')}}：{{item.trackingNumber}}</p>
            <p>{{$t('referenceNumber')}}：{{item.referenceNo}}</p>
          </div>
        </div>
        <div class="delete" @click="deleteItem" :data-index="index">{{$t('forceComplete')}}</div>
      </li>
    </ul>
    <div class="task-list task-list-none" v-show="isLoading">
      {{$t('inTheLoad')}}
    </div>
    <div class="task-list task-list-none" v-show="!hasTask">
      {{$t('noTask')}}
    </div>
    <div class="button">
      <x-button :gradients="['#1D62F0', '#19D5FD']" @click.native="goToDetail('')">{{$t('skip')}}</x-button>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux'
import ScanInput from './scan_input'
import qs from 'Qs'

export default {
  name: 'receivingTask',
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
      timeoutId: '',
      startX: 0,
      endX: 0
    }
  },
  methods: {
    goToDetail (receivingCode = '') {
      this.$router.push(`/receiving?receivingCode=${receivingCode}`)
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
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/receiving/receivingSearch`, {
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
        alert(this.$t('businessSystemException'))
      })
    },
    /* 滑动开始 */
    touchStart (e) {
      this.startX = e.touches[0].clientX
    },
    /* 滑动结束 */
    touchEnd (e) {
      let parentElement = e.currentTarget.parentElement
      this.endX = e.changedTouches[0].clientX
      if (Number(parentElement.dataset.type) === 0 && this.startX - this.endX > 30) {
        this.restSlide()
        parentElement.dataset.type = 1
      }
      if (Number(parentElement.dataset.type) === 1 && this.startX - this.endX < -30) {
        this.restSlide()
        parentElement.dataset.type = 0
      }
      this.startX = 0
      this.endX = 0
    },
    /* 判断当前是否有滑块处于滑动状态 */
    checkSlide () {
      let listItems = document.querySelectorAll('.task-item')
      for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].dataset.type === 1) {
          return true
        }
      }
      return false
    },
    /* 一次只能滑动一个 */
    restSlide () {
      let listItems = document.querySelectorAll('.task-item')
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].dataset.type = 0
      }
    },
    /* 删除 */
    deleteItem (e) {
      let index = e.currentTarget.dataset.index
      this.$vux.loading.show({
        text: 'Loading'
      })
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/receiving/receivingCompulsoryCompletion`, qs.stringify(this.taskList[index]), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this.$vux.loading.hide()
        if (res.data.success) {
          this.$vux.toast.show({
            type: 'text',
            text: this.$t('operationSuccessful')
          })
          this.restSlide()
          this.taskList.splice(index, 1)
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.data.message
          })
        }
      })
      .catch(res => {
        this.isLoading = false
        this.page--
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
    overflow: hidden;
    margin-bottom: 7rem;
  }
  .task-list{
    display: inline-block;
    width: 100%;
    font-size: 1rem;
    border-bottom: 1px solid #999;
    color: #333;
    padding: 0.7rem 1rem;
    font-size: 0.8rem;
    height: 5rem;
    box-sizing: border-box;
  }
  .task-list-none {
    display: inherit;
    text-align: center;
    height: auto;
  }
  .button {
    position: fixed;
    padding: 1rem 1rem;
    bottom: 3rem;
    width: 100%;
    box-sizing: border-box;
    background: #fbf9fe;
  }
  .page-title:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #ccc;
    color: #ccc;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .task-item{
    position: relative;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
    height: 5rem;
  }
  .task-item[data-type="0"]{
    transform: translate3d(0,0,0);
  }
  .task-item[data-type="1"]{
    transform: translate3d(-6rem,0,0);
  }
  .task-item:after{
    content: " ";
    position: absolute;
    left: 0.2rem;
    bottom: 0;
    right: 0;
    height: 1px;
    color: #ccc;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .list-box{
    padding: 0.2rem;
    display: flex;
    align-items: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    justify-content: flex-end;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 0;
  }
  .task-item .list-img{
    display: block;
    width: 1rem;
    height: 1rem;
  }
  .task-item .list-content{
    position: relative;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
  }
  .task-item .delete{
    width: 6rem;
    height: 5rem;
    background: #ff4949;
    font-size: 17px;
    color: #fff;
    text-align: center;
    line-height: 5rem;
    position: absolute;
    top:0;
    right: -6rem;
  }
</style>
