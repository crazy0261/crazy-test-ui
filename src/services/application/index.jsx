/*
 * @Author: Menghui
 * @Date: 2025-03-22 20:03:28
 * @LastEditTime: 2025-04-24 00:57:48
 * @Description: 任务请求
 */
import { get, post } from '@/utils/requestUtil';

/** 分页查询应用列表 */
export async function list(parasm) {
  return get('/crazy/application/management/list', parasm);
}

/** 分页查询应用列表 */
export async function listAll(parasm) {
  return get('/crazy/application/management/list/all', parasm);
}

/** 新增编辑 */
export async function save(body) {
  return post('/crazy/application/management/save', body);
}

/** 删除应用 */
export async function deleteApplication(body) {
  return post('/crazy/application/management/delete', body);
}
