import { computed } from 'vue';
import { useDark, useToggle } from '@vueuse/core';

/**
 * @returns isDarkUnset 能获取夜间模式的状态，但是修改它不会修改模式
 * @returns isDark：是否为夜间模式，响应式；  toggleDark：切换夜间模式的方法。
 */

export const useDarkMode = () => {
  const isDark = useDark();
  const changeDark = useToggle(isDark);

  const isDarkUnset = computed({
    get() {
      return isDark.value;
    },
    set() {
      // nothing to do
    },
  });

  const toggleDark = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    if ((document as any).startViewTransition) {
      const transition = (document as any).startViewTransition(() => {
        changeDark();
      });
      transition.ready.then(() => {
        const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
        document.documentElement.animate(
          {
            clipPath: isDark.value ? clipPath : [...clipPath].reverse(),
          },
          {
            duration: 400,
            easing: 'ease-in',
            pseudoElement: isDark.value ? '::view-transition-new(root)' : '::view-transition-old(root)',
          },
        );
      });
    } else {
      changeDark();
    }
  };
  return {
    isDark,
    isDarkUnset,
    toggleDark,
  };
};
