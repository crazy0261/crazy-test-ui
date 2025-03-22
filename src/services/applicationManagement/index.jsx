// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

import { get, post } from '@/services/utils/requestUtil';

/** 分页查询应用列表 */
export async function list(body) {
  return get('/crazy/application/management/list', body);
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
