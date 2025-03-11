import { request } from '@umijs/max';

export async function login(options) {
  return request('user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}
