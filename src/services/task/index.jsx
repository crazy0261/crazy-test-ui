/*
 * @Author: Menghui
 * @Date: 2025-03-20 23:07:43
 * @LastEditTime: 2025-03-30 17:42:39
 * @Description:
 */
import { get, post } from '../../utils/requestUtil';

export async function add(body) {
  return post('/api/schedule/add', body);
}

export async function modify(body) {
  return post('/api/schedule/modify', body);
}

export async function deleteTask(body) {
  return post('/crazy/task/schedule/delete', body);
}

export async function list(params) {
  return get('/crazy/task/schedule/list', params);
}

export async function queryById(params) {
  return get('/crazy/task/schedule/query', params);
}

export async function stop(body) {
  return post('/api/schedule/stop', body);
}

export async function execOnce(body) {
  return post('/crazy/task/schedule/execute"', body);
}

export async function queryRecord(body) {
  return post('/api/schedule/queryRecord', body);
}

export async function queryRecordDetail(body) {
  return post('/api/schedule/queryRecordDetail', body);
}

export async function queryRecordStatistics(body) {
  return post('/api/schedule/queryRecordStatistics', body);
}

// 重跑失败用例
export async function execRetry(body) {
  return post('/api/schedule/execRetry', body);
}

/** 中断执行中的批次 */
export async function interrupt(body) {
  return post('/api/schedule/interrupt', body);
}

/** 更新场景用例定时任务执行记录状态 */
export async function updateScheduleStatus(body) {
  return post('/api/schedule/updateScheduleStatus', body);
}

/** 保存任务信息 */
export async function save(body) {
  return post('/crazy/task/schedule/save', body);
}
