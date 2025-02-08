import { energyRequest } from '@/utils/request';

export interface historyPriceList {
  areaCode: number;
  beginDate: string;
  endDate: string;
}

export interface priceAndValListReq {
  forecastType: number;
  areaCode: number;
  custId: number;
  date: string;
}

export interface priceAndValListRes {
  dayaheadPrice: number;
  realPrice: number;
  electricVal: number;
  dayaheadPriceForecastModel: number;
  realPriceForecastModel: number;
}

export interface strategyAdjustReq {
  areaCode: number;
  custId: number;
  priceForecastModel: number;
  riskTypes: string;
  strategy: number;
  date: string;
}

export interface strategyAdjustRes {
  id: number;
  source: number;
  groupId: number;
  date: string;
  area: number;
  custId: number;
  riskType: number;
  priceForecastModel: number;
  strategyGroupId: number;
  infoTime: string;
  segment: number;
  forecastElectric: number;
  startElectric: number;
  endElectric: number;
  endCoefficient: number;
  price: number;
  createDt: string;
  createBy: number;
  updateDt: string;
  updateBy: number;
}

export interface backTestingListRes {
  id: number;
  source: number;
  strategyAdjustGroupId: number;
  date: string;
  area: number;
  custId: number;
  strategy: 1 | 2;
  priceForecastModel: 2 | 3 | 4;
  riskType: 1 | 2 | 3;
  strategyGroupId: number;
  rate: number;
  unitLoss: number;
  submit: number;
  approve: number;
  note: string;
  approveDt: string;
  createDt: string;
  createBy: number;
  updateDt: string;
  updateBy: number;
  areaName?: string;
  custName?: string;
}

export interface processRecordRes extends backTestingListRes {
  procInsId: string;
  processRecord: {
    id: number;
    flowId: string;
    procInsId: string;
    startUserId: number;
    status: number;
    approveUserId: number;
    approveResult: number;
    approveComment: string;
    startTime: string;
    endTime: string;
    startUserName: string;
  };
}

export interface strategyAdjustByGroupId {
  id: number;
  source: number;
  groupId: number;
  date: string;
  area: number;
  custId: number;
  riskType: number;
  priceForecastModel: number;
  strategyGroupId: number;
  infoTime: string;
  segment: number;
  forecastElectric: number;
  startElectric: number;
  endElectric: number;
  endCoefficient: number;
  price: number;
  createDt: string;
  createBy: number;
  updateDt: string;
  updateBy: number;
}

export interface itemList {
  id: number;
  endCoefficient: number;
  startElectric: number;
  endElectric: number;
  price: number;
}
export interface modifyStrategyAdjust {
  groupId: number;
  itemList: itemList[];
}

export interface lowestUnitLossStrategy {
  areaCode: number;
  date: string;
  riskType?: number;
}

export function getLowestUnitLossStrategy(params: lowestUnitLossStrategy) {
  return energyRequest({
    url: '/electric-spots/bid-strategy/lowestUnitLossStrategy',
    method: 'GET',
    params,
  });
}

export function exportByGroupId(strategyGroupId: number, date: string) {
  return energyRequest({
    url: '/electric-spots/bid-strategy/exportByGroupId?strategyGroupId=' + strategyGroupId + '&declareDate=' + date,
    method: 'GET',
    responseType: 'blob',
  });
}

export function getHistoryPriceList(params: historyPriceList) {
  return energyRequest<number[][]>({
    url: '/electric-spots/trade-imitate/historyPriceList',
    method: 'GET',
    params,
  });
}

export function getPriceAndValList(params: priceAndValListReq) {
  return energyRequest<priceAndValListRes[]>({
    url: '/electric-spots/trade-imitate/priceAndValList',
    method: 'GET',
    params,
  });
}

export function getStrategyAdjust(params: strategyAdjustReq) {
  return energyRequest<strategyAdjustRes[]>({
    url: '/electric-spots/trade-imitate/strategyAdjust',
    method: 'GET',
    params,
  });
}

export function getBackTestingList(params: strategyAdjustReq) {
  return energyRequest<processRecordRes[]>({
    url: '/electric-spots/trade-imitate/backTestingList',
    method: 'GET',
    params,
  });
}

export function getStrategyAdjustByGroupId(params: { strategyAdjustGroupId: number }) {
  return energyRequest<strategyAdjustByGroupId[]>({
    url: '/electric-spots/trade-imitate/strategyAdjustByGroupId',
    method: 'GET',
    params,
  });
}

export function getSubmit(params: { strategyEvaluationId: number }) {
  return energyRequest<undefined>({
    url: '/electric-spots/trade-imitate/submit',
    method: 'GET',
    params,
  });
}

export function getModifyStrategyAdjust(data: modifyStrategyAdjust) {
  return energyRequest<undefined>({
    url: '/electric-spots/trade-imitate/modifyStrategyAdjust',
    method: 'POST',
    data,
  });
}

export function getStrategyEvaluation(id: number) {
  return energyRequest<backTestingListRes>({
    url: '/electric-spots/trade-imitate/strategyEvaluation',
    method: 'GET',
    params: { id: id },
  });
}

export function updateStrategyEvaluation(data: { id: number; procInsId: string }) {
  return energyRequest<backTestingListRes>({
    url: '/electric-spots/trade-imitate/updateStrategyEvaluation',
    method: 'POST',
    data,
  });
}
