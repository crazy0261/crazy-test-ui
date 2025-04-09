import { get, post } from '../../utils/requestUtil';

/** 查询加密列表 */
export async function listPage(params) {
  return get('/crazy/encrypt/info/list', params);
}

/** 保存 */
export async function save(body) {
  return post('/crazy/encrypt/info/save', body);
}

/** 删除 */
export async function del(body) {
  return post('/crazy/encrypt/info/del', body);
}
