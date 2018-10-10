import { getUserInfo, login, logout } from '@/api/user' //, getUserSysMenu
import { getRouterReq } from '@/api/routers'
import { getToken, routersConfigAssembly, setToken } from '@/libs/util'
// import { menuRefactoring } from '@/libs/business_util'
import _ from 'lodash'

export default {
  state: {
    userName: '',
    userId: '',
    loginId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false
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
    setLoginId (state, id) {
      state.loginId = id
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim()
      return login({
        userName,
        password
      }).then(res => {
        commit('setToken', res.data)
        return res.data
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          commit('setRoutersConfig', { newRouters: [], routersData: [] }) // 变为静态路由
          commit('setHasGetInfo', false)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return getUserInfo(state.token).then(res => {
        const data = res.data
        commit('setAvator', data.avator)
        commit('setUserName', data.userName)
        commit('setUserId', data.userId)
        commit('setLoginId', data.loginId)
        commit('setAccess', ['role_admin', 'admin', 'super_admin'])
        commit('setHasGetInfo', true)

        return data
      })
    },
    // 获取用户路由
    getRoutersConfig ({ state, commit }) {
      // debugger;
      // 有标准路由JOSN模式
      return getRouterReq().then((routersData) => {
        let routersConfig = _.cloneDeep(routersData)
        let newRoutersConfigObj = routersConfigAssembly(routersConfig)
        commit('setRoutersConfig', { newRouters: newRoutersConfigObj, routersData: routersData })
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
