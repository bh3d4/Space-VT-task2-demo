import imfModel from '../models/imfModel'

/**
 * get by id
 * @param {String} id
 * @param {Function} callback
 */
export const getById = id => imfModel.findOne({_id: id}).exec()

export const getByName = name => imfModel.findOne({url: url}).exec()

/**
 * 获取所有符合条件的数据
 */
export const getByQuery = (query, opt) => {
  return imfModel.find(query, '', opt).exec()
}

export default { getByQuery }