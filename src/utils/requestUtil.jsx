/*
 * @Author: Menghui
 * @Date: 2025-03-15 15:48:09
 * @LastEditTime: 2025-04-19 12:28:05
 * @Description: 请求方式封装
 */
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
