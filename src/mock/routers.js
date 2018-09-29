export const getRouterData = req => {
  const routerInfoJSONStr = `[
        {"path":"/login","name":"login","meta":{"title":"Login - 登录","hideInMenu":true},"component":"Login"},
        {"path":"/","name":"_home","redirect":"/home","meta":{"notCache":true,"hideInMenu":true},"component":"Main",
        "children":[{"path":"/home","name":"home","meta":{"notCache":true,"hideInMenu":true,"title":"首页"},"component":"Home"}]},
        {"path":"/401","name":"error_401","meta":{"hideInMenu":true},"component":"Error401"},
        {"path":"/500","name":"error_500","meta":{"hideInMenu":true},"component":"Error500"},
        {"path":"*","name":"error_404","meta":{"hideInMenu":true},"component":"Error404"},
        {"path":"","name":"doc","meta":{"title":"文档","href":"https://lison16.github.io/iview-admin-doc/#/","icon":"ios-book"}},
        {"path":"/join","name":"join","component":"Main","children":[{"path":"join_page","name":"join_page","meta":{"icon":"_qq","title":"Q群"},"component":"JoinPage"}]},
        
        {
            "path": "/system",
            "name": "system",
            "meta": {
              "icon": "md-menu",
              "title": "系统管理"
            },
            "component": "Main",
            "children": [
              {
                "path": "user-manage",
                "name": "user-manage",
                "meta": {
                  "icon": "md-funnel",
                  "title": "用户管理"
                },
                "component": "UserManage"
              },
              {
                "path": "menu-manage",
                "name": "menu-manage",
                "meta": {
                  "icon": "md-funnel",                 
                  "title": "菜单管理"
                },
                 "component": "MenuManage"
               },
               {
                "path": "accessTest",
                "name": "accessTest",
                "meta": {
                  "icon": "md-funnel",                 
                  "title": "权限按钮测试",
                  "permTypes":[ "add", "edit", "delete" ],
                  "access" :["role_admin","admin"]
                },
                 "component": "Access"
               },
               {
                "path": "changePass",
                "name": "changePass",
                "meta": {
                  "icon": "md-funnel",                 
                  "title": "修改密码"              
                },
                 "component": "ChangePass"
               }             
            ]
          }
          ,{
            "path": "/components",
            "name": "components",
            "meta": {
              "icon": "logo-buffer",
              "title": "组件"
            },
            "component": "Main",
            "children": [
              {
                "path": "count_to_page",
                "name": "count_to_page",
                "meta": {
                  "icon": "md-trending-up",
                  "title": "数字渐变"
                },
                "component":"CountTo"
              },
              {
                "path": "drag_list_page",
                "name": "drag_list_page",
                "meta": {
                  "icon": "ios-infinite",
                  "title": "拖拽列表"
                },
                "component":"DragList"
              },
              {
                "path": "tables_page",
                "name": "tables_page",
                "meta": {
                  "icon": "md-grid",
                  "title": "多功能表格"
                },
                "component": "Table"
              },
              {
                "path": "split_pane_page",
                "name": "split_pane_page",
                "meta": {
                  "icon": "md-pause",
                  "title": "分割窗口"
                },
                "component":"SplitPane"
              },
              {
                "path": "markdown_page",
                "name": "markdown_page",
                "meta": {
                  "icon": "logo-markdown",
                  "title": "Markdown编辑器"
                },
                "component": "Markdown"
              },
              {
                "path": "editor_page",
                "name": "editor_page",
                "meta": {
                  "icon": "ios-create",
                  "title": "富文本编辑器"
                },
                "component": "Editor"
              },
              {
                "path": "tree",
                "name": "tree",
                "meta": {
                  "icon": "md-grid",
                  "title": "树形结构"
                },
                "component": "Tree"
              },
              {
                "path": "icons_page",
                "name": "icons_page",
                "meta": {
                  "icon": "_bear",
                  "title": "自定义图标"
                },
                "component": "Icons"
              }
            ]
          },
          {
            "path": "/update",
            "name": "update",
            "meta": {
              "icon": "md-cloud-upload",
              "title": "数据上传"
            },
            "component": "Main",
            "children": [
              {
                "path": "update_table_page",
                "name": "update_table_page",
                "meta": {
                  "icon": "ios-document",
                  "title": "上传Csv"
                },
                "component": "UpdateTable"
              },
              {
                "path": "update_paste_page",
                "name": "update_paste_page",
                "meta": {
                  "icon": "md-clipboard",
                  "title": "粘贴表格数据"
                },
                "component": "UpdatePaste"
              }
            ]
          },
          {
            "path": "/excel",
            "name": "excel",
            "meta": {
              "icon": "ios-stats",
              "title": "EXCEL导入导出"
            },
            "component": "Main",
            "children": [
              {
                "path": "upload-excel",
                "name": "upload-excel",
                "meta": {
                  "icon": "md-add",
                  "title": "导入EXCEL"
                },
                "component":"UploadExcel"
              },
              {
                "path": "export-excel",
                "name": "export-excel",
                "meta": {
                  "icon": "md-download",
                  "title": "导出EXCEL"
                },
                "component": "ExportExcel"
              }
            ]
          },
          {
            "path": "/tools_methods",
            "name": "tools_methods",
            "meta": {
              "hide": true
            },
            "component": "Main",
            "children": [
              {
                "path": "tools_methods_page",
                "name": "tools_methods_page",
                "meta": {
                  "icon": "ios-hammer",
                  "title": "工具方法"                 
                },
                "component": "ToolsMethods"
              }
            ]
          },
          {
            "path": "/directive",
            "name": "directive",
            "meta": {
              "hide": true
            },
            "component": "Main",
            "children": [
              {
                "path": "directive_page",
                "name": "directive_page",
                "meta": {
                  "icon": "ios-navigate",
                  "title": "指令"
                },
                "component": "Directive"
              }
            ]
          },
          {
            "path": "/multilevel",
            "name": "multilevel",
            "meta": {
              "icon": "md-menu",
              "title": "多级菜单"
            },
            "component": "Main",
            "children": [
              {
                "path": "level_2_1",
                "name": "level_2_1",
                "meta": {
                  "icon": "md-funnel",
                  "title": "二级-1"
                },
                "component": "Level21"
              },
              {
                "path": "level_2_2",
                "name": "level_2_2",
                "meta": {
                  "access": ["super_admin"],
                  "icon": "md-funnel",
                  "showAlways": true,
                  "title": "二级-2"
                },
                "component": "ParentView",
                "children": [
                  {
                    "path": "level_2_2_1",
                    "name": "level_2_2_1",
                    "meta": {
                      "icon": "md-funnel",
                      "title": "三级"
                    },
                    "component": "Level31"
                  }
                ]
              },
              {
                "path": "level_2_3",
                "name": "level_2_3",
                "meta": {
                  "icon": "md-funnel",
                  "title": "二级-3"
                },
                "component": "Level23"
              }
            ]
          },
          {
            "path": "/argu",
            "name": "argu",
            "meta": {
              "hideInMenu": true
            },
            "component": "Main",
            "children": [
              {
                "path": "params/:id",
                "name": "params",
                "meta": {
                  "icon": "md-flower",
                  "title": "动态路由",
                  "notCache": true,
                   "beforeCloseName":"before_close_normal"
                },
                "component": "Params"
              },
              {
                "path": "query",
                "name": "query",
                "meta": {
                  "icon": "md-flower",
                  "title": "带参路由",
                  "notCache": true,
                   "beforeCloseName":"before_close_normal"
                },
                "component": "Query"
              }
            ]
          }
    ]`;

  let routerInfos = JSON.parse(routerInfoJSONStr);
  return {data: routerInfos}
};
