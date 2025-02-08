import { SizeEnum } from '@/layout/hook/useMediaQuery';
import { defineStore } from 'pinia';

interface IThemeStore {
  menuMode: 'horizontal' | 'vertical';
  mediaQuery: SizeEnum;
  pageSize: number;
  isExpand: boolean;
  hideMenu: boolean;
  tabList: { title: string; prop: string; name: string; closable: boolean; componentName: string }[];
}

export const useThemeStore = defineStore('theme', {
  state: (): IThemeStore => {
    return {
      menuMode: 'vertical',
      mediaQuery: SizeEnum.XL,
      isExpand: false,
      pageSize: 10,
      tabList: [],
      hideMenu: false,
    };
  },
  getters: {
    cacheMenuList: (state) => state.tabList.map((item) => item.componentName),
    isSmallDevice: (state) => {
      return state.mediaQuery === SizeEnum.XS || state.mediaQuery === SizeEnum.SM;
    },
  },
});
