import { get, post } from '../utils/requestUtil';

/** 分页查询 */
export async function listPage(params) {
  return get('/crazy/project/management/list', params);
}

/** 新增 编辑 */
export async function save(body) {
  return post('/crazy/project/management/save', body);
}

/** 删除 */
export async function deleteById(body) {
  return post('/crazy/project/management/delete', body);
}

export async function listAllEnvName() {
  return get('/api/envname/listAll');
}
