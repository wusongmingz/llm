import { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/Layout.vue';
import NoHomePage from '@/layout/NoHomePage/NoHomePage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/layout',
    name: '/layout',
    component: Layout,
    children: [
      {
        path: '/nohomepage',
        name: '/nohomepage',
        component: NoHomePage,
        meta: {
          title: '没有设置首页',
        },
      },
    ],
  },
];

export default routes;
