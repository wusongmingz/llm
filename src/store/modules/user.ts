import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { ElMessage, dayjs } from 'element-plus';

import { getRoleMenuList } from '@/api/setting/menu';
import { IRoleMenuResp } from '@/api/setting/type/menu';
import { login as loginApi, logout as logoutAPI, getUserInfo, ISysUser, ISysOrg, IApis, IRoles, getUserInfoNew } from '@/api/setting/user';
import { ILoginReq, IUserBaseInfo } from '@/api/setting/type/user';

import { useLocalStorage } from '@/utils/storage';
import { LoadComponent } from '@/utils/loadComponent';
import { formMapToOption } from '@/utils/utils';
import { checkRequestSuccess } from '@/utils/request';
import { PROVINCE_MAP } from '@/config/dictionary';
import { useRouter } from 'vue-router';

const storage = useLocalStorage();
interface IUserStore {
  menu: Array<IRoleMenuResp>;
  token: string;
  userInfo: IUserBaseInfo & { homeName: string; title: string; componentName: string };
  sysUser?: ISysUser;
  sysOrg?: ISysOrg;
  topOrg?: ISysOrg;
  fullscreenLoading: {
    show: boolean;
    text: string;
  };
  errorPageMessage: string;
  menus: Array<IRoleMenuResp>;
  apis: Array<IApis>;
  roles: Array<IRoles>;
  btnList: Map<string, number>;
  sysStatus: number;
  modelList: Array<any>;
}

const preUserInfo = {
  // nickname: '未登录',
  // username: '',
  homePath: '',
  homeName: '',
  title: '',
  componentName: '',
  // desc: '',
  // userId: '',
  // avatar: ''
};

export const useUserStore = defineStore('user', {
  // 必须是箭头函数（服务端渲染很有必要，且有利于类型推导）
  state: (): IUserStore => {
    return {
      token: storage.get('token') || '',
      menu: [],
      userInfo: preUserInfo,
      fullscreenLoading: { show: false, text: '' },
      errorPageMessage: '欢迎来到错误页面~',
      // sysUser: {
      //   userID: 'member_29',
      // },
      sysUser: undefined,
      sysOrg: undefined,
      topOrg: undefined,
      menus: [],
      apis: [],
      roles: [],
      btnList: new Map(),
      sysStatus: 1, //判断是否登录页面
      modelList: [],
    };
  },

  getters: {
    routerMenu: (state) => {
      const res: RouteRecordRaw[] = [];
      const dfs = (resArr: RouteRecordRaw[], arr: IRoleMenuResp[]) => {
        arr.forEach((item) => {
          const resItem: RouteRecordRaw = {
            ...item,
            meta: {
              title: item.title,
              icon: item.icon,
              hidden: item.hidden,
              componentName: item.component,
            },
            component: LoadComponent.loadComponent(item.component),
            children: [],
          };
          if (item.children) {
            resItem.children = [];
            dfs(resItem.children, item.children);
          }
          resArr.push(resItem);
        });
      };
      dfs(res, state.menu);
      return res;
    },
    provOption: (state) => {
      if (state.sysUser?.provCode === -1) {
        return formMapToOption(PROVINCE_MAP);
      } else if (state.sysUser?.provShortName) {
        return [{ label: state.sysUser.provShortName, value: state.sysUser.provShortName }];
      } else {
        return [];
      }
    },
  },

  actions: {
    sysUserInit(state: string, code: string) {
      return new Promise((resolve, reject) => {
        getUserInfoNew({ state, code }).then((res) => {
          if (res.success) {
            this.sysUser = res.data.user;
            storage.set('token', res.data.token);
            this.token = res.data.token;

            if (res.data?.user?.groups && res.data?.user?.groups.length > 0) {
              res.data.user.userID = res.data.user.groups[0].split('/')[1];
            } else {
              reject('no-groups');
            }

            // this.sysOrg = res.data?.sysOrg;
            // this.sysUser = res.data?.sysUser;
            // this.topOrg = res.data?.topOrg;
            // this.menus = res.data?.menus || [];
            // this.apis = res.data?.apis || [];
            // this.roles = res.data?.roles || [];
            // this.btnList = new Map();
            // this.apis.forEach((el) => {
            //   this.btnList.set(el.title, el.hidden);
            // });
            // if (res.data && res.data.sysUser && res.data.sysUser.lastModifyPwdTime) {
            //   const time = dayjs().valueOf() - dayjs(res.data.sysUser.lastModifyPwdTime).valueOf();
            //   if (time > (3 * 30 - 15) * 24 * 3600 * 1000) {
            //     ElMessage({
            //       showClose: true,
            //       message: '使用超过3个月，请点击右上角用户名处修改密码！',
            //       type: 'error',
            //       duration: 0,
            //     });
            //   }
            // }
            resolve(res.data);
          } else {
            // ElMessage.error(res.msg || '获取账号信息失败！');
            const router = useRouter();
            router.push('/login');
            reject(res);
          }
        });
      });
    },
    async menuInit() {
      const res = await getRoleMenuList();
      if (!checkRequestSuccess(res)) throw new Error('获取菜单失败');
      if (res.data && res.data.length > 0) {
        let homeName = res.data[0].name;
        let title = res.data[0].title;
        let homePath = res.data[0].path;
        let componentName = res.data[0].component;
        if (res.data[0].children && res.data[0].children.length > 0) {
          homeName = res.data[0].children[0].name;
          title = res.data[0].children[0].title;
          homePath = res.data[0].children[0].path;
          componentName = res.data[0].children[0].component;
        }
        this.userInfo = { homeName, homePath, title, componentName };
        this.menu = res.data;
        return this.routerMenu;
      } else {
        this.userInfo = { homeName: '/welcome', homePath: '/welcome', title: '欢迎登录', componentName: 'Welcome' };
        return [];
      }
    },
    async login(param: ILoginReq) {
      this.userInfo = preUserInfo;
      this.token = '';
      storage.remove('token');
      this.menu = [];
      this.fullscreenLoading = { show: true, text: '登录中...' };
      try {
        const res = await loginApi(param);
        if (res.code === 0 && res.data) {
          this.token = 'Bearer ' + res.data.accessToken;
          storage.set('token', this.token);
          return res.data;
        } else {
          ElMessage.error(res.msg || '登录失败');
          // throw new Error(res.msg);
          return res;
        }
      } finally {
        this.fullscreenLoading = { show: false, text: '' };
      }
    },
    logout() {
      return new Promise((resolve, reject) => {
        logoutAPI().then(
          (res) => {
            this.removeLoginInfo();
            if (res.code === 0 && res.success) {
              resolve(res.data);
            } else {
              ElMessage.error(res.msg || '退出失败');
              reject(res);
            }
          },
          (err) => {
            this.removeLoginInfo();
            reject(err);
          },
        );
      });
    },
    removeLoginInfo() {
      const urls = `https://uat-casdoor.denovox.com/api/logout?id_token_hint=${this.token}&post_logout_redirect_uri=${window.location.href})`;
      // https://uat-casdoor.denovox.com/api/logout?id token hint=${casdoorAcessToken}&post logout redirect uri=${wiidow.location.href})
      this.userInfo = preUserInfo;
      this.token = '';
      storage.remove('token');
      this.menu = [];
      window.location.replace(urls);
    },
  },
});
