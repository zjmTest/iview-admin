import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    username: userName,
    password: password
  };
  return axios.request({
    url: '/user/login',
    data,
    method: 'post'
  })
};

export const getUserInfo = (token) => {
  return axios.request({
    url: '/user/getUserInfo',
    params: {
      token
    },
    method: 'get'
  })
};

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
};
export const getUserSysMenu = () => {
  return axios.request({
    url: 'getUserSysMenu',
    method: 'post'
  })
};
