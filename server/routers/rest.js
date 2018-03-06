import apiResult from '../common/result'
import imfData from '../methods/rest'
import conext from '../middlewares/conext'

const DecimalDaytoMonthMap = [[1, 31], [32, 59], [60, 90], 
															[91, 120], [121, 151], [152, 181], 
															[182, 212], [213, 243], [244, 273],
															[274, 304], [305, 334], [335, 365]]

export const getData = conext(async (req, res) => {
	let query = req.query
	let opts = {}
	if (query.compare == 'true') {
		let time1 = query.time1
		let time2 = query.time2
		if (query.timespan == 'day') {
			opts = {
				$or: [
					{'DecimalDay': time1},
					{'DecimalDay': time2}
				]
			}		
		} else if (query.timespan == 'month') {
			opts = {
				$or: [
					{'DecimalDay': {$lte: DecimalDaytoMonthMap[parseInt(time1) - 1][1], $gte: DecimalDaytoMonthMap[parseInt(time1) - 1][0]}},
					{'DecimalDay': {$lte: DecimalDaytoMonthMap[parseInt(time2) - 1][1], $gte: DecimalDaytoMonthMap[parseInt(time2) - 1][0]}}
				]
			}
		}
	} else if (query.compare == 'false') {
		let time = query.time1
		if (query.timespan == 'day') {
			opts = {'DecimalDay': time}
		} else if (query.timespan == 'month') {
			opts = {'DecimalDay': {$lte: DecimalDaytoMonthMap[parseInt(time) - 1][1], 
														 $gte: DecimalDaytoMonthMap[parseInt(time) - 1][0]}}

		}
	}
  let imfDatas = await imfData.getByQuery(opts)
  return res.send(apiResult({data: imfDatas}))
})

export default { getData }