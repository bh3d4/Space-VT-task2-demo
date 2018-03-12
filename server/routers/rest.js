import apiResult from '../common/result'
import ImfData from '../methods/rest'
import conext from '../middlewares/conext'
import {isEqual, keys} from 'lodash'

const invalidNumberMap = {
	HeliographicInertialLatitudeoftheEarth: 9999.9,
	HeliographicInertialLongitudeoftheEarth: 9999.9,
	BR_RTN: 999.9,
	BT_RTN: 999.9,
	BN_RTN: 999.9,
	FieldMagnitudeAverage: 999.9,
	BulkFlowspeed: 9999,
	THETA: 999.9,
	PHI: 999.9,
	IONDensity: 999.9,
	Temperature: 9999999
}

export const getData = conext(async (req, res) => {
	let params = req.query
	let datas = null
	let timeArray = params.time.split('|')
	let numType = params.numType
	let opts = [{$project: {Year: 1, Month: 1, Hour: 1, DecimalDay: 1}},
							{$match: {$or: []}}, 
							{$group: {_id: {}}},
							{$sort: {}}]
	opts[0]['$project'][params.element] = 1
	if (params.timespan == 'day-hour' || params.timespan == 'month-day') {
		for (let i = 0; i < timeArray.length; i++) {
			timeArray[i] = timeArray[i].split('-')
		}
	}
	if (params.timespan !== 'day') {
		if (numType == 'avg') {
			opts[2]['$group']['avgNum'] = {$avg: { $sum: '$' + params.element }}
		} else if (numType == 'max') {
			opts[2]['$group']['maxNum'] = { $max: '$' + params.element }
		} else if (numType == 'min') {
			opts[2]['$group']['minNum'] = { $min: '$' + params.element }
		}
	}
	if (params.timespan == 'day-hour') {
		let query = {$or: []}
		for (let i = 0; i < timeArray.length; i++) {
			query['$or'].push({
				DecimalDay: timeArray[i][1],
				Year: timeArray[i][0]
			})
			query[params.element] = {$ne: invalidNumberMap[params.element]}
		}
		let imfdatas = ImfData.getByQuery(query, 'Year Month Hour DecimalDay ' + params.element)
		datas = await imfdatas.sort({Year: 1, DecimalDay: 1, Hour: 1})
	} else if (params.timespan == 'month-day') {
		for (let i = 0; i < timeArray.length; i++) {
			opts[1]['$match']['$or'].push({Year: parseInt(timeArray[i][0]), Month: parseInt(timeArray[i][1])})
		}
		opts[2]['$group']['_id'] = {
			Year: '$Year',
			Month: '$Month',
			DecimalDay: '$DecimalDay'
		}
		opts[3]['$sort'] = {
			'_id.Year': 1,
			'_id.Month': 1,
			'_id.DecimalDay': 1
		}
		datas = await ImfData.aggregate(opts)
	} else if (params.timespan == 'year-month' || params.timespan == 'year-day') {
		let prop = params.timespan == 'year-month' ? 'Month' : 'DecimalDay'
		for (let i = 0; i < timeArray.length; i++) {
			opts[1]['$match']['$or'].push({Year: parseInt(timeArray[i])})
		}
		opts[1]['$match'][params.element] = {$ne: invalidNumberMap[params.element]}
		opts[2]['$group']['_id']['Year'] = '$Year'
		opts[2]['$group']['_id'][prop] = '$' + prop
		opts[3]['$sort']['_id.Year'] = 1
		opts[3]['$sort']['_id.' + prop] = 1
		datas = await ImfData.aggregate(opts)
	}
  return res.send(apiResult({data: datas}))
})

export default { getData }