/*
 * @Author: Menghui
 * @Date: 2025-03-20 21:47:49
 * @LastEditTime: 2025-04-12 13:34:03
 * @Description:
 */
import { get, post } from '../../utils/requestUtil';

/** 分页查询测试账号列表 */
export async function listPage(body) {
  return get('/crazy/test/account/list', body);
}

/** 新增 修改 */
export async function save(body) {
  return post('/crazy/test/account/save', body);
}

/** 删除 */
export async function deleteTestAccount(body) {
  return post('/crazy/test/account/del', body);
}

/** 单个账号生成token */
export async function createToken(body) {
  return post('/crazy/test/account/token', body);
}

/** 获取指定环境账号 */
export async function queryEnvTestAccount(body) {
  return post('/crazy/test/account/query/env', body);
}
