import { onBeforeUnmount, onMounted, ref } from 'vue';
import { dayjs } from 'element-plus';

/**
 * 用于获取当前时间的hook，直接使用返回值即可，关闭页面会自动清除定时器
 * @param format 日期展示的格式
 * @returns 当前时间的字符串
 */
export const useTimeDisplay = (format = 'YYYY-MM-DD HH:mm:ss') => {
  const currentTime = ref('');
  let updateTimetimer: any;
  onMounted(() => {
    updateTimetimer = setInterval(() => {
      currentTime.value = dayjs().locale('zh-cn').format(format);
    }, 100);
  });
  onBeforeUnmount(() => {
    clearInterval(updateTimetimer);
  });
  return { currentTime };
};
