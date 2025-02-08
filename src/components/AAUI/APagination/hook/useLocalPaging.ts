import { useThemeStore } from '@/store/modules/theme';
import { Ref, computed, ref } from 'vue';

export default <T>(dataList: Ref<T[]>) => {
  const pageParams = ref({
    pageNo: 1,
    pageSize: useThemeStore().pageSize,
  });
  const total = computed(() => dataList.value.length);
  const pagingData = computed(() => {
    const { pageNo, pageSize } = pageParams.value;
    return dataList.value.slice((pageNo - 1) * pageSize, pageNo * pageSize);
  });
  return {
    pageParams,
    pagingData,
    total,
  };
};
