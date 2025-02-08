import { IFileResponse, energyRequest } from '@/utils/request';

export interface IHBPeakingClearListReq {
  startDate: string;
  endDate: string;
  resSegment?: number;
  pr?: 0 | 1;
  clearingCategory: number;
}

export interface IHBPeakingClearInfo {
  aggregatorOrgId: number;
  clearingCategory: number;
  createTime: string;
  groupNumber: number;
  id: number;
  peakShavingDate: string;
  peakShavingType: number;
  remoteId: string;
  remoteName: string;
  resSegment: number;
  updateTime: string;
}

export interface IHBPeakingClearItem {
  avgrtVal: number;
  bldVal: number;
  clearingInfoId: number;
  clearingTime: string;
  cpVal: number;
  dapVal: number;
  feeVal: number;
  id: number;
  prVal: number;
}

export function getHBPeakingClearList(params: IHBPeakingClearListReq) {
  return energyRequest<
    {
      infoDO?: IHBPeakingClearInfo;
      itemList?: IHBPeakingClearItem[];
      resSegmentName?: string;
    }[]
  >({
    url: '/peak-shaving-clearing/north-china/queryItemList',
    method: 'GET',
    params,
  });
}

export function exportHBPeakingClear(params: IHBPeakingClearListReq) {
  return energyRequest<IFileResponse>({
    url: '/peak-shaving-clearing/north-china/exportItemList',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}

export function updateHBPeakingClearPrVal(data: { itemId: number; prVal: number }) {
  return energyRequest<boolean>({
    url: '/peak-shaving-clearing/north-china/updateItem',
    method: 'POST',
    data,
  });
}

export interface IHBPeakingIncomeListReq {
  peakShavingMonth: string;
  resSegment?: number;
  custId?: number;
}
export interface IHBPeakingIncomeItem {
  actualVal: number;
  aggregatorActualVal: number;
  aggregatorAppraiseIncome: number;
  aggregatorBaseVal: number;
  appraiseIncome: number;
  avgrtVal: number | number;
  baseVal: number;
  clearingPrice: number;
  custAppraiseIncome: number;
  custName: string;
  dateTime: string;
  declareVal: number;
  deviation: number;
  income: number;
  isClearing: number;
  peakShavingVal: number;
  resSegmentName: string;
  shareRatio: number;
}
export function getHBPeakingIncomeList(params: IHBPeakingIncomeListReq) {
  return energyRequest<IHBPeakingIncomeItem[]>({
    url: '/peak-shaving/north-china/foreastIncome',
    method: 'GET',
    params,
  });
}

export function exportHBPeakingIncome(params: IHBPeakingIncomeListReq) {
  return energyRequest<IFileResponse>({
    url: '/peak-shaving/north-china/exportForeastIncome',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}
