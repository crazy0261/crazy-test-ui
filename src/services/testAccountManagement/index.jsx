import { get, post } from '../utils/requestUtil';

/** 分页查询测试账号列表 */
export async function listPage(body) {
  return get('/crazy/test/account/list', body);
}

/** 新增 */
export async function add(body) {
  return post('/api/testaccount/add', body);
}

/** 修改 */
export async function modify(body) {
  return post('/api/testaccount/modify', body);
}

/** 删除 */
export async function deleteTestAccount(body) {
  return post('/api/testaccount/delete', body);
}

/** 单个账号生成token */
export async function createToken(body) {
  return post('/api/testaccount/createToken', body);
}

/** 单个账号生成token */
export async function queryByTestAccount(body) {
  return post('/api/testaccount/queryByTestAccount', body);
}
