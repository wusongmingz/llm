import { computed, ref, watch } from 'vue';
import { getHotMonthDataList, getHotMonthTypeList, getHotYearDataList, getHotYearTypeList } from '@/api/modelUsageList/usageList';
export const getAccumulateUsageMonthList = (selectMonth: any) => {
  const accumulateSeries = ref<any>();
  const accumulateXAxisData = ref<any>();

  const getMonthData = async () => {
    const year = ref(selectMonth.value.getFullYear());
    const month = ref(selectMonth.value.getMonth() + 1);
    const queryMonth = ref({ queryMonth: `${year.value}-${month.value > 9 ? month.value : '0' + month.value}` });

    try {
      const res = await getHotMonthDataList(queryMonth.value);
      if (res.code === 0) {
        //处理数据
        accumulateSeries.value = null;
        accumulateXAxisData.value = null;

        const data = res.data;
        accumulateXAxisData.value = Object.keys(data);

        const topicsSet = new Set();
        for (const i in data) {
          data[i].forEach((item: any) => {
            topicsSet.add(item.type);
          });
        }
        const topics = Array.from(topicsSet);
        accumulateSeries.value = topics.map((topic) => ({
          name: topic,
          type: 'bar',
          // barWidth: '40%',
          stack: 'value',
          data: new Array(accumulateXAxisData.value.length).fill(0), //
        }));
        accumulateXAxisData.value.forEach((date: any, index: any) => {
          data[date]?.forEach((item: any) => {
            const topicIndex = topics.indexOf(item.type);
            if (topicIndex !== -1) {
              accumulateSeries.value[topicIndex].data[index] += item.totalTokens; // 累加总 Token 数
            }
          });
        });
        // console.log('series');
        // console.log(accumulateSeries.value);
      }
    } finally {
      //
      // console.log('Topics:', accumulateSeries.value);
      // console.log('Accumulate Series:', accumulateSeries.value);
    }
  };
  // watch(
  //   selectMonth,
  //   () => {
  //     getMonthData();
  //   },
  //   { immediate: true },
  // );
  const accumulateChartOption = computed(() => {
    return {
      color: [
        '#a5a6fc',
        '#c8b2fd',
        '#e2b5e3',
        '#ddc6f2',
        '#e8d2e5',
        '#85b5ff',
        '#9a8edf',
        '#ddd7ff',
        '#ecb8ea',
        '#f5daff',
        '#ddcbf0',
        '#cbcdfe',
        '#e0e2ff',
        '#f1dcf2',
        '#f8eef9',
        '#e0d6fe',
        '#efe9fe',
        '#B3D4FF',
        '#d5e9ff',
        '#ceaedb',
      ],
      title: {
        text: '单位：Tokens',
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        formatter: (params: any) => {
          // tooltip标题
          const titleHtmlStr = `<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">${params[0].name}</div>`;
          //计数
          let sum = 0;
          // tooltip详情内容
          const itemHtmlStrArr = params
            .filter((item) => !!item.value)
            .map((item: any) => {
              sum += item.value;
              return `<div style="display: flex;align-items:center;">
              ${item.marker}
              <div style="font-size: 14px;color: #666;margin: 0 20px 0 2px;">${item.seriesName}</div>
              <span style="margin-left: auto;text-align: right;font-weight: 900;">${item.value}</span>
            </div>`;
            });
          itemHtmlStrArr.push(
            `<div style="display: flex;align-items:center;"><div style="font-size: 14px;color: #666;margin: 0 20px 0 2px;">Total</div><span style="margin-left: auto;text-align: right;font-weight: 900;">${sum}</span></div>`,
          );
          const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
            ${itemHtmlStrArr.join('')}
          </div>`;

          // 最终html字符串
          const resHtmlStr = titleHtmlStr + contentHtmlStr;
          return resHtmlStr;
        },
      },
      grid: {
        left: '15',
        right: '120',
        bottom: '0',
        top: '40',
        containLabel: true,
      },
      //图例
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'start',
        type: 'scroll',
        icon: 'rect',
        formatter: function (name: any) {
          return name.length > 6 ? name.substr(0, 17) + '...' : name;
        },
        tooltip: {
          show: true,
        },
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        axisLabel: {
          clickable: true,
          rotate: 60,
          interval: 0,
        },
        silent: false,
        triggerEvent: true,
        data: accumulateXAxisData.value,
      },
      yAxis: {
        type: 'value',
        // name: '用量',
        position: 'left',
        nameLocation: 'middle',
        nameTextStyle: {
          padding: [0, 0, 10, 0],
        },
        splitLine: {
          // show: false,
          lineStyle: {
            type: [5, 5],
            dashOffset: 1,
          },
        },
      },
      series: accumulateSeries.value,
    };
  });

  return {
    getMonthData,
    accumulateChartOption,
  };
};
export const getMonthHotPromptList = (selectMonth: any, limit: number) => {
  const year = ref(selectMonth.value.getFullYear());
  const month = ref(selectMonth.value.getMonth() + 1);
  const params = { queryMonth: `${year.value}-${month.value > 9 ? month.value : '0' + month.value}`, limit: limit };
  const hotPromptsList = ref();
  const getMonthHotList = async () => {
    try {
      const res = await getHotMonthTypeList(params);
      if (res.code === 0) {
        const data = res.data;
        hotPromptsList.value = data;
      }
    } finally {
      //
    }
  };
  return {
    getMonthHotList,
    hotPromptsList,
  };
};
export const getYearBarDataList = () => {
  const barSeries = ref<any>({
    realtimeSort: true,
    name: '使用量',
    type: 'bar',
    barWidth: '40px',
    data: [], // 初始为空，稍后填充
  });
  const barXAxisData = ref<any[]>([]);
  const getYearData = async () => {
    try {
      const res = await getHotYearDataList();
      if (res.code === 0) {
        const data = res.data;
        if (data) {
          Object.keys(data).forEach((key) => {
            barXAxisData.value.push(data[key].type);
            barSeries.value.data.push(data[key].totalTokens);
          });
        }
      }
    } finally {
      //
      // console.log(barXAxisData.value);
      // console.log(barSeries.value);
      // console.log(barOption.value);
    }
  };

  const barOption = computed(() => {
    return {
      title: {
        text: '单位：Tokens',
        textStyle: {
          fontSize: 14,

          fontFamily: 'sans-serif',
        },
      },
      color: '#e0defe',
      tooltip: {
        appendToBody: true,
      },
      xAxis: {
        data: barXAxisData.value,
        axisLabel: {
          clickable: true,
        },
        silent: false,
        triggerEvent: true,
      },
      grid: {
        left: '12',
        right: '12',
        bottom: '0',
        top: '40',
        containLabel: true,
      },
      yAxis: {
        type: 'value',
        // name: '用量',
        position: 'left',
        nameLocation: 'middle',
        nameTextStyle: {
          padding: [0, 0, 40, 0],
        },
        splitLine: {
          // show: false,
          lineStyle: {
            type: [5, 5],
            dashOffset: 1,
          },
        },
      },
      // legend: {
      //   orient: 'horizontal',
      //   top: 'top',
      //   show: true,
      //   left: 'center',
      //   type: 'scroll',
      //   icon: 'rect',
      //   itemGap: 2,
      //   itemHeight: 8,
      //   itemWidth: 12,
      //   textStyle: {
      //     fontSize: 12,
      //   },
      // },
      series: barSeries.value,
    };
  });
  return {
    getYearData,
    barOption,
  };
};
export const getYearHotPromptsList = () => {
  const yearHotPromptsList = ref();
  const getYearHotList = async () => {
    try {
      const res = await getHotYearTypeList();
      if (res.code === 0) {
        const data = res.data;
        yearHotPromptsList.value = data;
      }
    } finally {
      //
    }
  };
  return {
    yearHotPromptsList,
    getYearHotList,
  };
};
