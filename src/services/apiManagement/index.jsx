import { request } from '@umijs/max';
import { get, post } from '../../utils/requestUtil';

/** 分页查询接口列表 */
export async function list(body) {
  return post('/crazy/api/management/list', body);
}

/** 保存 */
export async function save(body) {
  return post('/crazy/api/management/save', body);
}

/** 根据id查询接口 */
export async function queryApiById(parmas) {
  return get('/crazy/api/management/get/id', parmas);
}

/** 新增接口 */
export async function add(body, options) {
  return request('/api/apimanage/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑接口 */
export async function modify(body, options) {
  return request('/api/apimanage/modify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除接口 */
export async function deleteApi(options) {
  return request('/api/apimanage/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 通过swagger地址导入接口 */
export async function importApi(options) {
  return request('/api/apimanage/importApi', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 通过JSON导入接口 */
export async function importApiByJson(options) {
  return request('/api/apimanage/importApiByJson', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 认领接口 */
export async function claim(options) {
  return request('/api/apimanage/claim', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 取消认领 */
export async function cancelClaim(options) {
  return request('/api/apimanage/cancelClaim', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 设置接口优先级 */
export async function setPriority(options) {
  return request('/api/apimanage/setPriority', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 设置是否可在生产执行 */
export async function setProdExec(body) {
  return post('/crazy/api/management/batch/update/prod', body);
}

/** 下架接口 */
export async function disable(body) {
  return post('/crazy/api/management/batch/update/down', body);
}

/** 上架接口 */
export async function enable(boday) {
  return post('/crazy/api/management/batch/update/up', boday);
}

/** 查询关联用例 */
export async function queryRelateCase(options) {
  return request('/api/apimanage/queryRelateCase', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 移动 */
export async function move(options) {
  return request('/api/apimanage/move', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 通过fetch导入接口 */
export async function importByFetch(options) {
  return request('/api/apimanage/importByFetch', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 批量删除接口 */
export async function batchDelete(body) {
  return post('/crazy/api/management/batch/update/delete', body);
}

/** 批量修改接口类型 */
export async function batchModApiType(body) {
  return post('/crazy/api/management/batch/update/type', body);
}

/** 批量移动接口到应用 */
export async function batchMove(body) {
  return post('/crazy/api/management/batch/update/move', body);
}

/** 批量设置优先级 */
export async function batchSetPriority(body) {
  return post('/crazy/api/management/batch/update/setPriority', body);
}

/** 批量设置负责人 */
export async function batchOwner(body) {
  return post('/crazy/api/management/batch/update/owner', body);
}

/** curl导入 */
export async function cURLApiImport(body) {
  return post('/crazy/api/management/curl/import', body);
}

/** swagger导入 */
export async function swaggerApiImport(body) {
  return post('/crazy/api/management/swagger/import', body);
}
