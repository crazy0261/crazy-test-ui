import { get, post } from '../utils/requestUtil';

export async function userListApi(params) {
  return get('/crazy/user/list', params);
}

export async function userListApi1(body) {
  return post('/user/list', body);
}
