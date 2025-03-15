import { request } from '@umijs/max';

/** 查询当前项目下所有接口用例 */
export async function listAll(options) {
  return request('/api/apiTestcase/listAll', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 分页查询接口列表 */
export async function list(body, options) {
  return request('/api/apiTestcase/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据用例id查询用例 */
export async function queryById(options) {
  return request('/api/apiTestcase/queryById', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 根据用例名模糊查询用例 */
export async function queryByLikeName(options) {
  return request('/api/apiTestcase/queryByLikeName', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 新增接口 */
export async function add(body, options) {
  return request('/api/apiTestcase/add', {
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
  return request('/api/apiTestcase/modify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除接口用例 */
export async function deleteApi(options) {
  return request('/api/apiTestcase/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 调试接口 */
export async function debug(body, options) {
  return request('/api/apiTestcase/debug', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据用例id和环境名id获取domian */
export async function getDomainByEnv(body, options) {
  return request('/api/apiTestcase/getDomainByEnv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量查询用例信息 */
export async function batchQueryTestcase(options) {
  return request('/api/apiTestcase/batchQueryTestcase', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 批量执行测试用例 */
export async function batchExec(body, options) {
  return request('/api/apiTestcase/batchExec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 复制用例 */
export async function copy(options) {
  return request('/api/apiTestcase/copy', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 下架用例 */
export async function disable(options) {
  return request('/api/apiTestcase/disable', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 上架用例 */
export async function enable(options) {
  return request('/api/apiTestcase/enable', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 批量修改负责人 */
export async function modifyOwner(options) {
  return request('/api/apiTestcase/modify/owner', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 生成断言 */
export async function genAsserts(options) {
  return request('/api/apiTestcase/genAsserts', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 查询接口用例执行记录 */
export async function queryApiCaseExecLog(body, options) {
  return request('/api/apiTestcase/queryExecLog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 执行应用下的所有接口用例 */
export async function debugByApp(options) {
  return request('/api/apiTestcase/debugByApp', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}
