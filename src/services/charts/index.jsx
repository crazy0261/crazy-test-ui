import { get, post } from '../../utils/requestUtil';

/**获取全部指标信息*/
export async function coreIndicatorsDetail(params) {
  return get('/crazy/daily/data/coreIndicators/detail', params);
}

/** 用例趋势*/
export async function caseDetail(body) {
  return post('/crazy/daily/data/case/detail', body);
}
