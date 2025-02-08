import { EChartsOption, SeriesOption } from 'echarts';
import { Ref, computed } from 'vue';

export default function (legendList: Ref<Map<string, string>>, chartData: Ref<Record<string, any>[]>, unit: string) {
  const legendTitleList = computed<string[]>(() => {
    return [...legendList.value.values()];
  });
  const series = computed<SeriesOption[]>(() => {
    return [...legendList.value.keys()].map((item, index) => {
      return {
        name: legendTitleList.value[index],
        type: 'line',
        data: chartData.value.map((e) => e[item]),
        symbol: 'none',
        smooth: true,
        emphasis: {
          focus: 'series',
        },
      };
    });
  });

  const option = computed<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: 60,
        right: 60,
        bottom: 45,
        top: 150,
        containLabel: true,
      },
      legend: {
        data: legendTitleList.value,
        padding: 10,
      },
      xAxis: {
        boundaryGap: false,
        type: 'category',
        data: chartData.value.map((item) => item.time),
      },
      yAxis: [
        {
          type: 'value',
          name: '单位: ' + unit,
          position: 'left',
        },
      ],
      toolbox: {
        feature: {
          saveAsImage: {
            title: '保存为图片',
            backgroundColor: '#fff',
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
          brushSelect: false,
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 100,
        },
      ],
      series: series.value,
    };
  });

  return {
    option,
  };
}
