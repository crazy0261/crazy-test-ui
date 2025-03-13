// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 分页查询接口列表 */
export async function list(body, options) {
  return request('/api/apimanage/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询应用下所有接口 */
export async function listAllByAppId(options) {
  return request('/api/apimanage/listAllByAppId', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 根据id查询接口 */
export async function queryById(options) {
  return request('/api/apimanage/queryById', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
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
export async function setProdExec(options) {
  return request('/api/apimanage/setProdExec', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 下架接口 */
export async function disable(options) {
  return request('/api/apimanage/disable', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 上架接口 */
export async function enable(options) {
  return request('/api/apimanage/enable', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
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

/** 复制 */
export async function copy(options) {
  return request('/api/apimanage/copy', {
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
export async function batchDelete(options) {
  return request('/api/apimanage/batchDelete', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 批量修改接口类型 */
export async function batchModApiType(options) {
  return request('/api/apimanage/batchModApiType', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}
