import { debounce } from 'lodash-es';
import { onBeforeUnmount, onMounted } from 'vue';

/**
 * 用于根据窗口大小，动态的缩放页面，保证与设计图一致，使用的时候，需要保证 el 元素有且仅有一个子元素
 * @param el 页面元素或者元素的id
 * @param originWidth 设计图的宽度
 * @returns resizeDebounce 主动重新绘制
 */
export const useAutoFitScreen = (el: HTMLElement | string, originWidth = 1920) => {
  let element: HTMLElement | null;
  let elementChild: HTMLElement | null;
  onMounted(() => {
    if (typeof el === 'string') {
      const ele = document.getElementById(el);
      if (!ele) return;
      element = ele;
    } else {
      element = el;
    }
    elementChild = element.firstElementChild as HTMLElement;
    if (element && elementChild) {
      resizeHandle();
      myObserver.observe(element);
    }
  });
  onBeforeUnmount(() => {
    if (element && elementChild) myObserver.unobserve(element);
  });

  const myObserver = new ResizeObserver(() => {
    resizeDebounce();
  });
  const resizeHandle = () => {
    if (element && elementChild) {
      elementChild.style.transform = `scale(${element.clientWidth / originWidth})`;
      elementChild.style.width = (originWidth / element.clientWidth) * 100 + '%';
      elementChild.style.height = (originWidth / element.clientWidth) * 100 + '%';
      elementChild.style.transformOrigin = '0 0';
    }
  };
  const resizeDebounce = debounce(resizeHandle, 300);

  return { resizeDebounce, myObserver };
};
