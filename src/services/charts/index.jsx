import { get } from '../../utils/requestUtil';

/** 新增 修改*/
export async function coreIndicatorsDetail(params) {
  return get('/crazy/daily/data/coreIndicators/detail', params);
}
