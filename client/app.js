// app Vue instance
var app = new Vue({
  // app initial state
  data () {
    return {
      loading: false,
      timespan: 'year-month',
      time: '2017|2016|2015|2014|2013|2012|2011',
      element: 'Temperature',
      numType: 'avg',
      chart: null,
      colors: ['rgba(255, 99, 132, 0.2)',
               'rgba(142, 229, 238, 0.2)',
               'rgba(0, 255, 127, 0.2)',
               'rgba(255, 255, 0, 0.2)',
               'rgba(255, 48, 48, 0.2)',
               'rgba(139, 119, 101, 0.2)',
               'rgba(209, 95, 238, 0.2)',
               'rgba(58, 95, 205, 0.2)',
               'rgba(238, 224, 229, 0.2)',
               'rgba(255, 222, 173, 0.2)',
               'rgba(238, 149, 114, 0.2)',
               'rgba(255, 0, 255, 0.2)',]
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
        numType: this.numType
      }
      var timeArray = params.time.split('|')
      if (this.timespan == 'day-hour' || this.timespan == 'month-day') {
        for (var i = 0; i < timeArray.length; i++) {
          timeArray[i] = timeArray[i].split('-')
          var days = parseInt(timeArray[i][0]) % 4 == 0 ? 366 : 365
          if (parseInt(timeArray[i][0]) < 2011 ||
              parseInt(timeArray[i][0]) > 2017) {
            return 'invalid'
          }
          if (params.timespan == 'day-hour') {
            if (parseInt(timeArray[i][1]) < 0 ||
                parseInt(timeArray[i][1]) > days) {
              return 'invalid'
            }
          } else if (params.timespan == 'month-day') {
            if (parseInt(timeArray[i][1]) < 0 ||
                parseInt(timeArray[i][1]) > 12) {
              return 'invalid'
            }
          }
        }
      } else if (this.timespan == 'year-day' || this.timespan == 'year-month') {
        for (var i = 0; i < timeArray.length; i++) {
          if (parseInt(timeArray[i]) < 2011 ||
              parseInt(timeArray[i]) > 2017) {
            return 'invalid'
          }
        }
      }
      return params
    },
    processData (data) {
      var labels = []
      var datasets = []
      var sortedDatas = []
      if (this.timespan == 'day-hour') {
        for (var i = 1; i <= 24; i++) {
          labels.push(i + '')
        }
        for (var i = 1; i <= data.length; i++) {
          sortedDatas.push(data[i - 1][this.element])
          if (i % 24 == 0) {
            datasets.push({
              label: data[i - 1]['Year'] + ' Year ' + data[i - 1]['DecimalDay'] + ' DecimalDay',
              data: sortedDatas
            })
            sortedDatas = []
          }
        }
      } else if (this.timespan == 'month-day') {
        for (var i = 1; i <= 31; i++) {
          labels.push(i)
        }
        for (var i = 0; i < data.length -  1; i++) {
          if (data[i]['_id']['Year'] != data[i + 1]['_id']['Year'] || 
              data[i]['_id']['Month'] != data[i + 1]['_id']['Month'] ||
              data[i]['_id']['DecimalDay'] == data[i + 1]['_id']['DecimalDay']) {
            sortedDatas.push(data[i][this.numType + 'Num'])
            datasets.push({
              label: data[i]['_id']['Year'] + ' Year ' + data[i]['_id']['Month'] + ' Month',
              data: sortedDatas
            })
            sortedDatas = []
          } else {
            sortedDatas.push(data[i][this.numType + 'Num'])
          }
        }
        sortedDatas.push(data[i][this.numType + 'Num'])
        datasets.push({
          label: data[i]['_id']['Year'] + ' Year ' + data[i]['_id']['Month'] + ' Month',
          data: sortedDatas
        })
      } else if (this.timespan == 'year-month') {
        for (var i = 1; i <= 12; i++) {
          labels.push(i)
        }
        for (var i = 0; i < data.length -  1; i++) {
          if (data[i]['_id']['Year'] != data[i + 1]['_id']['Year']) {
            sortedDatas.push(data[i][this.numType + 'Num'])
            datasets.push({
              label: data[i]['_id']['Year'] + ' Year ',
              data: sortedDatas
            })
            sortedDatas = []
          } else {
            sortedDatas.push(data[i][this.numType + 'Num'])
          }
        }
        sortedDatas.push(data[i][this.numType + 'Num'])
        datasets.push({
          label: data[i]['_id']['Year'] + ' Year ',
          data: sortedDatas
        })
      } else if (this.timespan == 'year-day') {
        for (var i = 1; i <= 366; i++) {
          labels.push(i)
        }
        for (var i = 0; i < data.length -  1; i++) {
          if (data[i]['_id']['Year'] != data[i + 1]['_id']['Year']) {
            sortedDatas.push(data[i][this.numType + 'Num'])
            datasets.push({
              label: data[i]['_id']['Year'] + ' Year ',
              data: sortedDatas
            })
            sortedDatas = []
          } else {
            sortedDatas.push(data[i][this.numType + 'Num'])
          }
        }
        sortedDatas.push(data[i][this.numType + 'Num'])
        datasets.push({
          label: data[i]['_id']['Year'] + ' Year ',
          data: sortedDatas
        })
      }
      for (var i = 0; i < datasets.length; i++) {
        datasets[i].backgroundColor = this.colors[i]
      }
      return {labels: labels, datasets: datasets}
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
