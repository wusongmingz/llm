import { computed, ref } from 'vue';
import { getModelTokenInfo } from '@/api/LargeModelsList/modelSearch';
import { dayjs, ElMessage } from 'element-plus';
export const useOption = () => {
  const name = ref('');
  const xdata = ref<any>([]);
  const yseries1 = ref<any>([]);
  const yseries2 = ref<any>([]);
  const getTokenInfo = async (id: number) => {
    const res = await getModelTokenInfo({ modelId: id, queryDate: dayjs().format('YYYY-MM-DD') });
    if (res.code === 0) {
      if (res.data) {
        xdata.value = Object.keys(res.data);
        xdata.value.map((item: string) => {
          yseries1.value.push(Number(res.data[item].inTokens));
          yseries2.value.push(Number(res.data[item].outTokens));
        });
      }
    } else {
      ElMessage.error(res.msg || '网络错误');
    }
  };

  const chartOption = computed(() => {
    return {
      title: {
        text: '单位：Tokens',
        textStyle: {
          fontSize: 14,
        },
      },
      color: ['#d4e0ea', '#6bb1d3'],
      tooltip: {
        trigger: 'axis',
        // axisPointer: {
        //   type: 'shadow',
        // },
        formatter: (params: any) => {
          // tooltip标题
          const titleHtmlStr = `<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">${params[0].name}</div>`;
          //计数
          let sum = 0;
          // tooltip详情内容
          const itemHtmlStrArr = params.map((item: any) => {
            sum += item.value;
            return `<div style="display: flex;align-items:center;">
              ${item.marker}
              <div style="font-size: 14px;color: #666;margin: 0 20px 0 2px;">${item.seriesName}Tokens</div>
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
      legend: {
        top: '1%',
        icon: 'rect',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: xdata.value,
          axisLabel: {
            clickable: true,
            rotate: 60,
            interval: 0,
          },
          silent: false,
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '',
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
      ],
      series: [
        {
          name: '输入',
          type: 'bar',
          emphasis: {
            focus: 'series',
          },
          stack: 'total',
          data: yseries1.value,
        },
        {
          name: '输出',
          type: 'bar',
          emphasis: {
            focus: 'series',
          },
          stack: 'total',
          data: yseries2.value,
        },
      ],
    };
  });
  return {
    name,
    getTokenInfo,
    chartOption,
  };
};
