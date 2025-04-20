/*
 * @Author: Menghui
 * @Date: 2025-04-20 18:58:40
 * @LastEditTime: 2025-04-20 19:00:16
 * @Description:
 */
import { get } from '../../utils/requestUtil';

/** 节点保存 */
export async function processNodeResult(param) {
  return get('/crazy/process/case/node/result/detail', param);
}
