import { get, post } from '../../utils/requestUtil';

/** 新增 修改*/
export async function save(body) {
  return post('/crazy/data/source/config/save', body);
}

export async function list(body) {
  return get('/crazy/data/source/config/list', body);
}

export async function testConnect(body) {
  return post('/crazy/data/source/config/connection', body);
}

export async function del(body) {
  return post('/crazy/data/source/config/del', body);
}
