import { request } from '@umijs/max';

export async function post(url, body, options) {
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function postFprmData(url, options) {
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

export async function postHeader(url, header, body, options) {
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': header,
    },
    data: body,
    ...(options || {}),
  });
}

export async function get(url, params) {
  return request(url, {
    method: 'GET',
    params: params,
  });
}
