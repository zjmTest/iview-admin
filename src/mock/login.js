import { getParams } from '@/libs/util'

const USER_MAP = {
  super_admin: {
    name: 'super_admin',
    user_id: '1',
    access: ['super_admin', 'admin'],
    token: 'super_admin',
    avator: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
  },
  admin: {
    name: 'admin',
    user_id: '2',
    access: ['admin'],
    token: 'admin',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  }
}

export const login = req => {
  req = JSON.parse(req.body)
  return { token: USER_MAP[req.userName].token }
}

export const getUserInfo = req => {
  const params = getParams(req.url)
  return USER_MAP[params.token]
}

export const logout = req => {
  return null
}

export const getUserSysMenu = req => {
  const loginMenu = [{
    'id': '1',
    'parent_id': '0',
    'menu_title': '系统管理',
    'menu_name': 'system',
    'menu_cache': 1,
    'menu_hide': 0,
    'menu_icon': 'logo-buffer',
    'menu_type': 3,
    'menu_href': '',
    'menu_component': ''
  },
  {
    'id': '2',
    'parent_id': '1',
    'menu_title': '子系统管理',
    'menu_name': 'subsystem',
    'menu_cache': 1,
    'menu_hide': 0,
    'menu_icon': 'md-trending-up',
    'menu_type': 3,
    'menu_href': '',
    'menu_component': 'CountTo'
  },
  {
    'id': '3',
    'parent_id': '1',
    'menu_title': '菜单管理',
    'menu_name': 'menu',
    'menu_cache': 1,
    'menu_hide': 0,
    'menu_icon': 'ios-infinite',
    'menu_type': 3,
    'menu_href': '',
    'menu_component': 'DragList'
  }
    /*      {"id":"4","parent_id":"3","menu_title":"菜单信息管理","menu_name":"menu_list","menu_cache":1,"menu_icon":"ios-infinite","menu_type":3,"menu_href":"components/drag-list/drag-list.vue"},
                   {"id":"5","parent_id":"3","menu_title":"菜单权限管理","menu_name":"role_list","menu_cache":1,"menu_icon":"ios-infinite","menu_type":3,"menu_href":"components/tables/tables.vue"} */
  ]
  return loginMenu
}
