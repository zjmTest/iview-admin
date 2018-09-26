import axios from 'axios'
// import { Spin } from 'iview'
import {getToken, setToken} from '@/libs/util'
import {Message} from 'iview' // 引入message提示

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl;
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    return config
  }
  distroy (url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!config.url.includes('/login')) { // 判断是否是登录请求，如果存在的话，则每个http header都加上token
        config.headers['x-access-token'] = 'Bearer ' + getToken()// 请求头加token
      }

      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true;
      return config
    }, error => {
      return Promise.reject(error)
    });
    // 响应拦截
    instance.interceptors.response.use(res => {
      if (url.indexOf('/login') != -1) { // 判断是否是登录请求
        if (res.data == '') { // 判断请求返回的数据的错误标记，如果密码错误进下一步
          setToken(''); // 移除token
          Message.error('用户名或密码输入错误！');// 首页提示
          return
        }
      }

      this.distroy(url);
      const {data, status} = res;
      return data
    }, error => {
      this.distroy(url);
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options)
  }
}
export default HttpRequest
