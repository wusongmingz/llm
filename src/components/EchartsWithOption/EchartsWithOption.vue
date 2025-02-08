<script setup lang="ts">
import { computed, onMounted, ref, nextTick, watch } from 'vue';
import { EChartsOption, SeriesOption } from 'echarts';
import { ILegend, getSeriesByLegend } from './utils';
import { BottomRight, Sort, TopRight } from '@element-plus/icons-vue';

const props = defineProps<{
  legendList: ILegend[];
  data: Record<string, any>[];
  xAxisProp: string;
  selectAxis?: string;
  showLegend?: boolean;
  unit?: string;
  customTooltipOption?: EChartsOption['tooltip'];
  sortBy?: string;
}>();
const emits = defineEmits<{
  (event: 'update:selectAxis', value: string): void;
}>();

const sortFlag = ref<'increase' | 'decrease' | 'none'>('none');
const sortData = computed<Record<string, any>[]>(() => {
  if (props.sortBy) {
    if (sortFlag.value === 'increase') {
      return [...props.data].sort((a, b) => (parseFloat(a[props.sortBy!]) > parseFloat(b[props.sortBy!]) ? 1 : -1));
    } else if (sortFlag.value === 'decrease') {
      return [...props.data].sort((a, b) => (parseFloat(a[props.sortBy!]) > parseFloat(b[props.sortBy!]) ? -1 : 1));
    } else {
      return [...props.data];
    }
  }
  return [...props.data];
});

const xAxis = computed<string[]>(() => {
  return sortData.value.map((e) => e[props.xAxisProp]);
});

const series = computed<SeriesOption[]>(() => {
  return props.legendList.map((item) => ({
    ...getSeriesByLegend(item),
    data: sortData.value.map((e) => {
      return (item.prop in e ? parseFloat(e[item.prop]).toFixed(3) : undefined) as any;
    }),
  }));
});

const option = computed<EChartsOption>(() => ({
  xAxis: {
    data: xAxis.value,
    triggerEvent: true,
    boundaryGap: false,
    axisLabel: {
      interval: 0,
      formatter: (value) => {
        if (props.selectAxis === value) return '{select|' + value + '}';
        return value;
      },
      rotate: Math.min(xAxis.value.length < 15 ? 0 : xAxis.value.length, 90),
      rich: {
        select: {
          backgroundColor: '#146caf',
          color: '#fff',
          borderRadius: 3,
          padding: [3, 3, 1, 3],
        },
      },
    },
  },
  title: {
    text: props.unit ? '单位：' + props.unit : undefined,
    left: 20,
    top: 5,
    textStyle: {
      color: '#6e7079',
      fontSize: 13,
      fontWeight: 'normal',
    },
  },
  legend: {
    show: props.showLegend ?? false,
    type: 'scroll',
    data: props.legendList.map((item) => item.name),
  },
  yAxis: {
    type: 'value',
  },
  tooltip: props.customTooltipOption || {
    trigger: 'axis',
  },
  grid: {
    left: 20,
    bottom: 20,
    right: 40,
    top: 40,
    containLabel: true,
  },
  series: series.value,
}));

const chartRef = ref();
// 监听点击事件，通知父组件更新数据
onMounted(() => {
  if (chartRef.value) {
    nextTick(() => {
      const instanse = chartRef.value.getInstance();
      instanse.on('click', function (params: any) {
        if (params.componentType === 'series' && params.name && params.name.indexOf('select') === -1) {
          emits('update:selectAxis', params.name);
        } else if (params.componentType === 'xAxis' && params.value && params.value.indexOf('select') === -1) {
          emits('update:selectAxis', params.value);
        }
      });
    });
  }
});
// 当选中横轴的日期后，重新绘制echarts,让横轴选中项刷新变色
watch(
  () => props.selectAxis,
  () => {
    if (chartRef.value) chartRef.value.getInstance().setOption({});
  },
);
</script>

<template>
  <div class="echart-option-box">
    <el-popover v-if="props.sortBy" placement="bottom-start" trigger="hover">
      <template #reference>
        <el-button
          class="sort-btn"
          circle
          type="primary"
          plain
          :icon="sortFlag === 'increase' ? TopRight : sortFlag === 'decrease' ? BottomRight : Sort"
          size="small"
        ></el-button>
      </template>
      <div class="sort-btn-item">
        <el-tooltip content="升序">
          <el-button @click="sortFlag = 'increase'" circle type="primary" plain :icon="TopRight" size="small"></el-button>
        </el-tooltip>
        <el-tooltip content="关">
          <el-button @click="sortFlag = 'none'" circle type="primary" plain :icon="Sort" size="small"></el-button>
        </el-tooltip>
        <el-tooltip content="降序">
          <el-button @click="sortFlag = 'decrease'" circle type="primary" plain :icon="BottomRight" size="small"></el-button>
        </el-tooltip>
      </div>
    </el-popover>

    <EchartsWithObserve ref="chartRef" :option="option" />
  </div>
</template>

<style scoped lang="scss">
.echart-option-box {
  width: 100%;
  height: 100%;
  position: relative;
  .sort-btn {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 200;
  }
}
.sort-btn-item {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>
