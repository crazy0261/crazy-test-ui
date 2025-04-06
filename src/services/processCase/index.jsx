import { get, post } from '../../utils/requestUtil';

/** 查询场景用例分页 */
export async function list(params) {
  return get('/crazy/process/case/list', params);
}

/** 保存场景用例分页 */
export async function save(body) {
  return post('/crazy/process/case/save', body);
}
