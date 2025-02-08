import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
    },
    component: () => import('@/layout/Login/Login.vue'),
  },
  {
    path: '/error',
    name: '/error',
    meta: {
      title: '错误页面',
    },
    component: () => import('@/layout/ErrorPage/ErrorPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/layout/NotFountPage/NotFountPage.vue'),
  },
];

export const basicPath = routes.map((item) => {
  return item.path;
});

export default routes;
