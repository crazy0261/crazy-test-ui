/*
 * @Author: Menghui
 * @Date: 2025-03-20 23:07:43
 * @LastEditTime: 2025-04-22 23:43:58
 * @Description:
 */
import { get, post } from '../../utils/requestUtil';

export async function deleteTask(body) {
  return post('/crazy/task/schedule/delete', body);
}

export async function list(params) {
  return get('/crazy/task/schedule/list', params);
}

export async function queryById(params) {
  return get('/crazy/task/schedule/query', params);
}

export async function execOnce(body) {
  return post('/crazy/task/schedule/execute', body);
}

/** 保存任务信息 */
export async function save(body) {
  return post('/crazy/task/schedule/save', body);
}
