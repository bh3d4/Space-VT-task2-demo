import {Router} from 'express'
import apiResult from '../common/result'
import rest from './rest'

const router = Router()

router.all('*', (req, res, next) => {
  console.log('PASS-API [SELF]:', req.url)
  next()
})


router.get('/imfdata', rest.getData)

export default router