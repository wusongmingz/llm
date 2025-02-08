import { energyRequest } from '@/utils/request';
import { energyRequest as request } from '@/utils/mockRequest';

export interface IClearPrice {
  dateTime: string;
  dayaheadPrice: number; //日前出清价格
  realtimePrice: number; //实时出清价格
  periodType: number;
  isMinRealtimePrice: boolean;
  isMaxRealtimePrice: boolean;
}

export function getClearingPriceList(params: { date: string }) {
  return energyRequest<IClearPrice[]>({
    url: '/electric-spots/clearing-price/list',
    method: 'GET',
    params,
  });
}

export interface IRealtimeElec {
  infoTime: string;
  actualElecValue1: number;
  actualElecValue2: number;
  actualElecValue3: number;
  midLongPrice: number;
}
export function getRealtimeElecList(params: { date: string }) {
  return request<IRealtimeElec[]>({
    url: '/xxxxxxx/list',
    method: 'GET',
    params,
  });
}

export interface TimeItemList {
  custId: number;
  itemList: ItemList[];
}

export interface ItemList {
  time: string;
  loadVal: number;
}

export function getRealtimeList(params: { date: string }) {
  return energyRequest<TimeItemList[]>({
    url: '/platform/actual-load/custLoadList',
    method: 'GET',
    params,
  });
}

export interface IproductionPlan {
  beginTime: string | undefined;
  endTime: string | undefined;
  totalProduceTime: number | undefined;
  durationProduceTime: number | undefined;
  produceElecVal: number | undefined;
  totalElecVal: number | undefined;
}

export function getProductionPlan() {
  return energyRequest<IproductionPlan>({
    url: '/largeScreen/siliconCarbide/productionPlan',
    method: 'GET',
  });
}
