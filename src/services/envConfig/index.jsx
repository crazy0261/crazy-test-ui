import { get, post } from '../../utils/requestUtil';

/** 查询所有环境名称 */
export async function listAllEnvName() {
  return get('/api/envname/listAll');
}

/** 分页查询环境列表 */
export async function list(body) {
  return get('/crazy/env/config/list', body);
}

/** 编辑 */
export async function save(body) {
  return post('/crazy/env/config/save', body);
}

/** 详情 */
export async function queryById(params) {
  return get('/crazy/env/config/queryById', params);
}

/** 全部环境 */
export async function listAll(params) {
  return get('/crazy/env/config/list/all', params);
}
