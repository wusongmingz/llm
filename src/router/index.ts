import { createRouter, /*createWebHashHistory,*/ createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { routes } from './routers/index';
import { basicPath } from './routers/basic';
import MenuRouter, { welcomeMenu } from '@/router/routers/menu';
import LayoutVue from '@/layout/Layout.vue';
import { LOCAL_MENU } from '@/utils/utils';

declare module 'vue-router' {
  interface RouteMeta {
    icon?: string;
    title?: string;
    hidden?: number;
    componentName?: string;
  }
}

const router = createRouter({
  // history: createWebHashHistory(), // hash 模式
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const store = useUserStore();
  if (basicPath.indexOf(to.fullPath) !== -1) {
    if (to.path === '/login' && router.hasRoute('/views')) {
      router.removeRoute('/views');
      router.removeRoute('/');
    }
    next();
  } else if (!router.hasRoute('/views')) {
    store.fullscreenLoading = { show: true, text: '菜单加载中...' };

    try {
      // await store.sysUserInit();
      // let routeMenu = await store.menuInit();
      // if (routeMenu.length === 0) routeMenu = welcomeMenu;
      // if (LOCAL_MENU) {
      //   routeMenu = [...MenuRouter, ...routeMenu];
      // }
      router.addRoute({
        path: '/views',
        name: '/views',
        component: LayoutVue,
        children: MenuRouter,
      });
      router.addRoute({
        path: '/',
        name: '/',
        redirect: '/home',
      });
      if (!store.sysUser && to.path != '/home') {
        next({ path: '/login' });
      } else {
        next(to);
      }
    } catch (error: any) {
      store.errorPageMessage = error.message || error.msg || '未知错误';
      next({ path: '/error' });
    } finally {
      store.fullscreenLoading = { show: false, text: '' };
    }
  } else {
    if (!store.sysUser && to.path != '/home') {
      next({ path: '/login' });
    } else {
      next();
    }
  }
});

export default router;
