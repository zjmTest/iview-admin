const Main = () => import('@/view/main');
const ParentView = () => import('@/components/parent-view');
const Login = () => import('@/view/login/login.vue');
const Home = () => import('@/view/single-page/home');
const Error401 = () => import('@/view/error-page/401.vue');
const Error500 = () => import('@/view/error-page/500.vue');
const Error404 = () => import('@/view/error-page/404.vue');
const JoinPage = () => import('@/view/join-page.vue');
const CountTo = () => import('@/view/components/count-to/count-to.vue');
const DragList = () => import('@/view/components/drag-list/drag-list.vue');
const Table = () => import('@/view/components/tables/tables.vue');
const SplitPane = () => import('@/view/components/split-pane/split-pane.vue');
const Markdown = () => import('@/view/components/markdown/markdown.vue');
const Editor = () => import('@/view/components/editor/editor.vue');
const Icons = () => import('@/view/components/icons/icons.vue');
const UpdateTable = () => import('@/view/update/update-table.vue');
const UpdatePaste = () => import('@/view/update/update-paste.vue');
const UploadExcel = () => import('@/view/excel/upload-excel.vue');
const ExportExcel = () => import('@/view/excel/export-excel.vue');
const ToolsMethods = () => import('@/view/tools-methods/tools-methods.vue');
const Directive = () => import('@/view/directive/directive.vue');
const Level21 = () => import('@/view/multilevel/level-2-1.vue');
const Level31 = () => import('@/view/multilevel/level-2-2/level-3-1.vue');
const Level23 = () => import('@/view/multilevel/level-2-3.vue');
const Params = () => import('@/view/argu-page/params.vue');
const Query = () => import('@/view/argu-page/query.vue');
const UserManage = () => import('@/view/system/user-manage/userManage.vue');
const MenuManage = () => import('@/view/system/menu-manage/menuManage.vue');

const Tree = () => import('@/view/components/tree/tree.vue');

export const routerMap = {
  Main,
  ParentView,
  Login, Home,
  Error401,
  Error500,
  Error404,
  JoinPage,
  CountTo,
  DragList,
  Table,
  SplitPane,
  Markdown,
  Editor,
  Icons,
  UpdateTable,
  UpdatePaste,
  UploadExcel,
  ExportExcel,
  ToolsMethods,
  Directive,
  Level21,
  Level31,
  Level23,
  Params,
  Query,
  UserManage,
  Tree,
  MenuManage
};
export const staticRouters = [
  {path: '/login', name: 'login', meta: {title: 'Login - 登录', hideInMenu: true}, component: routerMap['Login']},
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    meta: {notCache: true, hideInMenu: true},
    component: routerMap['Main'],
    children: [{
      path: '/home',
      name: 'home',
      meta: {notCache: true, hideInMenu: true, title: '首页'},
      component: routerMap['Home']
    }]
  },
  {path: '/401', name: 'error_401', meta: {hideInMenu: true}, component: routerMap['Error401']},
  {path: '/500', name: 'error_500', meta: {'hideInMenu': true}, component: routerMap['Error500']},
  {path: '*', name: 'error_404', meta: {hideInMenu: true}, component: routerMap['Error404']}
];
