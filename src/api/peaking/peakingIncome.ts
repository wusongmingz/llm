import { IFileResponse, energyRequest } from '@/utils/request';

export interface IPeakingSettlement {
  id?: number;
  aggregatorOrgId?: number;
  month?: number;
  supportProvName: string;
  income?: number; //调峰费用，单位厘
  electricityVal?: number; //调峰电量，单位kwh
  forecastIncome: number; //测算值-调峰费用，单位厘
  forecastElectricityVal: number; //测算值-调峰电量，单位kwh
  appraiseIncome: number; //调峰费用考核值，单位厘
  appraiseElectricityVal: number; //调峰电量考核值，单位kwh
}

export function getPeakingSettlement(params: { month: string }) {
  return energyRequest<IPeakingSettlement[]>({
    url: '/peak-shaving-settlement/info',
    method: 'GET',
    params,
  });
}

export interface ISetPeakingSettlementReq {
  month: number;
  supportProvName: string;
  income?: number;
  peakShavingVal?: number;
}
export function setPeakingSettlement(data: ISetPeakingSettlementReq) {
  return energyRequest<IPeakingSettlement>({
    url: '/peak-shaving-settlement/submit',
    method: 'POST',
    data,
  });
}

export interface IPeakingChartData {
  peakShavingDate: string; //调峰日期
  clearingVal?: number; //出清量，单位w
  peakShavingVal?: number; //实际调节量，单位w
  appraisePeakShavingVal?: number; // 考核调峰量,单位w
  clearingDuration?: number; // 出清时长,单位秒
}

export function getPeakingChartData(params: { month: string }) {
  return energyRequest<IPeakingChartData[]>({
    url: '/peak-shaving-settlement/statisticsByDate',
    method: 'GET',
    params,
  });
}

export interface IPeakingIncome {
  custId: number;
  dayCount: number; //出清天数
  peakShavingVal: number; //月调峰量，单位w
  clearingVal: number; //月出清量，单位w
  aggregatorIncome: number; //月测算收益，单位厘
  appraiseAggregatorIncome: number; //月测算收益，单位厘(更新)
  custName: string; //调峰用户
  proportion: string; //测算收益占比，小数形式
  shareRatio: number; //聚合商收益比例，代表20%
  appraisePeakShavingVal: number;
  appraiseIncome: number;
  itemList: {
    supportProvName: string; //支援省市
    electricityVal: number; //调峰电量
    settleIncome: number; //结算单收益
    custSettleIncome: number; //用户收益
    aggregatorSettleIncome: number; //聚合商收益
  }[];
}

export function getPeakingIncomeList(params: { month: string }) {
  return energyRequest<IPeakingIncome[]>({
    url: '/peak-shaving-settlement/statisticsByCust',
    method: 'GET',
    params,
  });
}

export function exportPeakingIncomeList(params: { month: string }) {
  return energyRequest<IFileResponse>({
    url: '/peak-shaving-settlement/exportStatisticsByCust',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}
