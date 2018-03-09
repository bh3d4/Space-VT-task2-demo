import {merge} from 'lodash'
export default arg => {
  let res = {
    success: true,
    error: null,
    data: null,
    code: 0
  }
  return merge(res, arg)
}