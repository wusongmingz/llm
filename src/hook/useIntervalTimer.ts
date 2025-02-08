import { onMounted, onUnmounted, ref } from 'vue';

/**
 * 循环调用定时器，关闭页面会自动清除定时器
 * @param callback The function to call when the timer elapses
 * @param ms The number of milliseconds to wait before calling the callback
 * @returns for use with clearInterval
 */
export const useIntervalTimer = (callback: () => void, ms: number | undefined) => {
  const timer = ref<NodeJS.Timer>();
  onMounted(() => {
    timer.value = setInterval(callback, ms);
  });
  onUnmounted(() => {
    clearInterval(timer.value);
  });
  return { timer };
};
