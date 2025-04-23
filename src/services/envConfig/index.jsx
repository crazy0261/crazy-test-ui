/*
 * @Author: Menghui
 * @Date: 2025-03-19 22:35:45
 * @LastEditTime: 2025-04-19 19:03:13
 * @Description:
 */
import { get, post } from '../../utils/requestUtil';

/** 查询所有环境名称 */
export async function listAllEnvName() {
  return get('/api/envname/listAll');
}

/** 分页查询环境列表 */
export async function list(params, sort) {
  return get('/crazy/env/config/list', { ...params, sort: sort?.envSort });
}

/** 编辑 */
export async function save(body) {
  return post('/crazy/env/config/save', body);
}

/** 删除 */
export async function del(body) {
  return post('/crazy/env/config/delete', body);
}

/** 详情 */
export async function queryById(params) {
  return get('/crazy/env/config/queryById', params);
}

/** 全部环境 */
export async function listAll(params) {
  return get('/crazy/env/config/list/all', params);
}

/** 应用下所有环境 */
export async function envAppList(params) {
  return get('/crazy/env/config/app/list', params);
}

/** 应用下所有环境顺序 */
export async function envSortList(params) {
  return get('/crazy/env/config/env/sort', params);
}
