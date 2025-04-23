/*
 * @Author: Menghui
 * @Date: 2025-04-20 02:23:24
 * @LastEditTime: 2025-04-22 23:13:08
 * @Description:
 */
import { get } from '../../utils/requestUtil';

/** 查询场景用例分页 */
export async function querResultById(params) {
  return get('/crazy/process/case/result/detail/id', params);
}

/** 查询执行记录用例分页 */
export async function querResultLogs(params) {
  return get('/crazy/process/case/result/log/list', params);
}
