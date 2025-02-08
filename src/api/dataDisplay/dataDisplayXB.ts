import { energyRequest } from '@/utils/request';

export interface IProvInfoList {
  provName: string; //省份
  custCount: number; //客户数
}

export interface ICustClassInfoList {
  custClass: number;
  custClassName: string; //客户类型
  custCount: number; //客户数
}

export interface ICustInfoList {
  custId: number;
  custName: string; //客户名称
  longitude: string; //经纬度
  latitude: string; //
}

export interface ILargeScreenDetail {
  custCount: number; //调峰企业总数
  elecConsumeScale: number; //总年用电规模，
  peakShavingElecVal: number; //本年累计调峰电量
  provInfoList: IProvInfoList[];
  custClassInfoList: ICustClassInfoList[];
  custInfoList: ICustInfoList[];
}

export function getLargeScreenDetail() {
  return energyRequest<ILargeScreenDetail>({
    url: '/largeScreen/northwest/detail',
    method: 'GET',
  });
}

export function getRealtimeLoad() {
  return energyRequest<number>({
    url: '/largeScreen/northwest/realtimeLoad',
    method: 'GET',
  });
}

export function getPeakShavingCapacity() {
  return energyRequest<number>({
    url: '/largeScreen/northwest/peakShavingCapacity',
    method: 'GET',
  });
}

export function getElecOnlineList() {
  return energyRequest<{ id: number; date: string; elecVal: number }[]>({
    url: '/largeScreen/northwest/elecOnlineList',
    method: 'GET',
  });
}

export function getMarketPriceList(params: { type: number; beginDate: string; endDate: string }) {
  return energyRequest<
    {
      time: string;
      dayaheadMarketPrice: number;
      realtimeMarketPrice: number;
      realtimeMarketFitPrice: number;
      dayaheadForecastPrice: number;
      realtimeForecastPrice: number;
    }[]
  >({
    url: '/largeScreen/northwest/marketPriceList',
    method: 'GET',
    params,
  });
}

export interface IItemList {
  provName: string;
  elecVal: number;
}

export function getElecValByProv() {
  return energyRequest<{ provName: string; month: string; itemList: IItemList[] }[]>({
    url: '/largeScreen/northwest/elecValByProv',
    method: 'GET',
  });
}

export function getElecValBySupportProv() {
  return energyRequest<{ provName: string; month: string; itemList: IItemList[] }[]>({
    url: '/largeScreen/northwest/elecValBySupportProv',
    method: 'GET',
  });
}

export interface IPeakShavingVal {
  provName: string;
  appraiseElectricityVal: number;
}

export function getPeakShavingVal() {
  return energyRequest<{ month: string; itemList: IPeakShavingVal[] }[]>({
    url: '/largeScreen/northwest/peakShavingVal',
    method: 'GET',
  });
}

export function getCustPeakShaving() {
  return energyRequest<{ provName: string; custName: string; peakShavingElecVal: number; actualElecVal: number }[]>({
    url: '/largeScreen/northwest/custPeakShaving',
    method: 'GET',
  });
}
