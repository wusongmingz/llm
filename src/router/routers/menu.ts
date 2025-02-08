import { RouteRecordRaw } from 'vue-router';

export const welcomeMenu: Array<RouteRecordRaw> = [
  {
    path: '/welcome',
    name: '/welcome',
    meta: {
      title: '菜单',
      icon: 'icon-modular',
      hidden: 0,
    },
    component: () => import('@/layout/Welcome/Welcome.vue'),
  },
];

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/local',
  //   name: '/local',
  //   meta: {
  //     title: 'LocalMenu',
  //     icon: 'icon-setting',
  //     hidden: 0,
  //   },
  //   children: [
  //     {
  //       path: '/local/home0',
  //       name: '/local/home0',
  //       meta: {
  //         title: '调峰用户',
  //         hidden: 0,
  //       },
  //       component: () => import('@/views/PowerAuxiliaryNX/AdjustmentUser/index.vue'),
  //     },
  //     {
  //       path: '/local/home1',
  //       name: '/local/home1',
  //       meta: {
  //         title: '邀约管理',
  //         hidden: 0,
  //       },
  //       component: () => import('@/views/PowerAuxiliaryNX/InvitationManage/index.vue'),
  //     },
  //     {
  //       path: '/local/home2',
  //       name: '/local/home2',
  //       meta: {
  //         title: '调节计划',
  //         hidden: 0,
  //       },
  //       component: () => import('@/views/PowerAuxiliaryNX/AdjustmentPlan/index.vue'),
  //     },
  //     {
  //       path: '/local/home3',
  //       name: '/local/home3',
  //       meta: {
  //         title: '基线管理',
  //         hidden: 0,
  //       },
  //       component: () => import('@/views/PowerAuxiliaryNX/BaselineManage/index.vue'),
  //     },
  //     {
  //       path: '/local/home4',
  //       name: '/local/home4',
  //       meta: {
  //         title: '出清管理',
  //         hidden: 0,
  //       },
  //       component: () => import('@/views/PowerAuxiliaryNX/ClearingManage/index.vue'),
  //     },
  //     {
  //       path: '/local/home',
  //       name: '/local/home',
  //       meta: {
  //         title: '测试',
  //         hidden: 0,
  //       },
  //       component: () => import('@/views/Home/index.vue'),
  //     },
  //     {
  //       path: '/local/setting',
  //       name: '/local/setting',
  //       meta: {
  //         title: '管理',
  //         hidden: 0,
  //       },
  //       children: [
  //         {
  //           path: '/local/setting/role',
  //           name: '/local/setting/role',
  //           component: () => import('@/views/Setting/Role/index.vue'),
  //           meta: {
  //             title: 'Role',
  //             hidden: 0,
  //           },
  //         },
  //         {
  //           path: '/local/setting/user',
  //           name: '/local/setting/user',
  //           component: () => import('@/views/Setting/User/index.vue'),
  //           meta: {
  //             title: 'User',
  //             hidden: 0,
  //           },
  //         },
  //         {
  //           path: '/local/setting/menu',
  //           name: '/local/setting/menu',
  //           component: () => import('@/views/Setting/Menu/index.vue'),
  //           meta: {
  //             title: 'Menu',
  //             hidden: 0,
  //           },
  //         },
  //         {
  //           path: '/local/setting/department',
  //           name: '/local/setting/department',
  //           component: () => import('@/views/Setting/Department/index.vue'),
  //           meta: {
  //             title: 'Department',
  //             hidden: 0,
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    path: '/home',
    name: '/home',
    meta: {
      title: '天元大模型网关',
      icon: '',
      hidden: 0,
    },
    children: [],
    component: () => import('@/views/Home/index.vue'),
  },
  {
    path: '/MultiModelTesting',
    name: '/MultiModelTesting',
    meta: {
      title: '多模型会话',
      icon: 'icon-changshi1',
      hidden: 0,
    },
    children: [],
    component: () => import('@/views/MultiModelTesting/index.vue'),
  },
  {
    path: '/LargeModelsList',
    name: '/LargeModelsList',
    meta: {
      title: '大模型列表',
      icon: 'icon-duihuazixun',
      hidden: 0,
    },
    children: [],
    component: () => import('@/views/LargeModelsList/index.vue'),
  },
  {
    path: '/APIManagement',
    name: '/APIManagement',
    meta: {
      title: 'API管理',
      icon: 'icon-APIguanli',
      hidden: 0,
    },
    children: [],
    component: () => import('@/views/APIManagement/index.vue'),
  },
  {
    path: '/APIBilling',
    name: '/APIBilling',
    meta: {
      title: 'API计费',
      icon: 'icon-jifei',
      hidden: 0,
    },
    children: [],
    component: () => import('@/views/APIBilling/index.vue'),
  },
  {
    path: '/ModelUsageList',
    name: '/ModelUsageList',
    meta: {
      title: '模型用量榜',
      icon: 'icon-leaderboard',
      hidden: 0,
    },
    children: [],
    component: () => import('@/views/ModelUsageList/index.vue'),
  },

  {
    path: '/UserInformation',
    name: '/UserInformation',
    meta: {
      title: '用户信息',
      icon: 'icon-quanxianguanli',
      hidden: 0,
    },
    children: [],
    component: () => import('@/views/UserInformation/index.vue'),
  },
  {
    path: '/UsageGuide',
    name: '/UsageGuide',
    meta: {
      title: '使用指南',
      icon: 'icon-shiyongwendang',
      hidden: 0,
    },
    children: [],
    component: () => import('@/views/UsageGuide/index.vue'),
  },
];

export default routes;
