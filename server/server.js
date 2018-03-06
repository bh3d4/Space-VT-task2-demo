import express, {Router} from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import restRouter from './routers/index.js'

const app = express()

mongoose.connect("mongodb://user:123456@ds129422.mlab.com:29422/space_vt_demo")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  next()
})

app.use("/api/v1", restRouter)

app.listen(5000)
