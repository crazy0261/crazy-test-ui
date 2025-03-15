import { request } from '@umijs/max';

export async function userListApi(params) {
  return request('/crazy/user/list', {
    method: 'GET',
    params: params,
  });
}

export async function userListApi1(options) {
  return request('/user/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}
