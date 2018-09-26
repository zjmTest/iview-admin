// 把实体数据复制到空实体中，只复制相同字段
export const entityDataCopy = (emptyEntity, entityData) => {
  for (let item in emptyEntity) {
    for (let uitem in entityData) {
      if (item === uitem) {
        let e0 = typeof (emptyEntity[item]);
        let e1 = typeof (entityData[uitem]);
        if (e0 === e1) {
          emptyEntity[item] = entityData[uitem]
        } else {
          if (e0 === 'string') {
            emptyEntity[item] = entityData[uitem].toString()
          } else if (e0 === 'number') {
            if (entityData[uitem].indexOf('.') > 0) {
              emptyEntity[item] = isNaN(parseFloat(entityData[uitem])) ? 0 : parseFloat(entityData[uitem])
            } else {
              emptyEntity[item] = isNaN(parseInt(entityData[uitem])) ? 0 : parseInt(entityData[uitem])
            }
          } else if (e0 === 'boolean') {
            emptyEntity[item] = Boolean(entityData[uitem])
          }
        }
        break
      }
    }
  }
  return emptyEntity
};

/**
 *  data 数组
 *   parent === parentId
 *   currentId === currentId
 */
export const getCascaderJsonTree = (data, parentId, parent, currentId, formatVal) => {
  let itemArr = [];
  for (let i = 0; i < data.length; i++) {
    let node = data[i];
    if (node[parent] === parentId) {
      let newNode = data[i];
      let treeNode = {};
      treeNode['label'] = newNode[formatVal.name];
      treeNode['value'] = newNode[formatVal.value] + '';
      var children = getCascaderJsonTree(data, node[currentId], parent, currentId, formatVal);
      if (children.length > 0) {
        treeNode.children = children
      }
      itemArr.push(treeNode)
    }
  }
  return itemArr
};

// 获取当前时间(年-月-日 时:分:秒)
export const currentTime = () => {
  let myDate = new Date(); // 获取系统当前时间
  return myDate.getFullYear() + '-' + myDate.getMonth() + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds()
};
// 时间转换
export const convertDateFromString = (dateString) => {
  let DATE_REGEXP = new RegExp('(\\d{4})-(\\d{2})-(\\d{2})([T\\s](\\d{2}):(\\d{2}):(\\d{2})(\\.(\\d{3}))?)?.*');
  if (DATE_REGEXP.test(dateString)) {
    let timestamp = dateString.replace(DATE_REGEXP, function ($all, $year, $month, $day, $part1, $hour, $minute, $second, $part2, $milliscond) {
      let date = new Date($year, $month, $day, $hour || '00', $minute || '00', $second || '00', $milliscond || '00');
      return date.getTime()
    });
    var date = new Date();
    date.setTime(timestamp);
    return date
  }
};
// 判断是数组还是JSON对象
export const isArrayFn = (value) => {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value)
  } else {
    return Object.prototype.toString.call(value) === '[object Array]'
  }
};
// 从构菜单为框架支持结构
export const menuRefactoring = (menuList, parentId) => {
  let newMenu = [];
  for (let i = 0; i < menuList.length; i++) {
    let menuInfo = {};
    let item = menuList[i];
    if (item['parent_id'] === parentId) {
      if (item['menu_type'] === 1) {
        menuInfo['path'] = '';
        menuInfo['name'] = item['menu_name'];
        menuInfo['meta'] = {'title': item['menu_title'], 'href': item['menu_href'], 'icon': item['menu_icon']}
      } else if (item['menu_type'] === 2) {
        menuInfo['path'] = item['menu_name'];
        menuInfo['name'] = item['menu_name'];
        menuInfo['meta'] = {
          'title': item['menu_title'],
          'icon': item['menu_icon'],
          'hideInMenu': (parseInt(item['menu_hide']) !== 0)
        };
        // menuInfo['component'] = () => import('@/view/components/count-to/count-to.vue')
        menuInfo['component'] = () => import('@/view/' + menuInfo["menu_href"]);

      } else {
        menuInfo['path'] = item['menu_name'];
        menuInfo['name'] = item['menu_name'];
        //    menuInfo['meta'] = {'title': item['menu_title'], 'icon': item['menu_icon'], 'showAlways': true, 'notCache': (parseInt(item['menu_cache']) !== 0),'hideInMenu': (parseInt(item['menu_hide']) !== 0)}
        menuInfo['meta'] = {
          'title': item['menu_title'],
          'icon': item['menu_icon'],
          'notCache': (parseInt(item['menu_cache']) !== 0),
          'hideInMenu': (parseInt(item['menu_hide']) !== 0)
        };

        let children = menuRefactoring(menuList, item['id']);
        //console.log("菜单："+item['menu_name']+",子级长度:"+children.length)
        if (children.length > 0) {
          menuInfo['component'] = "Main"; //() => import('@/view/main')
          menuInfo['children'] = children;
          menuInfo['meta']["showAlways"] = true;
          if (parentId === "0") menuInfo["path"] = "/" + menuInfo["path"]
        } else {
          // console.log(item["menu_component"])
          menuInfo['component'] = item["menu_component"] // routerMap[item["menu_component"]]
        }
      }
      newMenu.push(menuInfo)
    }
  }
  let newsMenu = [];
  for (let k = 0; k < newMenu.length; k++) {
    // newMenu[k]['path'] = '/' + newMenu[k]['path']
    if (newMenu[k]['children']) {
      for (let l = 0; l < newMenu[k]['children'].length; l++) {
        if (newMenu[k]['children'][l]['children']) {
          newMenu[k]['children'][l]['component'] = "ParentView" // () => import('@/components/parent-view')
        }
      }
    }
    newsMenu.push(newMenu[k])
  }
  return newsMenu
};
