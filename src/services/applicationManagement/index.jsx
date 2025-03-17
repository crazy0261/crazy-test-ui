// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 分页查询应用列表 */
export async function list(body, options) {
  return request('/api/application/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询项目下所有应用 */
export async function listAll(options) {
  return request('/api/application/listAll', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...(options || {}),
  });
}

/** 新增应用 */
export async function add(body, options) {
  return request('/api/application/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑 */
export async function modify(body, options) {
  return request('/api/application/modify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
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
