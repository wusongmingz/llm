import { computed, Reactive, ref, VNode, h } from 'vue';
import { getEchartsTooltipContent } from '@/utils/utils';
import { clearEmptyFields } from '@/utils/utils';
import { ITableHead, ITableAction, ITableConfig, ISearchForm } from '@/components/AAUI';
import { getKeyList, keyReq, getMonthList, monthReq, getAllList, listKeyReq } from '@/api/APIBilling/billing';
import { ElMessage, TableColumnCtx, dayjs } from 'element-plus';
import { color } from 'html2canvas/dist/types/css/types/color';
import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';

export const useBilling = () => {
  const searchMonthDate = ref<any>({ date: [], series: [] });
  const searchList = computed<ISearchForm[]>(() => [
    {
      label: '',
      prop: 'queryMonth',
      type: 'datePicker',
      option: { type: 'month', format: 'YYYY-MM', valueFormat: 'YYYYMM', clearable: false, popperClass: 'select-date' },
    },
  ]);

  //获取数据
  const getMonthData = async (params: monthReq) => {
    const weatherData = <Record<string, string[]>>{};
    try {
      const res = await getMonthList(clearEmptyFields(params));
      if (res.code === 0 && res.data) {
        if (res.data?.models) {
          searchMonthDate.value.date = Object.keys(res.data)
            .reverse()
            .slice(0, Object.keys(res.data).length - 1);
          console.log(res.data.models, 11);
          res.data.models.forEach((model: any) => {
            model.dataArr = [];
            searchMonthDate.value.date.forEach((time: string) => {
              let sum = 0; //统计每天的消耗
              res.data[time].forEach((item: any) => {
                if (item.modelName == model.modelName) {
                  sum += item.tokenIn + item.tokenOut;
                }
              });
              model.dataArr.push(sum);
            });
          });
          //生成类别
          const modelDate = res.data?.models.map((item: any) => {
            return {
              name: item.modelName,
              type: 'bar',
              stack: 'total',
              emphasis: {
                focus: 'series',
              },
              data: item.dataArr,
            };
          });
          searchMonthDate.value.series = modelDate;
        }
      } else {
        ElMessage.error(res.msg || '网络错误');
      }
    } finally {
      // tableLoading.value = false;
    }
    return weatherData;
  };
  const chartOption = computed(() => {
    return {
      //数据集
      // dataset: {
      //   // 提供一份数据。
      //   source: [
      //     ['date', 'Direct', 'modele1', 'modele2', 'modele3', 'modele5', 'modele6'],
      //     ['2024-09-14', 43.3, 85.8, 93.7, 83.1, 73.4, 55.1],
      //     ['2024-09-15', 83.1, 73.4, 55.1, 86.4, 65.2, 82.5],
      //     ['2024-09-16', 86.4, 65.2, 82.5, 72.4, 53.9, 39.1],
      //     ['2024-09-17', 72.4, 53.9, 39.1, 3.3, 85.8, 93.7],
      //     ['2024-09-18', 72.4, 53.9, 39.1, 3.3, 85.8, 93.7],
      //     ['2024-09-19', 72.4, 53.9, 39.1, 3.3, 85.8, 93.7],
      //     ['2024-09-20', 72.4, 53.9, 39.1, 3.3, 85.8, 93.7],
      //   ],
      // },
      color: ['#c81820', '#fd9172', '#fce0d2', '#d6e2ee', '#9ccbdf', '#69b1d5', '#1f73b6'],
      title: {
        text: '单位：Tokens',
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        // formatter: function (data: any) {
        //   let res = '';
        //   let sum = 0;
        //   data.forEach((item: any, index: number) => {
        //     if (index == 0) {
        //       res += `${item.axisValue}<br/>`;
        //     }
        //     sum += item.value;
        //     res += `${item.marker} ${item.seriesName} : ${item.value}<br/>`;
        //     if (index == data.length - 1) {
        //       res += `Total : ${sum}`;
        //     }
        //   });
        //   return res;
        // },
        formatter: (params: any) => {
          // tooltip标题
          const titleHtmlStr = `<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">${params[0].name}</div>`;
          //计数
          let sum = 0;
          // tooltip详情内容
          const itemHtmlStrArr = params
            .filter((item) => {
              return item.value > 0;
            })
            .map((item: any) => {
              console.log('params:', params);

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
        left: '50',
        right: '180',
        bottom: '0',
        top: '50',
        containLabel: true,
      },
      //图例
      legend: {
        orient: 'vertical',
        right: 0,
        top: 'center',
        type: 'scroll',
        icon: 'rect',
        formatter: function (name: any) {
          return name.length > 17 ? name.substr(0, 17) + '...' : name;
        },
        tooltip: {
          show: true,
        },
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          clickable: true,
          rotate: 60,
          interval: 0,
        },
        silent: false,
        triggerEvent: true,
        data: searchMonthDate.value.date,
        // data: chartData.time,
        // data: chartData.value.map((item: any) => item.date),
      },
      yAxis: {
        type: 'value',
        // name: '用量',
        // position: 'left',
        // nameLocation: 'middle',
        // nameTextStyle: {
        //   padding: [0, 0, 40, 0],
        // },
        splitLine: {
          // show: false,
          lineStyle: {
            type: [5, 5],
            dashOffset: 1,
          },
        },
      },

      // toolbox: {
      //   feature: {
      //     saveAsImage: {
      //       name: label + '区域价格预测',
      //       title: '保存为图片',
      //       backgroundColor: '#fff'
      //     }
      //   }
      // },
      // dataZoom: [
      //   {
      //     type: 'inside',
      //     start: 0,
      //     end: 100,
      //   },
      //   {
      //     start: 0,
      //     end: 100,
      //   },
      // ],
      series: searchMonthDate.value.series,
    };
  });

  return {
    chartOption,
    searchList,
    getMonthData,
    searchMonthDate,
  };
};

export const dealShow = (item: any) => {
  return {
    ...item,
    tokenAll: item.tokenIn + item.tokenOut,
    createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
  };
};

export const useDetailListilList = () => {
  interface APIDeatil {
    id: number;
    createTime: string;
    modelName: string;
    appName: string;
    tokenAll: number;
    price: number;
    tokenSpeed: number;
    supplierName: string;
    [key: string]: string | number;
  }

  const filterHandler = (value: string, row: APIDeatil, column: TableColumnCtx<APIDeatil>) => {
    const property: string = column['property'];
    return row[property] === value;
  };

  const filterListOption = ref<any>([]);
  // table part
  const tableHead: any = computed(() => {
    return [
      { label: '时间', prop: 'createTime', align: 'left', minWidth: '135px', sortable: true },
      { label: 'API-Key', prop: 'keyName', align: 'left' },
      {
        label: '模型 ',
        prop: 'modelName',
        align: 'left',
        filters: filterListOption,
        filterMethod: filterHandler,
        className: 'table-list-filter',
      },
      // { label: '应用', prop: 'appName', align: 'left', minWidth: '120px' },
      { label: 'Tokens（in-out）', prop: 'tokenAll', align: 'left', minWidth: '140px' },
      {
        label: '输入单价' + '（' + (tableData.value.length > 0 ? tableData.value[0].promptPriceUnit : '元/千tokens') + '）',
        prop: 'promptPrice',
        align: 'left',
        minWidth: '170px',
      },
      {
        label: '输出单价' + '（' + (tableData.value.length > 0 ? tableData.value[0].generationPriceUnit : '元/千tokens') + '）',
        prop: 'generationPrice',
        align: 'left',
        minWidth: '170px',
      },
      { label: 'Token速率（Tokens/s）', prop: 'tokenSpeed', align: 'left', minWidth: '120px' },
      { label: '供应商', prop: 'supplierName', align: 'left' },
    ];
  });

  interface SummaryMethodProps<T = any> {
    columns: TableColumnCtx<T>[];
    data: T[];
  }

  const getSummaries = (param: SummaryMethodProps) => {
    const { columns, data } = param;
    const sums: (string | VNode)[] = [];
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = h('div', { style: { textDecoration: '', fontWeight: 'bold' } }, ['合计']);
        return;
      }
      if (index === 1 || index === 2 || index === 4 || index === 5) {
        return;
      }
      if (index === 3) {
        const values1 = data.map((item) => Number(item['tokenIn']));
        const values2 = data.map((item) => Number(item['tokenOut']));
        if (!values1.every((value) => Number.isNaN(value)) && !values2.every((value) => Number.isNaN(value))) {
          sums[index] =
            `${values1.reduce((prev, curr) => {
              const value = Number(curr);
              if (!Number.isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0)}` +
            '-' +
            `${values2.reduce((prev, curr) => {
              const value = Number(curr);
              if (!Number.isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0)}`;
        } else {
          sums[index] = '';
        }
      }
      if (index === 6) {
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => Number.isNaN(value))) {
          sums[index] = `${values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!Number.isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)}`;
        } else {
          sums[index] = '';
        }
        if (sums[index] != '') {
          sums[index] = (Number(sums[index]) / data.length).toFixed(1) + '';
        }
      }
    });

    return sums;
  };

  const totalData = ref(0);
  const tableConfig: ITableConfig = {
    defaultSort: { prop: 'time', order: 'descending' },
    showSummary: true,
    // height: 'calc(100vh - 425px)',
    height: '530',
    border: false,
    summaryMethod: <any>getSummaries,
  };
  // console.log(11221);
  const tableData = ref<APIDeatil[]>([]);
  const tableLoading = ref<boolean>(false);
  const tableActionList: ITableAction[] = [
    { label: '查看', prop: 'show', icon: 'icon-chakan' },
    { label: '编辑', prop: 'edit', icon: 'icon-bianji' },
    { label: '删除', prop: 'remove', icon: 'icon-shanchu' },
  ];

  const getTableDetailList = async (params: listKeyReq) => {
    try {
      tableLoading.value = true;
      const res = await getAllList(clearEmptyFields(params));
      filterListOption.value = [];
      if (res.code === 0) {
        if (res.data) {
          tableData.value = res.data.map((item: any) => {
            if (!filterListOption.value.find((t: any) => t.value == item.modelName)) {
              filterListOption.value.push({ text: item.modelName, value: item.modelName });
            }

            return dealShow(item);
          });
          totalData.value = res.data.total || 0;
        } else {
          tableData.value = [];
          totalData.value = 0;
        }
      } else {
        ElMessage.error(res.msg || '网络错误');
      }
    } finally {
      tableLoading.value = false;
    }
  };

  //   const deletePlanSync = (planId: number) => {
  //     return new Promise((resolve, reject) => {
  //       deletePlan(planId).then((res) => {
  //         if (res.code === 0 && res.data) {
  //           ElMessage.success('作废成功');
  //           resolve(res);
  //         } else {
  //           ElMessage.error(res.msg || '作废失败');
  //           reject(res);
  //         }
  //       });
  //     });
  //   };

  return {
    tableHead,
    totalData,
    tableData,
    tableActionList,
    tableLoading,
    tableConfig,
    getTableDetailList,
    // deletePlanSync,
  };
};
