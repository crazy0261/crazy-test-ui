/*
 * @Author: Menghui
 * @Date: 2025-04-23 16:16:27
 * @LastEditTime: 2025-04-23 16:17:17
 * @Description:任务详情
 */
import { get } from '../../utils/requestUtil';

export async function taskQueryList(params) {
  return get('/crazy/task/schedule/record/list', params);
}
