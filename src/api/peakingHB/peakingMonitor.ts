import { IFileResponse, energyRequest } from '@/utils/request';

export interface IHBPeakingMonitorOverviewReq {
  peakShavingDate: string;
  resSegment?: number;
}
export interface IHBPeakingMonitorOverview {
  appraiseIncome: number;
  contributeCustCount: number;
  custCount: number;
  income: number;
  peakShavingDate: string;
  peakShavingFee: number;
  peakShavingVal: number;
  forecastTime: string;
}
export function getHBPeakingMonitorOverview(params: IHBPeakingMonitorOverviewReq) {
  return energyRequest<IHBPeakingMonitorOverview>({
    url: '/peak-shaving/north-china/detection/general',
    method: 'GET',
    params,
  });
}

export interface IHBPeakingMonitorListReq extends IHBPeakingMonitorOverviewReq {
  custId?: number;
}
export interface IHBPeakingMonitorItem {
  actualVal: number;
  aggregatorActualVal: number;
  aggregatorAppraiseIncome?: number;
  aggregatorBaseVal: number;
  appraiseIncome?: number;
  avgrtVal?: number;
  baseVal: number;
  clearingPrice?: number;
  custAppraiseIncome?: number;
  custId: number;
  dateTime: string;
  declareVal: number;
  deviation?: number;
  income?: number;
  isClearing: number;
  peakShavingVal?: number;
  resSegmentName: string;
}

export function getHBPeakingMonitorList(params: IHBPeakingMonitorListReq) {
  return energyRequest<IHBPeakingMonitorItem[]>({
    url: '/peak-shaving/north-china/detection/items',
    method: 'GET',
    params,
  });
}

export function exportHBPeakingMonitorList(params: IHBPeakingMonitorListReq) {
  return energyRequest<IFileResponse>({
    url: '/peak-shaving/north-china/detection/exportItems',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}

export interface IHBPeakingUserDateReq {
  peakShavingDate: string;
  resSegment?: number;
}
export interface IHBPeakingUserMonthReq {
  peakShavingMonth: string;
  resSegment?: number;
}
export type IHBPeakingUserReq = IHBPeakingUserDateReq | IHBPeakingUserMonthReq;

export interface IHBPeakingCustInfoItem {
  baseValImportFlag: number;
  basicValImportFlag: number;
  custId: number;
  custName: string;
}
export function getHBPeakingCustInfoList(params: IHBPeakingUserReq) {
  return energyRequest<IHBPeakingCustInfoItem[]>({
    url: '/peak-shaving/custInfo',
    method: 'GET',
    params,
  });
}
