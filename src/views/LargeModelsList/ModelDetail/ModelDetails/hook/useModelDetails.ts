import { ITableHead, ITableAction, ITableConfig, ISearchForm } from '@/components/AAUI';
import { computed, Reactive, ref } from 'vue';
export const useModelDetails = () => {
  const inPriceUnit = ref('');
  const outPriceUnit = ref('');
  const tableHead = computed(() => {
    return [
      { label: 'APIKey', prop: 'apikey', align: 'left' },
      { label: '模型训推位宽', prop: 'bitWidth', align: 'center', minWidth: '100px' },
      { label: '是否支持流式输出', prop: 'isStream', align: 'left', minWidth: '180px' },
      { label: '最大输出 ', prop: 'maxTokens', align: 'left', minWidth: '120px' },
      { label: '输入（' + inPriceUnit.value + '）', prop: 'inPrice', align: 'left' },
      { label: '输出（' + outPriceUnit.value + '）', prop: 'outPrice', align: 'left' },
      { label: '延迟（秒）', prop: 'delay', align: 'left', minWidth: '120px' },
      { label: '吞吐量（Token/s）', prop: 'throughput', align: 'left', minWidth: '120px' },
    ];
  });
  const tableConfig: ITableConfig = {
    defaultSort: { prop: 'time', order: 'descending' },
  };
  const tableData = ref<any>({});
  const tableLoading = ref<boolean>(false);
  return {
    inPriceUnit,
    outPriceUnit,
    tableHead,
    tableData,
    tableLoading,
    tableConfig,
  };
};
