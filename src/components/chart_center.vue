<template>
  <div class="datacount">
      <tab :line-width=1>
        <tab-item :selected="type === 0" @on-item-click="type = 0">{{menuList[0]}}</tab-item>
        <tab-item :selected="type === 1" @on-item-click="type = 1">{{menuList[1]}}</tab-item>
        <tab-item :selected="type === 2" @on-item-click="type = 2">{{menuList[2]}}</tab-item>
        <tab-item :selected="type === 3" @on-item-click="type = 3">{{menuList[3]}}</tab-item>
      </tab>
      <div class="search-con">
        <div class="search">
          <span class="label">时区</span>
          <select v-model="timeZone">
            <option v-for="(item, index) in timeZoneList" :key="index" :value="item.zone">{{item.name}}</option>
          </select>
        </div>
        <div class="search">
          <span class="label">仓库</span>
          <button @click.stop="expandChange(2)">{{selectedWarName ? selectedWarName : '全部'}}</button>
          <div class="type-list warehouse-list" :class="{'close':!isExpand2}">
            <ul class="items">
              <li @click.stop="warehousesClick('', '')" :class="{'selected': selectedWarList.length === 0} ">全部 <x-icon type="ios-checkmark-empty" size="30" class="icon-checked"></x-icon></li>
              <li v-for="(x, index) in warehousesList" :key="index" @click.stop="warehousesClick(index, x)" ref="warItem">{{ x.warehouseDesc }} <x-icon type="ios-checkmark-empty" size="30" class="icon-checked"></x-icon></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="title">
        <h5 @click.stop="expandChange(1)"><label>{{menuList[type]}}</label><!-- <i class="iconfont icon-class" :class="{'icon-icon-test1':!isExpand1,'icon-icon-test':isExpand1}"></i> --></h5>
        <div v-show="type !== 3">
          <span @click="setThisMonth">本月</span>
          <span @click="setThisWeek">本周</span>
          <span @click="setLast7Day">最近一周</span>
          <span @click="setYesterday">昨天</span>
          <span @click="setToday">今天</span>
        </div>
      </div>
      <canvas v-show="type === 3" style="margin-top: 1rem;" id="chart1"></canvas>
      <div v-show="type !== 3">
        <div class="type-list" :class="{'close':!isExpand1}">
          <ul class="items">
            <li v-for="(x, index) in menuList" :key="index" @click="menuTypeClick(index)" :class="{'selected': index === type}">{{ x }} <x-icon type="ios-checkmark-empty" size="30" class="icon-checked"></x-icon></li>
          </ul>
        </div>
        <div class="flex">
          <group style="flex-grow: 1;width: 50%;">
            <datetime
              style="height: 2rem;box-sizing: border-box;font-size: .9rem;"
              v-model="startTime"
              @on-change="timeChange"></datetime>
          </group>
          <group style="flex-grow: 1;width: 50%;">
            <datetime
              style="height: 2rem;box-sizing: border-box;font-size: .9rem;"
              v-model="endTime"
              @on-change="timeChange"></datetime>
          </group>
        </div>
        <div class="total">
          <grid :show-lr-borders="false" :show-vertical-dividers="false">
            <grid-item v-for="(item, index) in getTotalData" :key="index" style="height: 5.7rem; background: #f0f0f0;">
              <p :style="totalColorList[index]">{{item || 0}}</p>
              <span>{{totalList[index][type]}}</span>
            </grid-item>
          </grid>
        </div>
        <div class="count">
          <div>
            <canvas id="chart2"></canvas>
            <p>{{footerList1[type]}}</p>
          </div>
          <div>
            <canvas id="chart3"></canvas>
            <p>{{footerList2[type]}}</p>
          </div>
        </div>
        <div class="count">
          <div>
            <canvas id="chart4"></canvas>
            <p>仓库占比</p>
          </div>
        </div>
        <div class="count">
          <div>
            <canvas id="chart5"></canvas>
            <p>客户占比</p>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import F2 from '@antv/f2/lib/index-all'
