/*
 * @Author: Menghui
 * @Date: 2025-04-23 16:16:27
 * @LastEditTime: 2025-04-23 23:16:52
 * @Description:任务详情
 */
import { get } from '../../utils/requestUtil';

/**
 * 任务详情列表
 * @param {*} params
 * @returns
 */
export async function taskQueryList(params) {
  return get('/crazy/task/schedule/record/list', params);
}

/**
 * 批次任务用例详情列表
 */

export async function queryScheduleBatchList(params) {
  return get('/crazy/task/schedule/record/case/detail/list', params);
}

/**
 * 执行统计
 */

export async function queryHeaderRecordDetail(params) {
  return get('/crazy/task/schedule/record/case/detail/list', params);
}
