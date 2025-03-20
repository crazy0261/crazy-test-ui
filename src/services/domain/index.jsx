import { post } from '../utils/requestUtil';

/** 新增 */
export async function add(body) {
  return post('/api/domain/add', body);
}

/** 修改 */
export async function modify(body) {
  return post('/api/domain/modify', body);
}

/** 删除 */
export async function deleteById(body) {
  return post('/api/domain/delete', body);
}

/** 查询所有 */
export async function listAll() {
  return post('/api/domain/listAll', body);
}

/** 分页查询 */
export async function listPage(body) {
  return post('/api/domain/listPage', body);
}

/** 根据id查询 */
export async function queryById(body) {
  return post('/api/domain/queryById', body);
}
