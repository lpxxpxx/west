<template>
  <div class="cont">
    <span class="label">{{name}}</span>
    <input type="text" :placeholder="placeholder" :disabled="disabled" :autofocus="autofocus" v-model="val" onfocus="this.select()" />
    <span class="iconfont icon-scan" @click="scan"></span>
  </div>
</template>

<script>
export default {
  name: 'scanInput',
  data () {
    return {
      val: this.value
    }
  },
  model: {
    prop: 'value',
    event: 'changev'
  },
  props: [ 'name', 'placeholder', 'disabled', 'autofocus', 'value' ],
  methods: {
    scan () {
      let that = this
      if (that.disabled) return false
      // eslint-disable-next-line
      wx.scanQRCode({
        needResult: 1,
        desc: 'scanQRCode desc',
        success: function (a) {
          that.val = a.resultStr
        }
      })
    }
  },
  watch: {
    val () {
      this.$emit('changev', this.val)
    },
    value () {
      this.val = this.value
    }
  }
}
</script>

<style lang="less" scoped>
  .cont {
    height: 3rem;
    line-height: 3rem;
    display: flex;
    position: relative;
    width: 100%;
    .label {
      margin-right: 1rem;
      font-size: 1.5rem;
      white-space: nowrap;
    }
    input {
      flex: 1;
      padding: 0 2rem 0 .5rem;
      width: 100px;
    }
    .iconfont {
      position: absolute;
      font-size: 1.5rem;
      right: .5rem;
      color: #999;
    }
    input:disabled {
      background: #ddd;
    }
  }
</style>
