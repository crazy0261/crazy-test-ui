import { get, post } from '../utils/requestUtil';

/** 查询所有环境名称 */
export async function listAllEnvName() {
  return get('/api/envname/listAll');
}

/** 分页查询环境列表 */
export async function list(body) {
  return post('/api/envinfo/list', body);
}

/** 编辑 */
export async function modify(body) {
  return post('/api/envinfo/modify', body);
}
