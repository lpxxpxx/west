<template>
  <div class="datacount">
      <div class="search-con">
        <div class="search">
          <span class="label">时区</span>
          <select>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div class="search">
          <span class="label">仓库</span>
          <select multiple="multiple">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      <canvas id="chart1"></canvas>
      <div class="title">
        <h5>退件</h5>
        <span>本月</span>
        <span>本周</span>
        <span>最近一周</span>
        <span>昨天</span>
        <span @click="setToday">今天</span>
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
      <div class="count">
        <div>
          <canvas id="chart2"></canvas>
          <p>退件处理率</p>
        </div>
        <div>
          <canvas id="chart3"></canvas>
          <p>认领件处理率</p>
        </div>
      </div>
      <div class="total">
        <!-- <grid :show-lr-borders="false" :show-vertical-dividers="false">
          <grid-item v-for="(item, index) in chartDataAge" :key="index">
            <span>{{ item.name }}</span>
            <p>{{ item.value }}<span>&nbsp;万元</span></p>
            <span class="grid-bot">{{ item.percent }}</span>
          </grid-item>
        </grid> -->
      </div>
  </div>
</template>

<script>
import F2 from '@antv/f2'
import qs from 'Qs'
import { Countup, XButton, Grid, GridItem, Datetime, Group } from 'vux'
export default {
  components: {
    Countup,
    XButton,
    Grid,
    GridItem,
    Datetime,
    Group
  },
  mounted () {
    this.renderChart()
    this.renderCircle(20, 'chart2', 1)
    this.renderCircle(40, 'chart3', 2)
  },
  data () {
    return {
      chart: null,
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      startTime: '',
      endTime: '',
      timeoutId: '',
      chartData: [{
        'availableStorageCapacity': 1020.34,
        'existingStorageCapacity': 0,
        'totalStorageCapacity': 1020.34,
        'warehouseCode': 'LA02THC',
        'warehouseDesc': '洛杉矶大仓退货仓',
        'warehouseId': 10,
        'warehouseTimezone': 'America/Los_Angeles'
      }, {
        'availableStorageCapacity': 0,
        'existingStorageCapacity': 0,
        'totalStorageCapacity': 0,
        'warehouseCode': 'LALS',
        'warehouseDesc': '美国洛杉矶大仓临时仓',
        'warehouseId': 9,
        'warehouseTimezone': 'America/Los_Angeles'
      }, {
        'availableStorageCapacity': 300.00,
        'existingStorageCapacity': 0,
        'totalStorageCapacity': 300.00,
        'warehouseCode': 'TEST',
        'warehouseDesc': '测试用',
        'warehouseId': 6,
        'warehouseTimezone': 'America/Los_Angeles'
      }, {
        'availableStorageCapacity': 0,
        'existingStorageCapacity': 0,
        'totalStorageCapacity': 0,
        'warehouseCode': 'WPBE',
        'warehouseDesc': '比利时仓',
        'warehouseId': 12,
        'warehouseTimezone': 'Europe/Berlin'
      }, {
        'availableStorageCapacity': 13600.00,
        'existingStorageCapacity': 0,
        'totalStorageCapacity': 13600.00,
        'warehouseCode': 'WPCHI',
        'warehouseDesc': '美国芝加哥仓',
        'warehouseId': 7,
        'warehouseTimezone': 'America/Chicago'
      }, {
        'availableStorageCapacity': 17600.00,
        'existingStorageCapacity': 0,
        'totalStorageCapacity': 17600.00,
        'warehouseCode': 'WPDE',
        'warehouseDesc': '德国仓',
        'warehouseId': 5,
        'warehouseTimezone': 'Europe/Berlin'
      }, {
        'availableStorageCapacity': 1338000.00,
        'existingStorageCapacity': 0,
        'totalStorageCapacity': 1338000.00,
        'warehouseCode': 'WPHOU',
        'warehouseDesc': '美国休斯敦仓',
        'warehouseId': 8,
        'warehouseTimezone': 'US/Eastern'
      }, {
        'availableStorageCapacity': 2170368.01,
        'existingStorageCapacity': 0,
        'totalStorageCapacity': 2170368.01,
        'warehouseCode': 'WPLA',
        'warehouseDesc': '美国洛杉矶',
        'warehouseId': 3,
        'warehouseTimezone': 'America/Los_Angeles'
      }, {
        'availableStorageCapacity': 1000.00,
        'existingStorageCapacity': 0,
        'totalStorageCapacity': 1000.00,
        'warehouseCode': 'WPLA218',
        'warehouseDesc': '洛杉矶218仓',
        'warehouseId': 13,
        'warehouseTimezone': 'America/Los_Angeles'
      }, {
        'availableStorageCapacity': 0.37,
        'existingStorageCapacity': 0,
        'totalStorageCapacity': 0.37,
        'warehouseCode': 'WPNJ',
        'warehouseDesc': '美国新泽西',
        'warehouseId': 4,
        'warehouseTimezone': 'America/New_York'
      }, {
        'availableStorageCapacity': 1000.00,
        'existingStorageCapacity': 0,
        'totalStorageCapacity': 1000.00,
        'warehouseCode': 'WPUKK',
        'warehouseDesc': '英国K仓',
        'warehouseId': 1,
        'warehouseTimezone': 'Europe/London'
      }, {
        'availableStorageCapacity': 1269556.20,
        'existingStorageCapacity': 0,
        'totalStorageCapacity': 1269556.20,
        'warehouseCode': 'WPUKS',
        'warehouseDesc': '英国S仓',
        'warehouseId': 2,
        'warehouseTimezone': 'Europe/London'
      }],
      returnData: {
        'claimProcessingRate': 7,
        'confirmedQty': 34,
        'customerPropList': [{
          'customerCode': '',
          'returnQty': 58
        }, {
          'customerCode': 'A004',
          'returnQty': 2
        }, {
          'customerCode': 'AK',
          'returnQty': 4
        }, {
          'customerCode': 'XK',
          'returnQty': 64
        }, {
          'customerCode': 'YDL',
          'returnQty': 120
        }],
        'processedQty': 200,
        'returnQty': 248,
        'returnRate': 58,
        'toBeClaimedQty': 14,
        'warehouseShareList': [{
          'returnQty': 8,
          'warehouseCode': 'WPUKS'
        }, {
          'returnQty': 183,
          'warehouseCode': 'WPLA'
        }, {
          'returnQty': 37,
          'warehouseCode': 'WPNJ'
        }, {
          'returnQty': 1,
          'warehouseCode': 'WPDE'
        }, {
          'returnQty': 11,
          'warehouseCode': 'WPCHI'
        }, {
          'returnQty': 8,
          'warehouseCode': 'WPHOU'
        }]
      }
    }
  },
  methods: {
    toSearch: function () {
      let that = this
      clearTimeout(that.timeoutId)
      that.timeoutId = setTimeout(function () {
        that.searchCircle(2)
      }, 1000)
    },
    setToday: function () {
      this.startTime = new Date().format('yyyy-MM-dd')
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
    timeChange: function () {
      this.toSearch()
    },
    searchChart: function () {
      let query = {}
      query.warehouseIds = '3,4,5,7'
      this.axios.post(`${this.$store.getters.getUrl}/weixinapi/reportform/storageCapacitySearch`, qs.stringify(query), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this.$vux.loading.hide()
        if (res.data.success) {
          this.chartData = res.data.data
          this.chart.clear()
          this.renderChart()
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
    searchCircle: function (type) {
      /* type等于0为自发货，1为FBA，2为退件 */
      let url = ''
      let query = {}
      if (type === 2) {
        url = '/weixinapi/reportform/returnReportSearch'
      } else {
        url = '/weixinapi/reportform/spontaneousOrderStatementSearch'
        query.orderType = type
      }
      query.warehouseIds = '3,4,5,7'
      query.startTime = this.startTime
      query.endTime = this.endTime
      query.timeZone = 'Asia/Shanghai'
      this.axios.post(`${this.$store.getters.getUrl}${url}`, qs.stringify(query), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        this.$vux.loading.hide()
        if (res.data.success) {
          this.circleData = res.data.data
          this.renderChart()
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
      _this.chart = chart
    },
    renderCircle: function (num = 0, target = '', no = 1) {
      var data = [{
        x: '1',
        y: num
      }]
      var chart = new F2.Chart({
        width: window.innerWidth / 2,
        height:
          window.innerWidth > window.innerHeight
            ? window.innerHeight - 54
            : window.innerWidth * 0.5,
        id: target,
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
      chart.interval().position('x*y').size(20).animate({
        appear: {
          duration: 1200,
          easing: 'cubicIn'
        }
      })
      chart.render()
      this[`chart${no}`] = chart
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
    input,
    select {
      flex: 1;
      padding: 0 .5rem;
      height: 2rem;
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
  }
</style>
