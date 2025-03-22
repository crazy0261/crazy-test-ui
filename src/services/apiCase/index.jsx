import { get, post } from '../utils/requestUtil';

/** 查询当前项目下所有接口用例 */
export async function listAll(body) {
  return post('/api/apiTestcase/listAll', body);
}

/** 分页查询接口列表 */
export async function list(body) {
  return post('/crazy/api/case/list', body);
}

/** 根据用例id查询用例 */
export async function queryById(params) {
  return get('/crazy/api/case/getById', params);
}

/** 根据用例名模糊查询用例 */
export async function queryByLikeName(body) {
  return post('/api/apiTestcase/queryByLikeName', body);
}

/** 新增接口 */
export async function add(body) {
  return post('/api/apiTestcase/add', body);
}

/** 编辑接口 */
export async function modify(body) {
  return post('/api/apiTestcase/modify', body);
}

/** 删除接口用例 */
export async function deleteApi(body) {
  return post('/api/apiTestcase/delete', body);
}

/** 调试接口 */
export async function debug(body, options) {
  return post('/api/apiTestcase/debug', body);
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
  return post('/api/apiTestcase/copy', body);
}

/** 下架用例 */
export async function disable(body) {
  return post('/api/apiTestcase/disable', body);
}

/** 上架用例 */
export async function enable(body) {
  return post('/api/apiTestcase/enable', body);
}

/** 批量修改负责人 */
export async function modifyOwner(body) {
  return post('/api/apiTestcase/modify/owner', body);
}

/** 生成断言 */
export async function genAsserts(body) {
  return post('/api/apiTestcase/genAsserts', body);
}

/** 查询接口用例执行记录 */
export async function queryApiCaseExecLog(body) {
  return post('/api/apiTestcase/queryExecLog', body);
}

/** 执行应用下的所有接口用例 */
export async function debugByApp(body) {
  return post('/api/apiTestcase/debugByApp', body);
}
