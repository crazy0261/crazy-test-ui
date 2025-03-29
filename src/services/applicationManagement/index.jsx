/*
 * @Author: Menghui
 * @Date: 2025-03-22 20:03:28
 * @LastEditTime: 2025-03-29 14:17:36
 * @Description: 任务请求
 */
import { request } from '@umijs/max';

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
export async function deleteApplication(options) {
  return request('/api/application/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}
