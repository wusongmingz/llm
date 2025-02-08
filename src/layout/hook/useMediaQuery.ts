import { useWindowSize, useDebounceFn } from '@vueuse/core';
import { ref, watch } from 'vue';
export enum SizeEnum {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
}

export enum ScreenEnum {
  XS = 768,
  SM = 992,
  MD = 1200,
  LG = 1920,
}
function getWindowWidth(width: number) {
  const xs = ScreenEnum.XS;
  const sm = ScreenEnum.SM;
  const md = ScreenEnum.MD;
  const lg = ScreenEnum.LG;
  if (width < xs) {
    return SizeEnum.XS;
  } else if (width < sm) {
    return SizeEnum.SM;
  } else if (width < md) {
    return SizeEnum.MD;
  } else if (width < lg) {
    return SizeEnum.LG;
  } else {
    return SizeEnum.XL;
  }
}

export const useMediaQuery = () => {
  const { width } = useWindowSize();
  const screenRef = ref<SizeEnum>(SizeEnum.XL);
  const getWindowWidthDebounce = useDebounceFn(() => {
    screenRef.value = getWindowWidth(width.value);
  }, 100);
  watch(
    width,
    () => {
      getWindowWidthDebounce();
    },
    { immediate: true },
  );

  return {
    screenRef,
  };
};