import qs from 'Qs'
import { Tab, TabItem, Countup, XButton, Grid, GridItem, Datetime, Group } from 'vux'
export default {
  components: {
    Tab,
    TabItem,
    Countup,
    XButton,
    Grid,
    GridItem,
    Datetime,
    Group
  },
  mounted () {
    try {
      this.warehousesList = JSON.parse(document.querySelector('#userInfo').value).warehouseList
    } catch (err) {
      console.error('无权限')
      this.warehousesList = [
        {
          'warehouseCode': 'LA02THC',
          'warehouseDesc': '洛杉矶大仓退货仓',
          'warehouseId': 10,
          'warehouseTimezone': 'America/Los_Angeles'
        }, {
          'warehouseCode': 'LALS',
          'warehouseDesc': '美国洛杉矶大仓临时仓',
          'warehouseId': 9,
          'warehouseTimezone': 'America/Los_Angeles'
        }, {
          'warehouseCode': 'TEST',
          'warehouseDesc': '测试用',
          'warehouseId': 6,
          'warehouseTimezone': 'America/Los_Angeles'
        }, {
          'warehouseCode': 'WPBE',
          'warehouseDesc': '比利时仓',
          'warehouseId': 12,
          'warehouseTimezone': 'Europe/Berlin'
        }, {
          'warehouseCode': 'WPCHI',
          'warehouseDesc': '美国芝加哥仓',
          'warehouseId': 7,
          'warehouseTimezone': 'America/Chicago'
        }, {
          'warehouseCode': 'WPDE',
          'warehouseDesc': '德国仓',
          'warehouseId': 5,
          'warehouseTimezone': 'Europe/Berlin'
        }, {
          'warehouseCode': 'WPHOU',
          'warehouseDesc': '美国休斯敦仓',
          'warehouseId': 8,
          'warehouseTimezone': 'US/Eastern'
        }, {
          'warehouseCode': 'WPLA',
          'warehouseDesc': '美国洛杉矶',
          'warehouseId': 3,
          'warehouseTimezone': 'America/Los_Angeles'
        }, {
          'warehouseCode': 'WPLA218',
          'warehouseDesc': '洛杉矶218仓',
          'warehouseId': 13,
          'warehouseTimezone': 'America/Los_Angeles'
        }, {
          'warehouseCode': 'WPNJ',
          'warehouseDesc': '美国新泽西',
          'warehouseId': 4,
          'warehouseTimezone': 'America/New_York'
        }, {
          'warehouseCode': 'WPUKK',
          'warehouseDesc': '英国K仓',
          'warehouseId': 1,
          'warehouseTimezone': 'Europe/London'
        }, {
          'warehouseCode': 'WPUKS',
          'warehouseDesc': '英国S仓',
          'warehouseId': 2,
          'warehouseTimezone': 'Europe/London'
        }
      ]
    }
    this.searchChart()
    this.searchCircle()
    this.timeZone = this.$cookies.get('timeZone') || 'Asia/Shanghai'
    document.addEventListener('click', this.expandToZero)
  },
  destroyed () {
    document.removeEventListener('click', this.expandToZero)
  },
  data () {
    return {
      type: 0,
      isExpand1: 0,
      isExpand2: 0,
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      chart5: null,
      startTime: new Date(new Date().getTime() - (new Date().getDate() - 1) * 24 * 60 * 60 * 1000).format('yyyy-MM-dd'),
      endTime: new Date().format('yyyy-MM-dd'),
      timeoutId: '',
      timeZone: 'Asia/Shanghai',
      warehousesList: [],
      selectedWarList: [],
      selectedWarName: '',
      menuList: ['自发货', 'FBA', '退件', '库容'],
      footerList1: ['出库率', '出库率', '退件处理率'],
      footerList2: ['空包率', '空包率', '认领件处理率'],
      totalList: [
        ['订单数', '总箱数', '退件数'],
        ['已下架', '已下架', '待客户确认'],
        ['问题件', '问题件', '已确认'],
        ['已出库', '已出库', '已处理']
      ],
      totalColorList: [
        {color: '#999900'},
        {color: '#3399FF'},
        {color: '#CC9966'},
        {color: '#9999FF'}
      ],
      timeZoneList: [
        {
          zone: 'Asia/Shanghai',
          name: '[GMT +8] 亚洲/中国/上海'
        },
        {
          zone: 'Europe/Berlin',
          name: '[GMT +1] 欧洲/德国/柏林'
        },
        {
          zone: 'Europe/London',
          name: '[GMT 0] 欧洲/英国/伦敦'
        },
        {
          zone: 'America/New_York',
          name: '[GMT -5] 美洲/美国/纽约'
        },
        {
          zone: 'America/Chicago',
          name: '[GMT -6] 美洲/美国/芝加哥'
        },
        {
          zone: 'America/Los_Angeles',
          name: '[GMT -8] 美洲/美国/洛杉矶'
        }
      ],
      chartData: [],
      circleData: {}
    }
  },
  computed: {
    getTotalData: function () {
      let res = []
      if (this.type === 0) {
        res.push(this.circleData.orderQty)
        res.push(this.circleData.offShelfQty)
        res.push(this.circleData.questionPieceQty)
        res.push(this.circleData.outboundDeliveryQty)
      } else if (this.type === 1) {
        res.push(this.circleData.orderQty)
        res.push(this.circleData.offShelfQty)
        res.push(this.circleData.questionPieceQty)
        res.push(this.circleData.outboundDeliveryQty)
      } else if (this.type === 2) {
        res.push(this.circleData.returnQty)
        res.push(this.circleData.toBeClaimedQty)
        res.push(this.circleData.confirmedQty)
        res.push(this.circleData.processedQty)
      }
      return res
    }
  },
  methods: {
    toSearch: function (fn, time) {
      let that = this
      clearTimeout(that.timeoutId)
      that.timeoutId = setTimeout(function () {
        fn()
      }, time)
    },
    expandChange: function (num = 1) {
      this[`isExpand${num}`] = this[`isExpand${num}`] ? 0 : 1
    },
    expandToZero: function () {
      this.isExpand1 = 0
      this.isExpand2 = 0
    },
    menuTypeClick: function (index) {
      this.type = index
    },
    warehousesClick: function (index = 0, war = {}) {
      /* if (index === '' || (this.selectedWarList.indexOf(war.warehouseId) === -1 && this.selectedWarList.length === (this.warehousesList.length - 1))) { */
      if (index === '') {
        this.selectedWarList = []
        this.$refs.warItem.forEach((item) => {
          item.className = ''
        })
        this.selectedWarName = ''
      } else if (this.selectedWarList.indexOf(war.warehouseId) === -1) {
        this.selectedWarList.push(war.warehouseId)
        this.$refs.warItem[index].className = 'selected'
        this.selectedWarName += `${war.warehouseDesc},`
      } else {
        this.selectedWarList = this.selectedWarList.filter((item) => item !== war.warehouseId)
        this.$refs.warItem[index].className = ''
        this.selectedWarName = this.selectedWarName.replace(`${war.warehouseDesc},`, '')
      }
    },
    setToday: function () {
      this.startTime = new Date().format('yyyy-MM-dd')
      this.endTime = new Date().format('yyyy-MM-dd')
    },
    setYesterday: function () {
      this.startTime = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).format('yyyy-MM-dd')
      this.endTime = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).format('yyyy-MM-dd')
    },
    setLast7Day: function () {
      this.startTime = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd')
      this.endTime = new Date().format('yyyy-MM-dd')
    },
    setThisWeek: function () {
      this.startTime = new Date(new Date().getTime() - (new Date().getDay() - 1) * 24 * 60 * 60 * 1000).format('yyyy-MM-dd')
      this.endTime = new Date().format('yyyy-MM-dd')
    },
    setThisMonth: function () {
      this.startTime = new Date(new Date().getTime() - (new Date().getDate() - 1) * 24 * 60 * 60 * 1000).format('yyyy-MM-dd')
      this.endTime = new Date().format('yyyy-MM-dd')
    },
    getChartData: function () {
      let res = []
      this.chartData.map(function (ware) {
        res.push({ware: ware.warehouseCode, name: '已用库容', count: ware.existingStorageCapacity})
        res.push({ware: ware.warehouseCode, name: '可用库容', count: ware.availableStorageCapacity})
      })
      return res
    },
    getPieWarData: function () {
      let res = []
      let that = this
      if (this.circleData.warehouseShareList) {
        this.circleData.warehouseShareList.map(function (ware) {
          res.push({y: Number(that.type === 2 ? ware.returnQty : ware.warehouseOrderQty), name: ware.warehouseCode, count: 'count'})
        })
      }
      res.sort(function (a, b) { return b.y - a.y })
      return res
    },
    getPieCusData: function () {
      let res = []
      let that = this
      if (this.circleData.customerPropList) {
        this.circleData.customerPropList.map(function (ware) {
          res.push({y: Number(that.type === 2 ? ware.returnQty : ware.customerOrderQty), name: ware.customerCode, count: 'count'})
        })
      }
      res.sort(function (a, b) { return b.y - a.y })
      return res
    },
    timeChange: function () {
      if (this.startTime && this.endTime) {
        if (new Date(this.startTime) > new Date(this.endTime)) {
          let that = this
          setTimeout(function () {
            that.$vux.toast.show({
              type: 'text',
              text: '开始时间大于结束时间'
            })
          }, 1000)
        } else {
          this.toSearch(this.searchCircle, 1000)
        }
      }
    },
    searchChart: function () {
      let query = {}
      query.warehouseIds = this.selectedWarList.join(',')
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/reportform/storageCapacitySearch`, qs.stringify(query), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this.$vux.loading.hide()
        if (res.data.success && res.data.data) {
          this.chartData = res.data.data
          if (this.chart1) this.chart1.clear()
          this.renderChart()
          this.toSearch(this.searchChart, 1000 * 60 * 2)
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.data.message
          })
        }
      })
      .catch(res => {
        this.$vux.loading.hide()
        alert(this.$t('businessSystemException'))
      })
    },
    searchCircle: function () {
      /* type等于0为自发货，1为FBA，2为退件 */
      let url = ''
      let query = {}
      if (this.type === 2) {
        url = '/weixinapi/reportform/returnReportSearch'
      } else {
        url = '/weixinapi/reportform/spontaneousOrderStatementSearch'
        query.orderType = this.type
      }
      query.warehouseIds = this.selectedWarList.join(',')
      query.startTime = this.startTime + ' 00:00:00'
      query.endTime = this.endTime === new Date().format('yyyy-MM-dd') ? new Date().format('yyyy-MM-dd hh:mm:ss') : this.endTime + ' 23:59:59'
      query.timeZone = this.timeZone
      this.axios.post(`${this.$store.getters.getUrl}${url}`, qs.stringify(query), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this.$vux.loading.hide()
        if (res.data.success && res.data.data) {
          this.circleData = res.data.data
          if (this.chart2) this.chart2.clear()
          if (this.chart3) this.chart3.clear()
          if (this.chart4) this.chart4.clear()
          if (this.chart5) this.chart5.clear()
          if (this.type === 2) {
            this.renderCircle(Number(res.data.data.returnRate), 2)
            this.renderCircle(Number(res.data.data.claimProcessingRate), 3)
            this.renderPie(this.getPieWarData(), 4)
            this.renderPie(this.getPieCusData(), 5)
          } else {
            this.renderCircle(Number(res.data.data.orderQty ? (res.data.data.outboundDeliveryQty / res.data.data.orderQty * 100).toFixed(0) : 0), 2)
            this.renderCircle(Number(res.data.data.trackingNumQty ? (res.data.data.noTrackingNumQty / res.data.data.trackingNumQty * 100).toFixed(0) : 0), 3)
            this.renderPie(this.getPieWarData(), 4)
            this.renderPie(this.getPieCusData(), 5)
          }
          this.toSearch(this.searchCircle, 1000 * 60 * 2)
        } else {
          this.renderCircle(0, 2)
          this.renderCircle(0, 3)
          this.renderPie([], 4)
          this.renderPie([], 5)
        }
      })
      .catch(res => {
        console.log(res)
        this.$vux.loading.hide()
        alert(this.$t('businessSystemException'))
      })
    },
    renderChart: function () {
      var _this = this
      var chart = new F2.Chart({
        width: window.innerWidth,
        height:
          window.innerWidth > window.innerHeight
            ? window.innerHeight - 54
            : window.innerWidth * 0.707,
        id: 'chart1',
        pixelRatio: window.devicePixelRatio
      })
      chart.source(this.getChartData())
      chart.tooltip({
        custom: true, // 自定义 tooltip 内容框
        onChange: function (obj) {
          const legend = chart.get('legendController').legends.top[0] // 获取 legend
          const tooltipItems = obj.items
          const legendItems = legend.items
          const map = {}
          legendItems.map(item => {
            map[item.name] = F2.Util.mix({}, item)
          })
          tooltipItems.map(item => {
            const { name, value } = item
            map[name].value = value + ' 万m³'
          })
          legend.setItems(Object.values(map))
        },
        onHide (tooltip) {
          const legend = chart.get('legendController').legends.top[0]
          legend.setItems(chart.getLegendItems().country)
        }
      })

      chart.interval().position('ware*count').color('name').adjust('stack')
      chart.render()
      _this.chart1 = chart
    },
    renderCircle: function (num = 0, no = 2) {
      let data = [{
        x: '1',
        y: num
      }]
      let chart = new F2.Chart({
        width: window.innerWidth / 2,
        height:
          window.innerWidth > window.innerHeight
            ? window.innerHeight - 54
            : window.innerWidth * 0.5,
        id: `chart${no}`,
        pixelRatio: window.devicePixelRatio
      })
      chart.source(data, {
        y: {
          max: 100,
          min: 0
        }
      })
      chart.axis(false)
      chart.tooltip(false)
      chart.legend(false)
      chart.coord('polar', {
        transposed: true,
        innerRadius: 0.8,
        radius: 0.9
      })
      chart.guide().arc({
        start: [0, 0],
        end: [1, 99.98],
        top: false,
        style: {
          lineWidth: 20,
          stroke: '#ccc'
        }
      })
      chart.guide().text({
        position: ['50%', '50%'],
        content: `${num}%`,
        style: {
          fill: '#1890FF',
          fontSize: '25'
        }
      })
      chart.interval().position('x*y').size(20).color('x', `${no === 2 ? '#73b6e5' : '#f48b8b'}`).animate({
        appear: {
          duration: 1000,
          easing: 'cubicIn'
        }
      })
      chart.render()
      this[`chart${no}`] = chart
    },
    renderPie: function (arr = [], no = 4) {
      let chart = new F2.Chart({
        width: window.innerWidth,
        height:
          window.innerWidth > window.innerHeight
            ? window.innerHeight - 54
            : window.innerWidth * 0.5,
        id: `chart${no}`,
        pixelRatio: window.devicePixelRatio
      })
      chart.source(arr)
      chart.coord('polar', {
        transposed: true,
        radius: 0.75
      })
      chart.legend(false)
      chart.axis(false)
      chart.tooltip(false)

      // 添加饼图文本
      chart.pieLabel({
        sidePadding: 40,
        label1: function label1 (data, color) {
          return {
            text: data.name,
            fill: color
          }
        },
        label2: function label2 (data) {
          return {
            text: String(Math.floor(data.y * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '件',
            fill: '#808080',
            fontWeight: 'bold'
          }
        }
      })

      chart.interval().position('const*y').color('name', ['#ebaa4e', '#98c849', '#ec7e57', '#6ba9dc', '#ec547d']).adjust('stack')
      chart.render()
      this[`chart${no}`] = chart
    }
  },
  watch: {
    type () {
      if (this.type !== 3) this.searchCircle()
    },
    timeZone () {
      this.searchCircle()
      this.$cookies.set('timeZone', this.timeZone)
    },
    selectedWarName () {
      let that = this
      this.toSearch(function () {
        that.searchChart()
        that.searchCircle()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
  .content {
    padding-bottom: 40px;
  }
  .tab-item {
    font-size: 1.5rem;
  }
  .search-con {
    padding-top: 1rem;
    display: flex;
  }
  .search {
    width: 50%;
    flex-grow: 1;
    padding: 0 1rem 10px;
    line-height: 2rem;
    display: flex;
    .label {
      margin-right: .5rem;
      font-size: 1rem;
      text-align: right;
    }
    button,
    select {
      flex: 1;
      padding: 0 .5rem;
      height: 2rem;
      width: 100px;
    }
    button {
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .flex {
    display: flex;
  }
  .count {
    display: flex;
    div {
      flex-grow: 1;
      p {
        text-align: center;
        margin-bottom: 1rem;
      }
    }
  }
  .title {
    padding: 1rem 1rem 0;
    h5 {
      font-size: 1rem;
      display: inline-block;
    }
    span {
      font-size: .9rem;
      float: right;
      color: #1890FF;
      margin: 0 5px;
    }
    div {
      float: right;
    }
  }
  .type-list {
    position: absolute;
    box-sizing: border-box;
    max-height: 214px;
    left: 1rem;
    margin-top: 5px;
    width: 180px;
    background: #fff;
    border-radius: 12px;
    padding: 12px;
    padding-left: 0;
    padding-right: 0;
    overflow: hidden;
    z-index: 2;
    transition: all .3s ease-in-out;
  }
  .warehouse-list {
    right: 1rem;
    left: auto;
    margin-top: 2.5rem;
    max-height: 320px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .close {
    max-height: 0px;
    padding: 0px;
  }
  .type-list li {
    position: relative;
    text-align: left;
    overflow: hidden;
    height: 38px;
    line-height: 38px;
    padding-left: 15px;
    color: #666;
  }
  .type-list li .vux-x-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    fill: #ffb924;
    display: none;
  }
  .type-list li.selected {
    background: #efeff4;
  }
  .type-list li.selected .icon-checked {
    display: block;
  }
  .total {
    text-align: center;
    p {
      font-size: 1.1rem;
    }
    span {
      color: #333;
      font-size: .7rem;
    }
  }
</style>
