/*
 * @Author: Menghui
 * @Date: 2025-03-22 20:03:28
 * @LastEditTime: 2025-04-13 18:00:08
 * @Description: 接口管理管理
 */
import { get, post } from '../../utils/requestUtil';

/** 查询当前项目下所有接口用例 */
export async function listAll(body) {
  return post('/api/apiTestcase/listAll', body);
}

/** 分页查询接口列表 */
export async function list(body) {
  return get('/crazy/api/case/list', body);
}

/** 查询所有用例 */
export async function allList(params) {
  return get('/crazy/api/case/all/list', params);
}

/** 根据用例id查询用例 */
export async function queryById(params) {
  return get('/crazy/api/case/getById', params);
}

/** 根据用例名模糊查询用例 */
export async function queryByLikeName(body) {
  return post('/api/apiTestcase/queryByLikeName', body);
}

/** 新增/编辑接口 */
export async function save(body) {
  return post('/crazy/api/case/save', body);
}

/** 编辑接口 */
export async function modify(body) {
  return post('/api/apiTestcase/modify', body);
}

/** 删除接口用例 */
export async function deleteApi(body) {
  return post('/crazy/api/case/delete', body);
}

/** 调试接口 */
export async function debug(body) {
  return post('/crazy/api/case/debug', body);
}

/** 根据用例id和环境名id获取domian */
export async function getDomainByEnv(body) {
  return post('/api/apiTestcase/getDomainByEnv', body);
}

/** 批量查询用例信息 */
export async function batchQueryTestcase(body) {
  return post('/api/apiTestcase/batchQueryTestcase', body);
}

/** 批量执行测试用例 */
export async function batchExec(body) {
  return post('/api/apiTestcase/batchExec', body);
}

/** 复制用例 */
export async function copy(body) {
  return post('/crazy/api/case/copy', body);
}

/** 下架用例 */
export async function batchDown(body) {
  return post('/crazy/api/case/batch/down', body);
}

/** 上架用例 */
export async function batchUpdate(body) {
  return post('/crazy/api/case/batch/up', body);
}

/** 批量修改负责人 */
export async function batchOwner(body) {
  return post('/crazy/api/case/batch/owner', body);
}

/** 生成断言 */
export async function genAsserts(body) {
  return post('/api/apiTestcase/genAsserts', body);
}

/** 查询接口用例执行记录 */
export async function queryApiCaseExecLog(param) {
  return get('/crazy/api/case/result/list', param);
}

/** 执行应用下的所有接口用例 */
export async function debugByApp(body) {
  return post('/api/apiTestcase/debugByApp', body);
}
