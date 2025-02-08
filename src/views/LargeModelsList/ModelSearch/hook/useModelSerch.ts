import { computed, ref, watch, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import type { CSSProperties } from 'vue';
import { getOptionsList, getList } from '@/api/LargeModelsList/modelSearch';
import { clearEmptyFields } from '@/utils/utils';

export const useModelSerch = () => {
  //防抖定时器
  let timer = <any>{};

  const inputFilter = ref('');

  const searchType = ref(1);
  const options = [
    {
      value: 1,
      label: '最近更新',
    },
    {
      value: 2,
      label: '使用量排序',
    },
  ];

  //文本长度
  const textLen = ref(10);

  interface Mark {
    style: CSSProperties;
    label: string;
  }
  type Marks = Record<number, Mark | string>;
  const marks = reactive<Marks>({
    10: '4K',
    20: '8K',
    30: '16K',
    40: '32K',
    50: '128K',
    60: '192K',
    70: '256K',
    80: '1M',
  });

  //自定义价格最高、最低
  const minPrice = ref<any>('');
  const maxPrice = ref<any>('');

  //供应商列表
  const supplierList = ref<any>([]);
  //热门任务
  const hotAbilityList = ref<any>([]);
  //自然语言处理任务
  const textAbilityList = ref<any>([]);
  //模型类别
  const tagList = ref<any>([]);
  //列表数据
  const modelList = ref<any>([]);
  //条件列表
  const conditionList = ref<any>([]);
  const conditionFlag = ref(false);
  const conditionListFlag = ref(false);
  //获取所有字典接口
  const getAllDict = async () => {
    conditionFlag.value = true;
    const res = await getOptionsList();
    if (res.code === 0) {
      //供应商列表赋值
      supplierList.value = res.data?.series;
      //热门任务赋值
      hotAbilityList.value = res.data?.hotAbility;
      //自然语言处理
      textAbilityList.value = res.data?.textAbility;
      //模型类别
      tagList.value = res.data?.tag.map((item: any) => {
        return { label: item, value: item };
      });
    } else {
      ElMessage.error(res.msg || '网络错误');
    }
    conditionFlag.value = false;
  };

  //添加条件列表
  const addConditionList = (index: number, data: any) => {
    data.isActive = !data.isActive;
    let delIndex = 0;
    if (index === 3) {
      if (
        conditionList.value.some((item: any, index: number) => {
          delIndex = index;
          return item.value === data.value;
        })
      ) {
        hotAbilityList.value.map((item: any) => {
          if (item.value === data.value) {
            item.isActive = false;
          }
        });
        textAbilityList.value.map((item: any) => {
          if (item.value === data.value) {
            item.isActive = false;
          }
        });
        conditionList.value.splice(delIndex, 1);
        return;
      }
      hotAbilityList.value.map((item: any) => {
        if (item.value === data.value) {
          item.isActive = true;
        }
      });

      textAbilityList.value.map((item: any) => {
        if (item.value === data.value) {
          item.isActive = true;
        }
      });

      conditionList.value.push({
        type: index,
        label: data.chName,
        value: data.value,
      });
    } else if (index === 4) {
      if (
        conditionList.value.some((item: any, index: number) => {
          delIndex = index;
          return item.value === data.series;
        })
      ) {
        conditionList.value.splice(delIndex, 1);
        return;
      }
      conditionList.value.push({
        type: index,
        label: data.series,
        value: data.series,
      });
    } else if (index === 5) {
      if (
        conditionList.value.some((item: any, index: number) => {
          delIndex = index;
          return item.value === data.value;
        })
      ) {
        conditionList.value.splice(delIndex, 1);
        return;
      }
      conditionList.value.push({
        type: index,
        label: data.label,
        value: data.value,
      });
    }
  };
  //删除指定条件数组
  const delConditionList = (index: number, data: any) => {
    conditionList.value.splice(index, 1);
    if (data.type === 3) {
      hotAbilityList.value.map((item: any) => {
        if (item.value === data.value) {
          item.isActive = false;
        }
      });

      textAbilityList.value.map((item: any) => {
        if (item.value === data.value) {
          item.isActive = false;
        }
      });
    }
    if (data.type === 4) {
      supplierList.value.map((item: any) => {
        if (item.series === data.value) {
          item.isActive = false;
        }
      });
    }
    if (data.type === 5) {
      tagList.value.map((item: any) => {
        if (item.value === data.value) {
          item.isActive = false;
        }
      });
    }
  };
  //清空指定条件数组
  const clearConditionList = () => {
    supplierList.value.map((item: any) => {
      item.isActive = false;
    });
    hotAbilityList.value.map((item: any) => {
      item.isActive = false;
    });
    textAbilityList.value.map((item: any) => {
      item.isActive = false;
    });
    tagList.value.map((item: any) => {
      item.isActive = false;
    });
    conditionList.value.length = 0;
  };
  //处理条件参数
  const conditionFrom = computed(() => {
    const from = <any>{
      contextLength: marks[textLen.value],
      lowPrice: minPrice.value,
      highPrice: maxPrice.value,
      tagList: [],
      supplierName: '',
      listOrder: searchType.value,
      series: '',
      abilities: [],
    };

    conditionList.value.map((item: { type: number; label: string; value: string }) => {
      if (item.type === 3) {
        from.abilities.push(item.value);
      }
      if (item.type === 4) {
        from.series += item.value + '|';
      }
      if (item.type === 5) {
        from.tagList.push(item.value);
      }
    });

    return from;
  });

  //查询条件接口
  const getModelList = async () => {
    conditionListFlag.value = true;
    const res = await getList(clearEmptyFields(conditionFrom.value));
    if (res.code === 0) {
      if (res.data) {
        modelList.value = res.data;
      } else {
        modelList.value = [];
      }
    } else {
      ElMessage.error(res.msg || '网络错误');
    }
    conditionListFlag.value = false;
  };

  const filterModelList = computed(() => {
    return modelList.value.filter((item: any) => {
      if (inputFilter.value === '') {
        return item;
      }
      if (item?.introduce && item?.introduce?.toUpperCase().indexOf(inputFilter.value.toUpperCase()) !== -1) {
        return item;
      }
      if (item?.name && item?.name?.toUpperCase().indexOf(inputFilter.value.toUpperCase()) !== -1) {
        return item;
      }
      if (item?.supplierName && item?.supplierName?.toUpperCase().indexOf(inputFilter.value.toUpperCase()) !== -1) {
        return item;
      }
      if (item?.contextLength && item?.contextLength?.toUpperCase().indexOf(inputFilter.value.toUpperCase()) !== -1) {
        return item;
      }
    });
  });

  const reToDoCheck = () => {
    if (timer) {
      //不为空就清除当前定时器
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      getModelList();
    }, 1000);
  };

  //监听from变化，就调接口查询
  watch(
    conditionFrom,
    () => {
      reToDoCheck();
    },
    {
      deep: true,
    },
  );

  return {
    inputFilter,
    searchType,
    options,
    textLen,
    marks,
    minPrice,
    maxPrice,
    supplierList,
    hotAbilityList,
    textAbilityList,
    tagList,
    getAllDict,
    conditionList,
    conditionListFlag,
    conditionFlag,
    addConditionList,
    delConditionList,
    clearConditionList,
    getModelList,
    modelList,
    filterModelList,
  };
};
