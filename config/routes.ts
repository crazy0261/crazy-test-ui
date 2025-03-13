/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: '首页',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/apiTest',
    name: '接口用例',
    icon: 'ProfileOutlined',
    // component: './Welcome',
    // component: './ApiTestCase',
  },
  {
    path: '/apiTestCase/bathExec',
    // component: './ApiTestCase/BathExecTestCase.jsx',
  },
  {
    path: '/mulTestCase',
    name: '场景用例',
    icon: 'ClusterOutlined',
    // component: './Welcome',
    // component: './MulTestCase',
  },
  {
    path: '/mulTestCase/detail',
    // component: './MulTestCaseDetail',
  },
  {
    path: '/riskManage',
    name: '风险管理',
    icon: 'AlertOutlined',
    // component: './Welcome',
    // component: './RiskManage',
  },
  {
    path: '/schedule',
    name: '任务管理',
    icon: 'FieldTimeOutlined',
    // component: './Welcome',
    // component: './Schedule',
  },
  {
    path: '/schedule/detail/*',
    // component: './Schedule/ScheduleDetail',
  },
  {
    path: '/schedule/result/*',
    // component: './Schedule/ScheduleResult',
  },

  {
    path: '/application',
    name: '应用管理',
    icon: 'AppstoreOutlined',
    routes: [
      {
        path: '/application/list',
        name: '应用列表',
        // component: './Welcome',
        // component: './Application',
      },
      {
        path: '/application/apimanage',
        name: '接口管理',
        component: './ApiManage',
      },
    ],
  },
  {
    path: '/config',
    name: '系统管理',
    icon: 'ToolOutlined',
    routes: [
      {
        path: '/config/datasource',
        name: '数据源设置',
        // component: './Welcome',
        // component: './Config/Datasource',
      },
      {
        path: '/config/envinfo',
        name: '环境设置',
        // component: './Welcome',
        // component: './Config/EnvInfo',
      },
      {
        path: '/config/domain',
        name: '域名设置',
        // component: './Welcome',
        // component: './Config/DomainInfo',
      },
      {
        path: '/config/testAccount',
        name: '账号设置',
        // component: './Welcome',
        // component: './Config/TestAccount',
      },
      {
        path: '/config/secret',
        name: '加密设置',
        // component: './Welcome',
        // component: './Config/Secret',
      },
      {
        path: '/config/project',
        name: '项目设置',
        // component: './Welcome',
        // component: './Config/Project',
      },
    ],
  },
  {
    path: '/dataPool',
    name: '数据池',
    icon: 'CloudOutlined',
    routes: [
      {
        path: '/dataPool/rule',
        name: '数据库池',
        // component: './Welcome',
        // component: './DataPool/Rule',
      },
      {
        path: '/dataPool/myData',
        name: '我的数据',
        // component: './Welcome',
        // component: './DataPool/MyData',
      },
    ],
  },
  {
    path: '/dataMarket',
    name: '数据大盘',
    icon: 'LineChartOutlined',
  },
  {
    path: '/userAccount',
    name: '用户管理',
    icon: 'UserOutlined',
    routes: [
      {
        path: '/userAccount',
        component: './UserAccount',
      },
    ],
  },
  {
    path: '/userSetting',
    name: '用户设置',
    icon: 'UserOutlined',
    routes: [
      {
        path: '/userSetting',
        // name: '注册用户',
        // component: './Welcome',
        component: './UserSetting',
      },
      {
        path: '/userSetting/registAccount',
        // name: '注册用户',
        // component: './Welcome',
        // component: './UserSetting/RegistAccount',
      },
      {
        path: '/userSetting/modifyPassword',
        // name: '修改密码',
        // component: './Welcome',
        // component: './UserSetting/ModifyPassword',
      },
      {
        path: '/userSetting/resetPwd',
        // name: '重置密码',
        // component: './Welcome',
        // component: './UserSetting/ResetPwd',
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/sub-page',
      },
      {
        path: '/admin/sub-page',
        name: '二级页面',
        component: './Admin',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
