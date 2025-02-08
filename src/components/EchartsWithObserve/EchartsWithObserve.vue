<template>
  <div ref="chartDom" class="chart-dom"></div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import * as echarts from 'echarts';
import { debounce } from 'lodash-es';
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useDark } from '@vueuse/core';

const prop = defineProps<{
  option: echarts.EChartsCoreOption;
}>();

let chartInstance: echarts.ECharts | undefined = undefined;
const chartDom = ref<HTMLElement>();

const option = toRef(prop, 'option');
const dealOption = computed(() => {
  return {
    backgroundColor: 'transparent',
    ...option.value,
  };
});
watch(
  dealOption,
  (val) => {
    chartInstance?.setOption(val, true);
  },
  { immediate: true, deep: true },
);

const isDark = useDark();
onMounted(() => {
  if (chartDom.value) {
    chartInstance = echarts.init(chartDom.value, isDark.value ? 'dark' : 'light');
    chartInstance.setOption(dealOption.value);
    myObserver.observe(chartDom.value);
  }
});
onBeforeUnmount(() => {
  if (chartDom.value) myObserver.unobserve(chartDom.value);
  if (chartInstance) chartInstance.dispose();
});

const myObserver = new ResizeObserver(() => {
  resizeCharts();
});
const resizeCharts = debounce(() => {
  chartInstance?.resize();
}, 300);

const getInstance = () => {
  return chartInstance;
};

watch(isDark, () => {
  if (chartDom.value) {
    chartInstance?.dispose();
    chartInstance = echarts.init(chartDom.value, isDark.value ? 'dark' : 'light');
    chartInstance?.setOption(dealOption.value);
  }
});

defineExpose({
  getInstance,
  chartDom,
});
</script>

<style scoped>
.chart-dom {
  width: 100%;
  height: 100%;
}
</style>
