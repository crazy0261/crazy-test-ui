import { get } from '../../utils/requestUtil';

/** 查询场景用例分页 */
export async function list(params) {
  return get('/crazy/process/case/list', params);
}
