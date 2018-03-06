// app Vue instance
var app = new Vue({
  // app initial state
  data () {
    return {
      loading: false,
      timespan: 'day',
      compare: 'false',
      time1: '1',
      time2: '',
      element: 'HeliographicInertialLatitudeoftheEarth',
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      var params = this.validateInput()
      if (params == 'invalid') {
        alert('Please Enter the valid ' + this.timespan)
        return
      }
      this.loading = true
      this.$http.get('http://ec2-54-186-112-54.us-west-2.compute.amazonaws.com//api/v1/imfdata', {params: params}).then(res => {
        var data = res.body.data
        var temp = this.processData(data)
        this.drawCanvas(temp)
        this.loading = false
      }, response => {
        // error callback
      });      
    },
    validateInput () {
      var _self = this
      var params = {
        timespan: _self.timespan,
        compare: _self.compare,
        time1: _self.time1,
        time2: _self.time2,
      }
      if (params.timespan == 'day') {
        if (parseInt(params.time1) > 365 || parseInt(params.time1) < 1) {
          return 'invalid'
        }
      } else if (params.timespan == 'month') {
        if (parseInt(params.time1) > 12 || parseInt(params.time1) < 1) {
          return 'invalid'
        }
      }
      return params
    },
    processData (data) {
      var labels = []
      var datas = []
       if (this.compare == 'true') {
        // to be continue
       } else if (this.compare == 'false') {
          if (this.timespan == 'day') {
            for (var i = 0; i < data.length; i++) {
              labels.push(i + '')
              datas.push(data[i][this.element])
            }
          } else if (this.timespan == 'month') {
            for (var i = 0; i < data.length; i++) {
              labels.push(data[i].DecimalDay + '-' + data[i].Hour)
              datas.push(data[i][this.element])
            }
          }
       }
       return {labels: labels, datas: datas}
    },
    drawCanvas (temp) {
      var ctx = document.getElementById("myChart").getContext('2d');
      var datasets = []
      if (this.compare == 'true') {
        // to be continue
      } else if (this.compare == 'false') {
        datasets[0] = {
          label: this.timespan + '-' + this.time1 + '-' + this.element,
          data: temp.datas,
          borderColor: 'rgba(255, 99, 132, 0.2)'
        }
      }
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: temp.labels,
          datasets: datasets
        },
        options: {}
      });
    }
  }
})


// mount
app.$mount('.app')