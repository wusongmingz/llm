import { energyRequest } from '@/utils/request';
import { IPeakShavingNXReqBase } from './common';

export interface IClearingDetail {
  info: IClearingDetailInfo;
  itemList: IClearingDetailItem[];
}

export interface IClearingDetailInfo {
  createTime: string;
  updateTime: string;
  id: number;
  aggregatorOrgId: number;
  peakShavingDate: string;
  beginTime: string; //调控开始时间
  endTime: string; //调控结束时间
  clearingVal: number;
  declareStartTime: string;
  voidanceReleaseTime: string; //交易出清时间
  vppId: string;
  eventCode: string; //出清编号
  eventId: string;
  eventName: string;
  marketType: number;
  tradeType: number;
  custShareFlag: number;
  custShareTime: string;
}

export interface IClearingDetailItem {
  id: number;
  clearingInfoId: number;
  clearingTime: string; //时间点
  clearingVal: number; //中标负荷
  clearingPrice: number; //出清电价
}

export function getClearingDetail(params: IPeakShavingNXReqBase) {
  return energyRequest<IClearingDetail>({
    url: '/ningxia-peak-shaving/clearing/details',
    params,
  });
}

export interface IClearingShare {
  id: number;
  aggregatorOrgId: number;
  peakShavingDate: string;
  marketType: number;
  tradeType: number;
  clearingInfoId: number;
  custId: number;
  custNumber: string;
  shareTime: string;
  declareVal: number; //计划负荷
  baseVal: number; //基线负荷
  shareClearingVal: number; //分摊出清量
  custName: string; //企业名称
}

export function getClearingShareList(params: IPeakShavingNXReqBase) {
  return energyRequest<IClearingShare[]>({
    url: '/ningxia-peak-shaving/clearing/shareList',
    params,
  });
}

export interface IClearingShareItem {
  id: number;
  clearingShareId: number;
  clearingTime: string; //时间点
  clearingVal: number; //出清总量
  clearingPrice: number;
  declareVal: number; //计划负荷
  baseVal: number; //基线负荷
  peakShavingVal: number; //计划调节量
  totalPeakShavingVal: number; //总计划调节量
  proportion: number; //计划调节量占比
  shareClearingVal: number; //分摊出清量
}
export function getClearingShareItem(params: { shareId: number }) {
  return energyRequest<IClearingShareItem[]>({
    url: '/ningxia-peak-shaving/clearing/shareItemList',
    params,
  });
}
