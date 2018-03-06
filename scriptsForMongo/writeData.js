import fs from 'fs'
import imfModel from './models/imfModel.js'
import mongoose from 'mongoose'
mongoose.connect("mongodb://user:123456@ds129422.mlab.com:29422/space_vt_demo")
   .then(res => mongoose.connection)
   .catch(err => {
      console.log('连接失败')
   })


const writeinMongo = (year) => {
   let lines = []
   let count = 0
   // read the file
   let contents = fs.readFileSync('../IMF_DATA/omni_m' + year + '.dat', 'utf8')

   //split the file by using the ascii 10 char
   let content = contents.split(String.fromCharCode(10))

   // split each line using the space
   for (let i = 0; i < content.length; i++) {
      let tmp = content[i].split(" ")
      let res = []
      for (let j = 0; j < tmp.length; j++) {
         if (tmp[j].length > 0) res.push(parseFloat(tmp[j]))
      }
      if (res) {
         let imf = new imfModel({
                     Year: res[0],
                     DecimalDay: res[1],
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
                     Temperature: res[13]
                  })

         imf.save((err, success) => {
            if (err) {
               console.log('保存失败')
            } else {
               console.log('保存成功', count++)
            }
         })
      }
   }
}

for (let year = 2011; year < 2017; year++) {
   writeinMongo(year)
}
