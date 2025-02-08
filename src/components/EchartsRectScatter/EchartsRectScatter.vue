<template>
  <EchartsWithObserve ref="chartRef" :option="option" />
</template>

<script setup lang="ts" generic="T">
import { getEchartsTooltipContent } from '@/utils/utils';
import { EChartsOption } from 'echarts';
import { computed, ref, toRefs } from 'vue';

const props = defineProps<{
  xAxis: string[];
  yAxis: string[];
  data: T[];
  keyFlag: {
    xAxis: [keyof T, string];
    yAxis: [keyof T, string];
    value: [keyof T, string];
  };
  separate?: boolean;
  customTooltip?: (params: [string, string, string | number]) => string;
}>();

const { xAxis, yAxis, keyFlag, separate, data } = toRefs(props);
const chartRef = ref();

const xAxisDeal = computed(() => {
  if (separate.value) {
    const xAxisTemp = xAxis.value.reduce(
      (pre, cur) => {
        return [...pre, cur, '', ''];
      },
      [''],
    );
    xAxisTemp.pop();
    return xAxisTemp;
  } else {
    return xAxis.value;
  }
});
const yAxisDeal = computed(() => {
  return yAxis.value;
});

const dataDeal = computed<[number, number, any][]>(() => {
  return data.value.map((item) => [
    xAxisDeal.value.indexOf(item[keyFlag.value.xAxis[0]] as string),
    yAxisDeal.value.indexOf(item[keyFlag.value.yAxis[0]] as string),
    item[keyFlag.value.value[0]],
  ]);
});

const option = computed<EChartsOption>(() => ({
  tooltip: {
    show: true,
    formatter: function (params) {
      const [xIndex, yIndex, value] = (params as any).value;
      if (props.customTooltip) return props.customTooltip([xAxisDeal.value[xIndex], yAxisDeal.value[yIndex], value]);
      return getEchartsTooltipContent([
        [keyFlag.value.yAxis[1], yAxisDeal.value[yIndex]],
        [keyFlag.value.xAxis[1], xAxisDeal.value[xIndex]],
        [keyFlag.value.value[1], value],
      ]);
    },
  },
  grid: {
    left: 20,
    bottom: 20,
    right: 20,
    top: 20,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: xAxisDeal.value,
    boundaryGap: separate.value ? false : true,
    position: 'top',
    axisLabel: {
      interval: 0,
    },
    splitLine: {
      show: true,
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
  },
  yAxis: {
    type: 'category',
    data: yAxisDeal.value,
    inverse: true,
    axisLabel: {
      interval: 0,
    },
    splitLine: {
      show: true,
      interval: 0,
      lineStyle: {
        type: 'dashed',
      },
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  series: [
    {
      type: 'scatter',
      data: dataDeal.value,
      symbol: 'rect',
      label: {
        show: true,
        formatter: function (params) {
          const value = (params.value as any[])[2];
          if (value.toString().includes('%')) return `{percentage|${value}}`;
          if (parseFloat(value) < 0) return `{negative|${value}}`;
          if (parseFloat(value) > 0) return `{positive|${value}}`;
          return value;
        },
        color: '#aaaaaa',
        rich: {
          percentage: {
            color: '#000',
          },
          negative: {
            padding: [0, 10, 0, 0],
          },
          positive: {
            padding: [0, 0, 0, 10],
          },
        },
      },
      symbolOffset: function (params) {
        if (typeof params[2] === 'string' && params[2].includes('%')) {
          return [0, 0];
        }
        return ['50%', 0];
      },
      itemStyle: {
        color: function (params) {
          if (typeof (params.value as any[])[2] === 'string' && (params.value as any[])[2].includes('%')) {
            return parseInt((params.value as any[])[2]) > 33.3 ? '#fd1414' : 'transparent';
          }
          return parseInt((params.value as any[])[2]) > 0 ? '#fd1414' : '#2afb01';
        },
      },
      symbolSize: function (params) {
        let isPercentage = false;
        let dataCount = params[2];
        if (typeof params[2] === 'string') {
          dataCount = parseInt(dataCount);
          if (params[2].includes('%')) isPercentage = true;
        }
        if (chartRef.value) {
          const chartModel = chartRef.value.getInstance().getModel();
          const xlenth = chartModel.getComponent('xAxis').axis._extent[1];
          const ylenth = chartModel.getComponent('yAxis').axis._extent[0];
          const multiplier = isPercentage ? (dataCount / 100) * 2 : Math.max(Math.min(dataCount / 610, 1), -1);
          const width = separate.value ? (xlenth / (xAxisDeal.value.length - 1)) * multiplier : (xlenth / xAxisDeal.value.length / 2) * multiplier;
          return [width, (ylenth / yAxisDeal.value.length) * 0.6];
        } else {
          console.warn('找不到echarts实例，无法设置最大值');
          return [50 * (dataCount / 610), 50];
        }
      },
    },
  ],
}));
</script>
