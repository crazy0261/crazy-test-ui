import { get, post } from '../utils/requestUtil';

/** 获取当前的用户 */
export async function getProjectList() {
  return get('/crazy/project/list');
}

/** 分页查询 */
export async function listPage(body) {
  return post('/crazy/project/management/list', body);
}

/** 新增 编辑 */
export async function save(body) {
  return post('/crazy/project/management/save', body);
}

/** 删除 */
export async function deleteById(body) {
  return post('/api/project/delete', body);
}
