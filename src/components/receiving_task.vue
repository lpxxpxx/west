<template>
  <div class="container">
    <div class="input">
      <x-input class="weui-vcode" placeholder="入库单/跟踪号/参考号" >
        <span slot="label" class="icon icon-search first"></span>
        <span slot="right" class="icon icon-barcode last"></span>
      </x-input>
    </div>
    <div v-for="(item, index) in taskList" :key="index" class="task-list">
      <div class="task-item" @click="goToDetail">
        <p>入库单：{{item.receipt}}</p>
        <p>跟踪号：{{item.tracking}}</p>
        <p>参考号：{{item.reference}}</p>
      </div>
    </div>
    <div class="button">
      <x-button :gradients="['#1D62F0', '#19D5FD']" @click="goToDetail">跳过</x-button>
    </div>
  </div>
</template>

<script>
import { XButton, XInput } from 'vux'

export default {
  name: 'receivingTask',
  components: {
    XButton,
    XInput
  },
  data () {
    return {
      taskList: [
        {
          receipt: 'RVYDL-181207-0018',
          tracking: 'TGHU9863400',
          reference: 'LA2223-2'
        },
        {
          receipt: 'RVYDL-181207-0018',
          tracking: 'TGHU9863400',
          reference: 'LA2223-2'
        },
        {
          receipt: 'RVYDL-181207-0018',
          tracking: 'TGHU9863400',
          reference: 'LA2223-2'
        },
        {
          receipt: 'RVYDL-181207-0018',
          tracking: 'TGHU9863400',
          reference: 'LA2223-2'
        }
      ]
    }
  },
  methods: {
    goToDetail () {
      this.$router.push('/receiving')
    }
  }
}
</script>

<style lang="less" scoped>
  .input>.weui-vcode {
    margin-top: 1rem;
    border-top: 1px solid #999;
    border-bottom: 1px solid #999;
    color: #999;
    .first {
      margin-right: 1rem;
      font-size: 1.5rem;
      position: relative;
      top: 3px;
    }
    .last {
      margin-left: 1rem;
      font-size: 1.5rem;
      position: relative;
      top: 3px;
    }
  }
  .task-list{
    display: flex;
    font-size: 1rem;
    border-bottom: 1px solid #999;
    color: #333;
    padding: 0.7rem 1rem;
    font-size: 0.8rem;
  }
  .button {
    padding: 1rem 1rem;
  }
</style>
