import { energyRequest } from '@/utils/request';

export interface IDayAheadStrategyReq {
  startDate: string;
  endDate: string;
  area: 1 | 2;
}

export interface IDayAheadStrategy {
  aidayahead: IMarketPriceDetail[];
  airealtime: IMarketPriceDetail[];
  dayahead: IMarketPriceDetail[];
  realtime: IMarketPriceDetail[];
  strategy: IMarketStrategy[];
  strategybid: IMarketStrategybid[];
  strategyprofit: IMarketStrategyProfit[];
}

export interface IMarketPriceDetail {
  area: number;
  channel: number;
  infoDate: string;
  infoTime: string;
  infoType: number;
  province: string;
  value: string;
}

export interface IMarketStrategy {
  area: number;
  createdAt: string;
  endCoefficient: number;
  infoDate: string;
  infoTime: string;
  price: number;
  province: string;
  segment: number;
  startCoefficient: number;
}

export interface IMarketStrategybid {
  province: string;
  area: number;
  infoDate: string;
  infoTime: string;
  ajCount?: number;
  lmdCount?: number;
  clearCount?: number;
}

export interface IMarketStrategyProfit {
  infoDate: string;
  infoTime: string;
  profit1?: -1 | 0 | 1 | 2 | 3;
  profit2?: -1 | 0 | 1 | 2 | 3;
  priceVariance?: number;
}

export function getDayAheadStrategy(params: IDayAheadStrategyReq) {
  return energyRequest<IDayAheadStrategy>({
    url: '/tradeinfo/pricestrategy',
    method: 'GET',
    params,
  });
}

export function getDayAheadStrategyValue(params: IDayAheadStrategyReq) {
  return energyRequest<{
    strategybid: { ajCount?: number };
    strategyloss: { ajLoss?: number };
  }>({
    url: '/tradeinfo/strategyvalue',
    method: 'GET',
    params,
  });
}
