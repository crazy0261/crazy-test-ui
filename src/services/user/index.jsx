import { get, post } from '../../utils/requestUtil';

/**
 *
 * @param {用户列表} params
 * @returns
 */
export async function userListApi(params) {
  return get('/crazy/user/list', params);
}

export async function userListApi1(body) {
  return post('/user/list', body);
}

/**
 * 保存用户
 * @param {*} body
 * @returns
 */
export async function save(body) {
  return post('/crazy/user/save', body);
}

/**
 * 删除用户
 * @param {*} body
 * @returns
 */
export async function del(body) {
  return post('/crazy/user/del', body);
}
