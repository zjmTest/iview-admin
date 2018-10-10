import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  return axios.request({
    url: '/user/login',
    params: {
      loginId: userName,
      loginPwd: password
    },
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/user/getUserInfo',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
export const getUserSysMenu = () => {
  return axios.request({
    url: 'getUserSysMenu',
    method: 'post'
  })
}

// 获取用户数据 多条件
export const getUserListData = (params) => {
  return axios.getRequest('/user/getByCondition', params)
}
// 获取全部用户数据
export const getAllUserData = (params) => {
  return axios.getRequest('/user/getAll', params)
}
// 添加用户
export const addUser = (params) => {
  return axios.postRequest('/user/admin/addUser', params)
}
// 编辑用户
export const editUser = (params) => {
  return axios.postRequest('/user/admin/edit', params)
}
// 启用用户
export const enableUser = (id, params) => {
  return axios.postRequest(`/user/admin/enable/${id}`, params)
}
// 禁用用户
export const disableUser = (id, params) => {
  return axios.postRequest(`/user/admin/disable/${id}`, params)
}
// 删除用户
export const deleteUser = (ids, params) => {
  return axios.postRequest(`/user/delByIds/${ids}`, params)
}
// 个人中心修改密码
export const changePassord = (params) => {
  return axios.postRequest('/user/changePassord', params)
}
