<template>
  <div id="app">
    <x-header :left-options="{backText: ''}">{{$store.getters.getTitle}}<a slot="right" @click="showMenus = true">English</a></x-header>
    <router-view></router-view>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenus"></actionsheet>
    </div>
    <footer v-show="showFooter" class="footer"><span class="pull-left">当前仓库：【LA】洛杉矶大仓</span><span class="pull-right">操作人：Donny</span></footer>
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
      showMenus: false,
      showFooter: false
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'Warehouse') {
        this.showFooter = false
      } else {
        this.showFooter = true
      }
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import './assets/css/fonts.css';

body {
  background-color: #fbf9fe;
}
#app {
  padding-bottom: 3rem;
}
.pull-left {
  float: left;
}
.pull-right {
  float: right;
}
.underline {
  text-decoration: underline;
}
.footer {
  position: fixed;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 0 1rem;
  background: #ccc;
  height: 3rem;
  line-height: 3rem;
  font-size: 0.75rem;
}
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0
}
.clearfloat {
  zoom: 1
}
</style>
