import {getUserInfo, login, logout} from '@/api/user' //, getUserSysMenu
import {getRouterReq} from '@/api/routers'
import {getToken, routersConfigAssembly, setToken} from '@/libs/util'
// import { menuRefactoring } from '@/libs/business_util'
import _ from 'lodash'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: []
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token;
      setToken(token)
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim();
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          commit('setToken', res.data);
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '');
          commit('setAccess', []);
          commit('setRoutersConfig', {newRouters: [], routersData: []}); // 变为静态路由
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
    //  debugger;
      return new Promise((resolve, reject) => {
        // debugger;
        getUserInfo(state.token).then(res => {
          const data = res.data;
          commit('setAvator', data.avator);
          commit('setUserName', data.user_name);
          commit('setUserId', data.user_id);
          commit('setAccess', data.access);
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户路由
    getRoutersConfig ({ state, commit }) {
      // debugger;
      // 有标准路由JOSN模式
      return getRouterReq().then((routersData) => {
        debugger;
        let routersConfig = _.cloneDeep(routersData);
        let newRoutersConfigObj = routersConfigAssembly(routersConfig);
        commit('setRoutersConfig', {newRouters: newRoutersConfigObj, routersData: routersData});
        return newRoutersConfigObj
      })

      /* 需要转换菜单JOSN为标准路由JOSN模式 */
      // return getUserSysMenu().then((routersData) => {
      //  // debugger;
      //   //  console.log('获取到用户菜单：' + JSON.stringify(routersData.data))
      //   // 把菜单列表转为框架标准路由JSON格式
      //   let newRoutersData = menuRefactoring(routersData.data, '0')
      //   //  console.log("转换路由："+JSON.stringify(newRoutersData))
      //   let routersConfig = _.cloneDeep(newRoutersData)
      //   let newRoutersConfigObj = routersConfigAssembly(routersConfig)
      //
      //   commit('setRoutersConfig', { newRouters: newRoutersConfigObj, routersData: newRoutersData })
      //   return newRoutersConfigObj
      // })
    }

  }
}
