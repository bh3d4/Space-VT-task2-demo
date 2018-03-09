import fs from 'fs'
import mongoose from 'mongoose'
import imfModel from '../models/imfModel.js'

mongoose.connect("mongodb://user:123456@ds129422.mlab.com:29422/space_vt_demo", (err) => {
   if (err) throw err;
   console.log('Successfully connected')
   writeinMongo(2017)
})

const NonLeapYearDecimalDaytoMonthMap = [[1, 31], [32, 59], [60, 90], 
                              [91, 120], [121, 151], [152, 181], 
                              [182, 212], [213, 243], [244, 273],
                              [274, 304], [305, 334], [335, 365]]

const LeapYearDecimalDaytoMonthMap = [[1, 31], [32, 60], [61, 91], 
                              [92, 121], [122, 152], [153, 182], 
                              [183, 213], [214, 244], [245, 274],
                              [275, 305], [306, 335], [336, 366]]

let count = 0

const saveImfModel = (year, res, map) => {
   for (let i = 0; i < map.length; i++) {
      if(res[1] >= map[i][0] && res[1] <= map[i][1]) {
         res[14] = i + 1
      }
   }
   let imf = new imfModel({
                     Year: res[0],
                     DecimalDay: res[1],
                     Month: res[14],
                     Hour: res[2],
                     HeliographicInertialLatitudeoftheEarth: res[3],
                     HeliographicInertialLongitudeoftheEarth: res[4],
                     BR_RTN: res[5],
                     BT_RTN: res[6],
                     BN_RTN: res[7],
                     FieldMagnitudeAverage: res[8],
                     BulkFlowspeed: res[9],
                     THETA: res[10],
                     PHI: res[11],
                     IONDensity: res[12],
                     Temperature: res[13]})
   imf.save((err) => {
      if (err) throw err
      console.log('Successfully saved', year, count++)
   })
}

const writeinMongo = (year) => {
   let lines = []
   let map = []
   if (year % 4 == 0) {
      map = LeapYearDecimalDaytoMonthMap
   } else {
      map = NonLeapYearDecimalDaytoMonthMap
   }
   // read the file
   let contents = fs.readFileSync('../../IMF_DATA/omni_m' + year + '.dat', 'utf8')

   //split the file by using the ascii 10 char
   let content = contents.split(String.fromCharCode(10))

   // split each line using the space
   for (let i = 0; i < content.length; i++) {
      let tmp = content[i].split(" ")
      let res = []
      for (let j = 0; j < tmp.length; j++) {
         if (tmp[j].length > 0) res.push(parseFloat(tmp[j]))
      }
      if (res.length > 0) {
         saveImfModel(year, res, map)
      }
   }
}


