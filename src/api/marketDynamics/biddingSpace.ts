import { marketRequest } from '@/utils/request';

/**
 * @fixme 这里直接引入了axios，建议移至request并暴露出来
 * @fixme cancelToken 这个变量后期需要考虑用哈希map保存，因为多个接口公用，可能会互相影响
 * @fixme cancelToken 这个变量目前用完没有销毁，因其在全局中定义，可能造成内存泄漏
 */
import axios, { Canceler } from 'axios';
let cancelToken: Canceler;

export interface ISupplyCurveReq {
  area: number; // 区域：1：河东、2：河西
  infoDate: string[];
  infoType: number; // 1：日前、3：实时
  province: string; // 省份（目前只有“甘肃”)
}
export interface ISupplyCurveScatterDayAhead {
  hydroPowerForecast: string | number;
  infoTime: string;
  newEnergyPower: string | number;
  shortTermLoadForecast: string | number;
  transDayahead: string | number;
}
export interface ISupplyCurveScatterRuntime {
  actualLoad: string | number; // 实际负荷数据
  hydroPower: string | number; // 水电总实时出力
  infoTime: string; // 96 点
  newEnergyPower: string | number; // 新能源出力预测实时合计
  nonMarketOrientedActualPower: string | number; // 非市场化机组实际出力
  transRealPower: string | number; // 联络线实际出力
}
export type ISupplyCurveScatter = (ISupplyCurveScatterDayAhead | ISupplyCurveScatterRuntime) & { regionPrice: string };
export function getSupplyCurveScatter(data: ISupplyCurveReq) {
  if (cancelToken) cancelToken();
  return marketRequest<Record<string, ISupplyCurveScatter[]>[]>({
    cancelToken: new axios.CancelToken((cancelTokens) => {
      cancelToken = cancelTokens;
    }),
    url: '/supply/curve/fitting/scatter',
    method: 'POST',
    data,
  });
}

export interface ISupplyCurveTable {
  callWire: string; // 联络线
  hydropowerScheme: string; // 水电计划
  infoDate: string; // 日期
  newEnergyLoading: string; // 新能源负荷
  nodePrice: string; // 节点价格
  sysLoading: string; // 系统负荷
}
export function getSupplyCurveTable(data: ISupplyCurveReq) {
  return marketRequest<ISupplyCurveTable[]>({
    url: '/supply/curve/fitting/report',
    method: 'POST',
    data,
  });
}

export interface ISupplyCurveMonthlyReq {
  infoDate: string[];
  province: string; // 省份（目前只有“甘肃”)
}
export interface ISupplyCurveMonthly {
  actualLoad: number;
  hydroPower: number;
  hydroPowerForecast: number;
  info_date: string;
  info_time: string;
  newEnergyPower1: number;
  newEnergyPower3: number;
  nonMarketOrientedActualPower: number;
  shortTermLoadForecast: number;
  transDayahead: number;
  transRealPower: number;
}

export function getSupplyCurveMonthly(data: { infoDates: string[]; province: string; monthData: Record<string, string[]> }) {
  if (cancelToken) cancelToken();
  return marketRequest<ISupplyCurveMonthly[]>({
    cancelToken: new axios.CancelToken((cancelTokens) => {
      cancelToken = cancelTokens;
    }),
    url: '/moon/curve/fitting/scatter',
    method: 'POST',
    data,
  });
}

export interface IDeviationAnalysis {
  dayaheadRes: {
    hydroPowerForecast: number;
    info_date: string;
    info_time: string;
    newEnergyPower1: number;
    shortTermLoadForecast: number;
    transDayahead: number;
  }[];
  interdayRes: {
    actualLoad: number;
    hydroPower: number;
    info_date: string;
    info_time: string;
    newEnergyPower3: number;
    nonMarketOrientedActualPower: number;
    transRealPower: number;
  }[];
}
export function getDeviationAnalysis(data: ISupplyCurveMonthlyReq) {
  if (cancelToken) cancelToken();
  return marketRequest<IDeviationAnalysis>({
    cancelToken: new axios.CancelToken((cancelTokens) => {
      cancelToken = cancelTokens;
    }),
    url: '/analysis/bidding/space/graph',
    method: 'POST',
    data,
  });
}
