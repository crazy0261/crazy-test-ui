/*
 * @Author: Menghui
 * @Date: 2025-04-10 22:41:27
 * @LastEditTime: 2025-04-10 22:43:29
 * @Description:
 */
import { get, post } from '../../utils/requestUtil';

/** 节点保存 */
export async function porcessNodeSave(body) {
  return post('/crazy/process/case/node/save', body);
}

/** 节点详情 */
export async function porcessNodeDetail(params) {
  return get('/crazy/process/case/node/detail', params);
}
