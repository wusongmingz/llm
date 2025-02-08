import Decimal from 'decimal.js';
import { TableColumnCtx } from 'element-plus';
import { h, VNode } from 'vue';

export function dealWToKw(value: number | string | Decimal) {
  return Decimal.div(value, 1000).toNumber();
}

export function dealKwToW(value: number | string | Decimal) {
  return Decimal.mul(value, 1000).toNumber();
}

export function dealFloatToPercentage(value: number | string | Decimal) {
  return Decimal.mul(value, 100).toNumber();
}

export function dealLiToYuan(value: number | string | Decimal) {
  return Decimal.div(value, 1000).toNumber();
}

export function dealYuanToLi(value: number | string | Decimal) {
  return Decimal.mul(value, 1000).toNumber();
}

export function unitConversionWithPriceAndPower<T extends Record<string, any>>(data: T, priceList: (keyof T)[], powerList: (keyof T)[]) {
  const dataTemp: T = { ...data };
  priceList.forEach((item) => {
    dataTemp[item] = (dataTemp[item] && dealLiToYuan(dataTemp[item])) as any;
  });
  powerList.forEach((item) => {
    dataTemp[item] = (dataTemp[item] && dealWToKw(dataTemp[item])) as any;
  });
  return dataTemp;
}

export function toFixedByKeys<T>(data: T, keys: (keyof T)[], fractionDigits = 2) {
  const temp = { ...data };
  for (const key of keys) {
    if (typeof data[key] === 'string') {
      temp[key] = Number(data[key]).toFixed(fractionDigits) as any;
    } else if (typeof data[key] === 'number') {
      temp[key] = Number(Number(data[key]).toFixed(fractionDigits)) as any;
    } else {
      void 0;
    }
  }
  return temp;
}

export function formatByKeys<T>(data: T, keys: (keyof T)[], func: (data: any) => any) {
  const temp = { ...data };
  for (const key of keys) {
    temp[key] = func(temp[key]);
  }
  return temp;
}

export const getSummaryMethod = (
  list: string[],
  exclude = false,
  customMethod?: (values: number[], column: TableColumnCtx<any>) => number | string,
) => {
  return (param: { columns: TableColumnCtx<any>[]; data: any[] }) => {
    const { columns, data } = param;
    const sums: (string | VNode)[] = [];
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = h('div', { style: { textDecoration: '', fontWeight: 'bold' } }, ['合计']);
      } else if (exclude ? !list.includes(column.property) : list.includes(column.property)) {
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => Number.isNaN(value))) {
          sums[index] = customMethod
            ? customMethod(values, column).toString()
            : values
                .reduce((prev, curr) => {
                  return Decimal.add(prev, curr).toNumber();
                }, 0)
                .toString();
        } else {
          sums[index] = '-';
        }
      } else {
        sums[index] = '';
      }
    });
    return sums;
  };
};
