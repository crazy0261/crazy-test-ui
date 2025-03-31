import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(account: any) {
  return request<{
    data: API.CurrentUser;
  }>('/crazy/user/currentUser', {
    method: 'GET',
    params: { account },
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams) {
  const md5 = require('md5');

  return request<API.LoginResult>('/crazy/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { account: body.account, password: md5(body.password) },
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

const domain = '';

/** 注册账号接口 */
export async function register(options: any) {
  return request(domain + '/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 更新选择的项目id */
export async function updateSelectProjectId(params: any) {
  return request('/crazy/user/update/projectId', {
    method: 'GET',
    params: params,
  });
}

/** 更新选择的环境id */
export async function updateSelectEnvId(options: any) {
  return request(domain + '/api/user/updateSelectEnvId', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 查询当前租户下的所有用户 */
export async function listAll() {
  return request('/crazy/user/list/all', {
    method: 'GET',
  });
}

/** 修改用户信息 */
export async function modify(body: any, options: any) {
  return request('/api/user/modify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改密码 */
export async function modifyPassword(options: any) {
  return request(domain + '/api/user/modifyPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 重置密码：将密码重置为123456 */
export async function resetPassword(options: any) {
  return request(domain + '/api/user/resetPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}
