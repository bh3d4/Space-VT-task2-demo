// app Vue instance
var app = new Vue({
  // app initial state
  data () {
    return {
      loading: false,
      timespan: 'day',
      time: '2017-1|2015-4|2016-3',
      element: 'HeliographicInertialLatitudeoftheEarth',
      chart: null,
      colors: ['rgba(255, 99, 132, 0.2)',
               'rgba(142, 229, 238, 0.2)',
               'rgba(0, 255, 127, 0.2)',
               'rgba(255, 255, 0, 0.2)',
               'rgba(255, 48, 48, 0.2)',
               'rgba(139, 119, 101, 0.2)']
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      var params = this.validateInput()
      if (params == 'invalid') {
        alert('Please Enter the valid time')
        return
      }
      this.loading = true
      // http://ec2-54-186-112-54.us-west-2.compute.amazonaws.com
      this.$http.get('http://localhost:5000/api/v1/imfdata', {params: params}).then(res => {
        var data = res.body.data
        var temp = this.processData(data)
        this.drawCanvas(temp)
        this.loading = false
      }, response => {
        // error callback
      });      
    },
    validateInput () {
      var params = {
        element: this.element,
        timespan: this.timespan,
        time: this.time,
      }
      var timeArray = params.time.split('|')
      for (var i = 0; i < timeArray.length; i++) {
        timeArray[i] = timeArray[i].split('-')
        var days = parseInt(timeArray[i][0]) % 4 == 0 ? 366 : 365
        if (parseInt(timeArray[i][0]) < 2011 ||
            parseInt(timeArray[i][0]) > 2017) {
          return 'invalid'
        }
        if (params.timespan == 'day') {
          if (parseInt(timeArray[i][1]) < 0 ||
              parseInt(timeArray[i][1]) > days) {
            return 'invalid'
          }
        } else if (params.timespan == 'month') {
          if (parseInt(timeArray[i][1]) < 0 ||
              parseInt(timeArray[i][1]) > 12) {
            return 'invalid'
          }
        }
      }
      params.timeArray = timeArray
      return params
    },
    processData (data) {
      var labels = []
      var datasets = []
      var groupedDatas = this.timespan == 'day' ? this.groupData(data, 'day') : this.groupData(data, 'month')
      if (this.timespan == 'day') {
        for (var i = 1; i <= 24; i++) {
          labels.push(i + '')
        }
        for (var i = 0; i < groupedDatas.length; i++) {
          datasets.push({
            label: groupedDatas[i][0]['Year'] + ' Year ' + this.timespan + '-' + groupedDatas[i][0]['DecimalDay'],
            data: _u.map(groupedDatas[i], this.element),
            backgroundColor: this.colors[i]
          })
        }
      } else if (this.timespan == 'month') {
        for (var i = 1; i <= 31; i++) {
          for (var j = 1; j <= 24; j++) {
            labels.push(i + '-' + j)
          }
        }
        for (var i = 0; i < groupedDatas.length; i++) {
          var sortedDatas = []
          var sortedDays = []
          var groupByDay = _u.groupBy(groupedDatas[i], 'DecimalDay')
          var days = _u.keys(groupByDay)
          for (var j = 0; j < days.length; j++) {
            var sortedDay = _u.sortBy(groupByDay[days[j]], 'Hour')
            sortedDays.push(sortedDay)
          }
          for (var k = 0; k < sortedDays.length; k++) {
            for (var m = 0; m < sortedDays[k].length; m++) {
              sortedDatas.push(sortedDays[k][m][this.element])
            }
          }
          datasets.push({
            label: sortedDays[0][0]['Year'] + ' Year ' + this.timespan + '-' + groupedDatas[0][0]['Month'],
            data: sortedDatas,
            backgroundColor: this.colors[i]
          })
        }
      }
      return {labels: labels, datasets: datasets}
    },
    groupData (data, timespan) {
      var groupedDatas = []
      var groupByYear = _u.groupBy(data, 'Year')
      var years = _u.keys(groupByYear)
      for (var i = 0; i < years.length; i++) {
        var groupBytimespan = _u.groupBy(groupByYear[years[i]], timespan == 'day' ? 'DecimalDay' : 'Month')
        var timespans = _u.keys(groupBytimespan)
        for (var j = 0; j < timespans.length; j++) {
          groupedDatas.push(groupBytimespan[timespans[j]])
        }
      }
      return groupedDatas
    },
    drawCanvas (temp) {
      if (this.chart) {
        this.chart.destroy()
      }
      var ctx = document.getElementById("myChart").getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: temp.labels,
          datasets: temp.datasets
        },
        options: {}
      });
    }
  }
})


// mount
app.$mount('.app')
