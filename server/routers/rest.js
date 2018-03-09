import apiResult from '../common/result'
import ImfData from '../methods/rest'
import conext from '../middlewares/conext'

export const getData = conext(async (req, res) => {
	let params = req.query
	let timeArray = params.time.split('|')
	for (let i = 0; i < timeArray.length; i++) {
		timeArray[i] = timeArray[i].split('-')
	}
	let query = {$or: []}
	if (params.timespan == 'day') {
		for (let i = 0; i < timeArray.length; i++) {
			query['$or'].push({'DecimalDay': timeArray[i][1], 'Year': timeArray[i][0]})
		}
	} else if (params.timespan == 'month') {
		for (let i = 0; i < timeArray.length; i++) {
			query['$or'].push({'Month': timeArray[i][1], 'Year': timeArray[i][0]})
		}
	}
  let datas = await ImfData.getByQuery(query, 'Year Month Hour DecimalDay ' + params.element)
  return res.send(apiResult({data: datas}))
})

export default { getData }