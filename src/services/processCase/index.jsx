import { get, post } from '../../utils/requestUtil';

/** 查询场景用例分页 */
export async function list(params) {
  return get('/crazy/process/case/list', params);
}

/** 保存场景用例分页 */
export async function save(body) {
  return post('/crazy/process/case/save', body);
}

/** 批量修改负责人 */
export async function batchUpdateOwner(body) {
  return post('/crazy/process/case/batch/update/owner', body);
}

/** 批量移动 */
export async function batchUpdateMove(body) {
  return post('/crazy/process/case/batch/update/move', body);
}

/** 批量上架用例 */
export async function batchUpdateUpCase(body) {
  return post('/crazy/process/case/batch/update/up', body);
}

/** 批量下架用例 */
export async function batchUpdateDownCase(body) {
  return post('/crazy/process/case/batch/update/down', body);
}

/** 复制用例 */
export async function copy(body) {
  return post('/crazy/process/case/copy', body);
}

/** 删除用例 */
export async function del(body) {
  return post('/crazy/process/case/delete', body);
}
