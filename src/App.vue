<template>
  <div id="app">
    <x-header :left-options="{backText: ''}">{{title}}<a slot="right" @click="showMenus = true">English</a></x-header>
    <router-view></router-view>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenus"></actionsheet>
    </div>
  </div>
</template>

<script>
import { XHeader, Actionsheet } from 'vux'

export default {
  name: 'app',
  components: {
    XHeader,
    Actionsheet
  },
  data () {
    return {
      menus: {
        menu1: '中文',
        menu2: 'English'
      },
      showMenus: false
    }
  },
  computed: {
    title () {
      return this.$store.getters.getTitle
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';

body {
  background-color: #fbf9fe;
}
</style>
