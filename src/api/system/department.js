import axios from '@/libs/api.request'

// 获取一级部门
export const initDepartment = (params) => {
  return axios.getRequest('/department/getByParentId/0', params)
};
// 加载部门子级数据
export const loadDepartment = (id, params) => {
  return axios.getRequest(`/department/getByParentId/${id}`, params)
};
// 添加部门
export const addDepartment = (params) => {
  return axios.postRequest('/department/add', params)
};
// 编辑部门
export const editDepartment = (params) => {
  return axios.postRequest('/department/edit', params)
};
// 删除部门
export const deleteDepartment = (ids, params) => {
  return axios.deleteRequest(`/department/delByIds/${ids}`, params)
};
