import {
  getBreadCrumbList,
  getHomeRoute,
  getMenuByRouter,
  getNextRoute,
  getRoutersConfig,
  getTagNavListFromLocalstorage,
  routeEqual,
  routeHasExist,
  setRoutersConfig,
  setTagNavListInLocalstorage
} from '@/libs/util'
import {staticRouters} from '@/router/routersMap'
import _ from 'lodash'

import beforeClose from '@/router/before-close'
import router from '@/router'

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route);
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  });
  router.push(nextRoute)
};

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(getRoutersConfig()),
    routersConfig: getRoutersConfig(),
    local: ''
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(state.routersConfig, rootState.user.access)
  },
  mutations: {
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
    },
    setTagNavList (state, list) {
      if (list) {
        state.tagNavList = [...list];
        setTagNavListInLocalstorage([...list])
      } else state.tagNavList = getTagNavListFromLocalstorage()
    },
    closeTag(state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route));
      route = tag[0] ? tag[0] : null;
      if (!route) return;
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag (state, { route, type = 'unshift' }) {
      if (!routeHasExist(state.tagNavList, route)) {
        if (type === 'push') state.tagNavList.push(route);
        else {
          if (route.name === 'home') state.tagNavList.unshift(route);
          else state.tagNavList.splice(1, 0, route)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setRoutersConfig (state, { newRouters, routersData }) {
      state.routersConfig = _.concat(staticRouters, newRouters);
      state.homeRoute = getHomeRoute(state.routersConfig);
      setRoutersConfig(routersData)
    },
    setLocal (state, lang) {
      state.local = lang
    }
  }
}
