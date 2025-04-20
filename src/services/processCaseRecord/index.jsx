/*
 * @Author: Menghui
 * @Date: 2025-04-20 02:23:24
 * @LastEditTime: 2025-04-20 10:05:09
 * @Description:
 */
import { get } from '../../utils/requestUtil';

/** 查询场景用例分页 */
export async function querResultById(params) {
  return get('/crazy/process/case/result/detail/id', params);
}
