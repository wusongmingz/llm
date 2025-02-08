import { energyRequest } from '@/utils/request';

export function getActualElectricList(params: { custName: string; months: string }) {
  return energyRequest<{ month: string; list: { date: string; electricVal: number }[] }[]>({
    url: '/review-analysis/daily/actualElectric',
    method: 'GET',
    params,
  });
}

export function importForecastElectric(data: FormData) {
  return energyRequest<{
    month: string;
    custName: string;
  }>({
    url: '/review-analysis/daily/importForecastElectric',
    method: 'POST',
    data,
  });
}

export function getForecastElectricList(params: { custName: string; months: string }) {
  return energyRequest<{ month: string; list: { date: string; electricVal: number }[] }[]>({
    url: '/review-analysis/daily/forecastElectric',
    method: 'GET',
    params,
  });
}

export function getActualElectricTimeList(params: { custName: string; months: string }) {
  return energyRequest<{ month: string; list: { date: string; items: { time: string; electricVal: number }[] }[] }[]>({
    url: '/review-analysis/daily/actualElectricTime24',
    method: 'GET',
    params,
  });
}

export interface IMidlongAnalysis {
  custName: string;
  month: string;
  statType: string;
  midlongElec: number; //中长期结算电量(MWh)
  clearingElec: number; //日前出清电量(MWh)
  dayAheadMarketPrice?: number; //日前市场价格(元/MWh)
  dayAheadMarketPriceSum: number;
  dayAheadMarketPriceCount: number;
  actualPowerConsumption: number; //实际用电量
  midlongPrice?: number; // 中长期电价(元/MWh)
  midlongPositionRation?: number; //中长期持仓比例
  midlongLoss: number; //中长期损益(元)
  midlongUnitLoss?: number; //中长期单位损益(元/MWh)
  midlongCost: number; // 全电量中长期电费(元)
  midlongSource?: number;
  midlongQuantity?: number;
  midlongFee?: number;
}
export function getMidlongAnalysisList(params: { custName: string; months: string; stateType: number }) {
  return energyRequest<{ month: string; list: IMidlongAnalysis[] }[]>({
    url: '/review-analysis/daily/midlongAnalysis',
    method: 'GET',
    params,
  });
}

export interface IDayAheadAnalysis {
  month: string;
  actualPowerConsumption: number; //实际电量
  dayAheadClearingElec: number; // 日期出清电量
  dayAheadForecastElec: number; //日前预测电量
  dayAheadLoss: number; // 日前损益
  dayAheadUnitLoss: number; // 日前单位损益
  forecastLoss: number; // 预测套利损益
  strategyLoss: number; // 策略套利损益
  winDays: number; // 盈利天数
  lossDays: number; // 亏损天数
  winMax: number; // 盈利最大值
  lossMax: number; // 亏损最大值
  winMaxDate: string;
  lossMaxDate: string;

  strategy?: number; // 带策略信息的是策略的
  priceForecastModel?: number;
  riskType?: number;
}
export function getDayAheadAnalysisList(params: {
  custName: string;
  months: string;
  strategy: number;
  priceForecastModel: number;
  riskType: number;
  areaCode: number;
}) {
  return energyRequest<{ month: string; list: IDayAheadAnalysis[] }[]>({
    url: '/review-analysis/daily/dayAheadAnalysis',
    method: 'GET',
    params,
  });
}

export function getUnitLossList(params: { custName: string; months: string }) {
  return energyRequest<{ month: string; list: { unitLoss: number; date: string }[] }[]>({
    url: '/review-analysis/daily/unitLoss',
    method: 'GET',
    params,
  });
}

export function getUnitLossStrategyList(params: {
  custName: string;
  months: string;
  strategy: number;
  priceForecastModel: number;
  riskType: number;
  areaCode: number;
}) {
  return energyRequest<{ month: string; list: { unitLoss: number; date: string }[] }[]>({
    url: '/review-analysis/daily/unitLoss4Strategy',
    method: 'GET',
    params,
  });
}

export function getCoefficientCountList(params: { custName: string; months: string }) {
  return energyRequest<{ coefficient: number; count: number }[]>({
    url: '/review-analysis/daily/coefficientCount',
    method: 'GET',
    params,
  });
}

export function getCoefficientCountStrategyList(params: {
  custName: string;
  months: string;
  strategy: number;
  priceForecastModel: number;
  riskType: number;
  areaCode: number;
}) {
  return energyRequest<{ coefficient: number; count: number }[]>({
    url: '/review-analysis/daily/coefficientCount4Strategy',
    method: 'GET',
    params,
  });
}

export interface IIncomeComparison {
  month: string;
  dayAheadSettleElec: number; //日前结算电量
  midlongCost: number; // 中长期电费
  dayAheadSettleCost: number;
  actualSettleCost: number; // 实时结算电费
  tradeSettleCost: number; // 交易结算电费
  actualSettleElec: number; //实时结算电量
  tradeAvgPrice: number; //交易均价
  strategy?: number; //带策略信息的是策略的数据
  priceForecastModel?: number;
  riskType?: number;
}
export function getIncomeComparisonList(params: {
  custName: string;
  months: string;
  strategy: number;
  priceForecastModel: number;
  riskType: number;
  areaCode: number;
}) {
  return energyRequest<{ month: string; list: IIncomeComparison[] }[]>({
    url: '/review-analysis/daily/incomeComparison',
    method: 'GET',
    params,
  });
}

export function upsertMidlongPrice(data: { custId: number; custName: string; itemList: { month: string; price: number }[] }) {
  return energyRequest<void>({
    url: '/review-analysis/daily/upsertMidlongPrice',
    method: 'POST',
    data,
  });
}
