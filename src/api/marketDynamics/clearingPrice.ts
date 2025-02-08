import { energyRequest } from '@/utils/request';

export function getDeviceList() {
  return energyRequest<string[]>({
    url: '/tradeinfo/devicelist',
    method: 'GET',
  });
}

interface IClearingPrice {
  area: string;
  createTime: string;
  data: string;
  id: number;
  name: string;
  time: string;
  updateTime: string;
}

export function getClearingPrice(params: { date: string; province?: string }) {
  return energyRequest<IClearingPrice[]>({
    url: '/tradeinfo/outprice',
    method: 'GET',
    params,
  });
}

export interface IRealtimeNode {
  createTime: null | string;
  data: string;
  device: null | string;
  id: number;
  name: string;
  time: string;
  type: number;
  updateTime: null | string;
}
export function getRealtimeNode(params: { date: string; device: string }) {
  return energyRequest<IRealtimeNode[]>({
    url: '/tradeinfo/realdeviceinfo',
    method: 'GET',
    params,
  });
}

export interface IDayAheadNode {
  createTime: null | string;
  data: string;
  device: null | string;
  id: number;
  name: string;
  time: string;
  type: number;
  updateTime: null | string;
}
export function getDayAheadNode(params: { date: string; device: string }) {
  return energyRequest<IDayAheadNode[]>({
    url: '/tradeinfo/predaydeviceinfo',
    method: 'GET',
    params,
  });
}

export interface IRegionalPrice {
  createTime: string;
  infoDate: string;
  infoTime: string;

  eastPriceAheadForecast?: number;
  eastPriceRealtimeForecast?: number;
  eastPriceAheadAIForecast?: number;
  eastPriceRealtimeAIForecast?: number;
  eastPriceAheadTridentForecast?: number;
  eastPriceRealtimeTridentForecast?: number; //东区trident实时预测
  eastPriceAhead?: number;
  eastPriceRealtime?: number;

  westPriceAheadForecast?: number;
  westPriceRealtimeForecast?: number;
  westPriceAheadAIForecast?: number;
  westPriceRealtimeAIForecast?: number;
  westPriceAheadTridentForecast?: number;
  westPriceRealtimeTridentForecast?: number; //西区trident实时预测
  westPriceAhead?: number;
  westPriceRealtime?: number;

  oncePriceAheadForecast?: number;
  oncePriceRealtimeForecast?: number;
  oncePriceAheadAIForecast?: number; //一次日前价格预测
  oncePriceRealtimeAIForecast?: number; //实时出清价格预测
  oncePriceAheadTridentForecast?: number;
  oncePriceRealtimeTridentForecast?: number; //实时日前价格预测trident
  oncePriceAhead?: number; //一次日前价格
  oncePriceRealtime?: number; //实时出清价格

  twicePriceAhead?: number; //二次日前价格
}

export function getRegionalPrice(params: { date: string; pointCount: number }) {
  return energyRequest<IRegionalPrice[]>({
    url: '/tradeinfo/priceforecast',
    method: 'GET',
    params,
  });
}
