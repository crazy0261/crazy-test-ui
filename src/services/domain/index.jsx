import { get, post } from '../../utils/requestUtil';

/** 新增 修改*/
export async function save(body) {
  return post('/crazy/domain/save', body);
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
export async function listPage(params) {
  return get('/crazy/domain/list', params);
}

/** 根据id查询 */
export async function queryById(body) {
  return post('/api/domain/queryById', body);
}
