import axios from '@/libs/api.request'

// 获取全部权限数据
export const getAllPermissionList = (params) => {
  return axios.getRequest('/permission/getAllList', params)
};

// 添加权限
export const addPermission = (params) => {
  return axios.postRequest('/permission/add', params)
};
// 编辑权限
export const editPermission = (params) => {
  return axios.postRequest('/permission/edit', params)
};
// 删除权限
export const deletePermission = (ids, params) => {
  return axios.deleteRequest(`/permission/delByIds/${ids}`, params)
};
