import mongoose from 'mongoose'
const Schema = mongoose.Schema
let ImfSchema = new Schema({
	Year: Number,
	DecimalDay: Number,
	Hour: Number,
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

let imfModel = mongoose.model('ImfModel', ImfSchema)

export default imfModel