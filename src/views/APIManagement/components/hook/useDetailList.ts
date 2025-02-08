import { ITableHead, ITableAction, ITableConfig } from '@/components/AAUI';
import { ref, computed, VNode, h } from 'vue';
// import { PeakingPlanAction, dealShow } from '../types';
import { getKeyDetail } from '@/api/APIManagement/management';

import { ElMessage, TableColumnCtx, dayjs } from 'element-plus';
import { clearEmptyFields } from '@/utils/utils';

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

  interface SummaryMethodProps<T = any> {
    columns: TableColumnCtx<T>[];
    data: T[];
  }
  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };
  const currentDate = new Date();
  const timePick = ref([formatDate(currentDate), formatDate(currentDate)]);

  const changeDate = (param: any) => {
    param.beginDate = timePick.value[0];

    param.endDate = timePick.value[1];
    getTableDetailList(param);
  };

  const getSummaries = (param: SummaryMethodProps) => {
    const { columns, data } = param;
    const sums: (string | VNode)[] = [];
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = h('div', { style: { textDecoration: '', fontWeight: 'bold' } }, ['合计']);
        return;
      }
      if (index === 1 || index === 3 || index === 5) {
        return;
      }
      if (index === 2) {
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
      }
      if (index === 4) {
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
  const filterHandler = (value: string, row: APIDeatil, column: TableColumnCtx<APIDeatil>) => {
    const property: string = column['property'];
    return row[property] === value;
  };
  const filterListOption = ref<any>([]);
  // table part
  const tableHead: any = computed(() => {
    return [
      { label: '时间', prop: 'createTime', align: 'left', minWidth: '150px', sortable: true },
      {
        label: '模型 ',
        prop: 'modelName',
        align: 'left',
        minWidth: '120px',
        filters: filterListOption,
        filterMethod: filterHandler,
        className: 'table-list-filter',
      },
      // { label: '应用', prop: 'appName', align: 'left' },
      { label: 'Tokens', prop: 'tokenAll', align: 'left' },
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
      { label: 'Token速率（Tokens/s）', prop: 'tokenSpeed', align: 'left', minWidth: '150px' },
      { label: '供应商', prop: 'supplierName', align: 'left' },
    ];
  });
  const tableConfig: ITableConfig = {
    defaultSort: { prop: 'time', order: 'descending' },
    showSummary: true,
    // height: '530',
    summaryMethod: <any>getSummaries,
  };

  const totalData = ref(0);
  const tableData = ref<APIDeatil[]>([]);
  const tableLoading = ref<boolean>(false);
  const tableActionList: ITableAction[] = [
    { label: '查看', prop: 'show', icon: 'icon-chakan' },
    { label: '编辑', prop: 'edit', icon: 'icon-bianji' },
    { label: '删除', prop: 'remove', icon: 'icon-shanchu' },
  ];

  const getTableDetailList = async (params: any) => {
    try {
      tableLoading.value = true;
      const res = await getKeyDetail(clearEmptyFields(params));
      filterListOption.value = [];
      if (res.code === 0 && res.data) {
        if (res.data.length > 0) {
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
        tableData.value = [];
        totalData.value = 0;
        // ElMessage.error(res.msg || '无数据');
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
    timePick,
    changeDate,
    // deletePlanSync,
  };
};
