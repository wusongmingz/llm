import { defineComponent, h } from 'vue';
import { setupApp, preloadApp } from 'wujie';
import WujieVue from 'wujie-vue3';
// import Qiankun from '@/layout/Qiankun/Qiankun.vue';
import IFrame from '@/layout/IFrame/IFrame.vue';

const modules = import.meta.glob('@/views/**/index.vue');
const notFountPage = import.meta.glob('@/layout/NotFountPage/NotFountPage.vue');

export class LoadComponent {
  private static loadView(urlPath: string) {
    if (urlPath === 'Layout') return undefined;
    return modules['/src/views' + urlPath + '/index.vue'] || notFountPage['/src/layout/NotFountPage/NotFountPage.vue'];
  }

  private static loadWujieApp(urlPath: string) {
    setupApp({
      name: urlPath,
      url: urlPath,
      alive: true,
    });
    preloadApp({
      name: urlPath,
      url: urlPath,
    });
    return defineComponent({
      name: urlPath,
      render: () => h(WujieVue, { name: urlPath, width: '100%', height: '100%', url: urlPath, alive: true }),
    });
  }

  // private static loadQiankunApp(urlPath: string) {
  //   return defineComponent({
  //     name: urlPath,
  //     render: () => h(Qiankun, { name: urlPath, entry: urlPath }),
  //   });
  // }

  private static loadIFrameApp(urlPath: string) {
    return h(IFrame, { url: urlPath });
  }

  public static loadComponent = (urlPath: string) => {
    if (urlPath.includes('||')) {
      const [app, url] = urlPath.split('||');
      if (app === 'wujie') return LoadComponent.loadWujieApp(url);
      // else if (app === 'qiankun') return LoadComponent.loadQiankunApp(url);
      else return LoadComponent.loadIFrameApp(url);
    } else if (urlPath.indexOf('http') === 0) {
      return LoadComponent.loadIFrameApp(urlPath);
    } else {
      return LoadComponent.loadView(urlPath);
    }
  };
}
