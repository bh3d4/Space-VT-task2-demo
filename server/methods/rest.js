import ImfModel from '../models/imfModel'

/**
 * 获取所有符合条件的数据
 */
export const getByQuery = (query, fields, opt) => {
  return ImfModel.find(query, fields, opt).exec()
}

export default { getByQuery }