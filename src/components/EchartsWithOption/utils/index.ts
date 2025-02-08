import { SeriesOption } from 'echarts';

export interface ILegend {
  name: string;
  type: 'line' | 'scatter' | 'area';
  prop: string;
  color?: string;
}

export function getSeriesByLegend(option: ILegend): SeriesOption {
  const optionCache = {
    name: option.name,
    color: option.color,
  };
  if (option.type === 'line') {
    return {
      ...optionCache,
      type: 'line',
      showSymbol: false,
    };
  }
  if (option.type === 'area') {
    return {
      ...optionCache,
      type: 'line',
      showSymbol: false,
      lineStyle: {
        width: 0,
      },
      areaStyle: {},
    };
  }
  return {
    ...optionCache,
    type: 'line',
  };
}
