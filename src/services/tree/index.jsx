import { get, post } from '../../utils/requestUtil';

/** 查询tree */
export async function queryByPoject(params) {
  return get('/crazy/tree/project', params);
}

/** 保存tree */
export async function addNode(data) {
  return post('/crazy/tree/node/add', data);
}

/** 保存tree */
export async function updateNode(data) {
  return post('/crazy/tree/node/update', data);
}

/** 保存tree */
export async function deleteNode(data) {
  return post('/crazy/tree/node/delete', data);
}

/** 更新tree */
export async function treeSave(data) {
  return post('/crazy/tree/save', data);
}
