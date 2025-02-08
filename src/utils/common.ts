import { ElMessage } from 'element-plus';
import { getResource } from '@/utils/request';
import { useUserStore } from '@/store/modules/user';
import { querySysEnumListService } from '@/api/type/enum';

const userStore = useUserStore();

// 枚举
export interface enumList {
  label: string;
  value: number;
}

// 单位换算
export const toPowerWithW = (powerWithW: number) => {
  const rs = powerWithW * 1000;
  return rs.toFixed(0);
};

export const toPowerWithkW = (powerWithW: number) => {
  if (powerWithW) {
    powerWithW = Number(powerWithW);
    const rs = powerWithW / 1000;
    return rs.toFixed(0);
  } else {
    return 0;
  }
};

// 下拉框筛选值
export const selectFilter = (value: number, list: enumList[]) => {
  const arr = list.filter((el) => {
    if (el.value === value) {
      return el;
    }
  });
  if (arr.length > 0) {
    return arr[0].label;
  }
};

// 处理省市县
export const toAreaName = (areaList: any[], provCode: string, regionCode: string, countyCode: string) => {
  let str = '';
  const arr1 = areaList.filter((item: any) => {
    if (item.value === provCode) {
      return item;
    }
  });
  str += arr1[0].label;
  const arr2 = arr1[0].children.filter((item: any) => {
    if (item.value === regionCode) {
      return item;
    }
  });
  if (arr2.length > 0) {
    str += '/' + arr2[0].label;
    const arr3 = arr2[0].children.filter((item: any) => {
      if (item.value === countyCode) {
        return item;
      }
    });
    if (arr3.length > 0) {
      str += '/' + arr3[0].label;
    }
  }
  return str;
};

// 省市县
export const getAreaList = async () => {
  const res = await getResource('/resource/area.json');
  return res;
};

// 获取枚举值接口
export const getSysEnumListOption = async (domainFlag: string, tableName: string, columnName: string) => {
  let arr = <enumList[]>[];
  const res = await querySysEnumListService({ domainFlag: domainFlag, tableName: tableName, columnName: columnName });
  if (res.code === 0) {
    if (res.data && res.data.length > 0) {
      arr = res.data.map((item) => {
        return {
          label: item.dispName,
          value: Number(item.codeValue),
        };
      });
    }
  } else {
    ElMessage.warning(res.msg || '网络错误');
  }
  // console.log(arr);
  return arr;
};

export const getBtnConfig = (title: string) => {
  if (!userStore.btnList.has(title) || (userStore.btnList.has(title) && userStore.btnList.get(title))) {
    return true;
  } else {
    return false;
  }
};
