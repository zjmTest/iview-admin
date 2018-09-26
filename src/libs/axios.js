import axios from 'axios'
// import { Spin } from 'iview'
import {getToken, setToken} from '@/libs/util'
import {Message} from 'iview' // 引入message提示
import {router} from '../router/index';

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
      console.log("req url:" + url);

      return config
    }, error => {
      return Promise.reject(error)
    });
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.distroy(url);
      const {data, status} = res;

      // 根据返回的code值来做不同的处理(和后端约定)
      this.changeByCode(data.code);

      console.log("resp data:" + JSON.stringify(data));
      return data;
    }, (error) => {
      console.log(JSON.stringify(error.response));
      this.distroy(url);

      // 弹出错误信息
      if (error.response.data.message !== null) {
        Message.error(error.response.data.message);
      } else {
        Message.error("未知错误");
      }

      //根据http错误码跳转到页面
      this.changeByCode(error.response.data.code);
      return Promise.reject(error)
    })
  }

  changeByCode(code) {
    switch (code) {
      case 401:
        // 未登录 清除已登录状态
        setToken("");
        window.location = '/login';
        break;
      case 403:
        // 没有权限
        break;
      case 500:
        // 错误
        break;
      default:

    }
  }

  request (options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options)
  }
}
export default HttpRequest
