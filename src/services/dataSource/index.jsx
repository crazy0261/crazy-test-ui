/*
 * @Author: Menghui
 * @Date: 2025-04-08 22:29:34
 * @LastEditTime: 2025-04-13 20:58:31
 * @Description:
 */
import { get, post } from '../../utils/requestUtil';

/** 新增 修改*/
export async function save(body) {
  return post('/crazy/data/source/config/save', body);
}

/** 列表查询*/
export async function list(params) {
  return get('/crazy/data/source/config/list', params);
}

/** 测试 连接*/
export async function testConnect(body) {
  return post('/crazy/data/source/config/connection', body);
}

/** 删除配置*/
export async function del(body) {
  return post('/crazy/data/source/config/del', body);
}

/** 获取应用下数据库*/
export async function getAppList(params) {
  return get('/crazy/data/source/config/app/list', params);
}
