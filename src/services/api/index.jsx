/*
 * @Author: Menghui
 * @Date: 2025-03-13 23:07:03
 * @LastEditTime: 2025-04-13 18:01:06
 * @Description:
 */
import { request } from '@umijs/max';
import { get, post } from '../../utils/requestUtil';

/** 分页查询接口列表 */
export async function list(body) {
  return post('/crazy/api/management/list', body);
}

/** 保存 */
export async function save(body) {
  return post('/crazy/api/management/save', body);
}

/** 根据id查询接口 */
export async function queryApiById(parmas) {
  return get('/crazy/api/management/get/id', parmas);
}

/** 设置是否可在生产执行 */
export async function setProdExec(body) {
  return post('/crazy/api/management/batch/update/prod', body);
}

/** 下架接口 */
export async function disable(body) {
  return post('/crazy/api/management/batch/update/down', body);
}

/** 上架接口 */
export async function enable(boday) {
  return post('/crazy/api/management/batch/update/up', boday);
}

/** 查询关联用例 */
export async function queryRelateCase(options) {
  return request('/api/apimanage/queryRelateCase', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: options,
  });
}

/** 批量删除接口 */
export async function batchDelete(body) {
  return post('/crazy/api/management/batch/update/delete', body);
}

/** 批量修改接口类型 */
export async function batchModApiType(body) {
  return post('/crazy/api/management/batch/update/type', body);
}

/** 批量移动接口到应用 */
export async function batchMove(body) {
  return post('/crazy/api/management/batch/update/move', body);
}

/** 批量设置优先级 */
export async function batchSetPriority(body) {
  return post('/crazy/api/management/batch/update/setPriority', body);
}

/** 批量设置负责人 */
export async function batchOwner(body) {
  return post('/crazy/api/management/batch/update/owner', body);
}

/** curl导入 */
export async function cURLApiImport(body) {
  return post('/crazy/api/management/curl/import', body);
}

/** swagger导入 */
export async function swaggerApiImport(body) {
  return post('/crazy/api/management/swagger/import', body);
}

/** 应用下所有用例 */
export async function appApiList(params) {
  return get('/crazy/api/management/app/list', params);
}
