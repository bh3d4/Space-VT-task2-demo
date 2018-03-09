import mongoose from 'mongoose'
const Schema = mongoose.Schema
let ImfSchema = new Schema({
	Year: Number,
	DecimalDay: Number,
	Hour: Number,
	Month: Number,
	HeliographicInertialLatitudeoftheEarth: Number,
	HeliographicInertialLongitudeoftheEarth: Number,
	BR_RTN: Number,
	BT_RTN: Number,
	BN_RTN: Number,
	FieldMagnitudeAverage: Number,
	BulkFlowspeed: Number,
	THETA: Number,
	PHI: Number,
	IONDensity: Number,
	Temperature: Number,
})

let ImfModel = mongoose.model('new_ImfModel', ImfSchema)

export default ImfModel