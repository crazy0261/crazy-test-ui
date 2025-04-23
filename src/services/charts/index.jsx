/*
 * @Author: Menghui
 * @Date: 2025-04-17 22:58:04
 * @LastEditTime: 2025-04-21 22:17:09
 * @Description:
 */
import { get, post } from '../../utils/requestUtil';

/**获取全部指标信息*/
export async function coreIndicatorsDetail(params) {
  return get('/crazy/daily/data/coreIndicators/detail', params);
}

/** 用例趋势*/
export async function caseDetail(body) {
  return post('/crazy/daily/data/case/detail', body);
}

/**获取全部未加入定时任务/未断言/执行失败信息*/
export async function queryStatisticsDetail(params) {
  return get('/crazy/daily/data/statistics/detail', params);
}
