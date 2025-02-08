import { energyRequest } from '@/utils/request';

export interface assistEvaluate {
  areaCode: number;
  beginDate: string;
  endDate: string;
  priceForecastModel?: number;
  strategy?: number;
  riskType?: number;
  // type?: number;
  curveType?: number;
}

export interface strategyAnalysisList {
  id: number;
  date: string;
  area: number;
  priceForecastModel: number;
  dayaheadMae: number;
  intradayMae: number;
  rate: number;
  createDt: string;
  updateDt: number;
}

export interface dayaheadStrategyAnalysisList {
  date: string;
  strategy: 1 | 2;
  priceForecastModel: 2 | 3 | 4;
  riskType: 1 | 2 | 3;
  unitLoss: number;
  godUnitLoss: number;
}

export interface forecastDiffList {
  dateTime: string;
  dayaheadForecastPrice: number;
  realtimeForecastPrice: number;
  dayaheadRealPrice: number;
  realtimeRealPrice: number;
  bidPrice: number;
  bidElectric: number;
  segment1Price: number;
  segment5Price: number;
  curveElectric: number;
  isStrategyWin: number;
  exactPriceDiff: number;
  strategyWinValue?: number;
}

export function getStrategyAnalysisList(params: assistEvaluate) {
  return energyRequest<strategyAnalysisList[]>({
    url: '/electric-spots/assist-evaluate/priceForecastEvaluationList',
    method: 'GET',
    params,
  });
}

export function getDayaheadStrategyAnalysisList(params: assistEvaluate) {
  return energyRequest<dayaheadStrategyAnalysisList[]>({
    url: '/electric-spots/assist-evaluate/dayaheadStrategyAnalysisList',
    method: 'GET',
    params,
  });
}

export function getForecastDiffList(params: assistEvaluate) {
  return energyRequest<forecastDiffList[]>({
    url: '/electric-spots/assist-evaluate/forecastDiff',
    method: 'GET',
    params,
  });
}
