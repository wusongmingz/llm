import { nextTick, onUnmounted } from 'vue';

/**
 * 用于设置元素自动滚动的方法，需要传入盒子id，且此盒子需要被一个父盒子包裹
 * @param option el: 元素的id或者html元素，height: 每行的高度，pauseDuration: 停顿的时间，shifting: 最后保留多少条数据
 * @returns startAutoScroll 开启滚动  stopAutoScroll 终止滚动
 */
export const useAutoScroll = (option: { el: HTMLElement | string; height: number; shifting?: number; pauseDuration?: number }) => {
  const { el, height, shifting, pauseDuration } = option;
  let timer: NodeJS.Timer;

  /**
   * 开启滚动
   * @param length 数据的条数
   * @returns void
   */
  const startAutoScroll = (length: number) => {
    stopAutoScroll();
    nextTick(() => {
      let currentTop = 0; // 初始位置
      const list = typeof el === 'string' ? document.getElementById(el) : el;
      if (!list) return;
      const scrollStep = height; // 每次滚动的距离
      const delayTime = pauseDuration || 1000; // 停顿的时间
      const maxHeight = (length - (shifting || 0)) * height * -1;
      timer = setInterval(() => {
        currentTop -= scrollStep;
        if (currentTop < maxHeight) currentTop = 0;
        if (list) list.style.transform = `translateY(${currentTop}px)`;
      }, delayTime);
    });
  };

  const stopAutoScroll = () => {
    clearTimeout(timer);
  };

  onUnmounted(() => {
    clearTimeout(timer);
  });

  return { startAutoScroll, stopAutoScroll };
};
