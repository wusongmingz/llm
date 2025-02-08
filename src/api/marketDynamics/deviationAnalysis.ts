import { energyRequest } from '@/utils/request';

export interface IDeviationAnalysisStatisticsReq {
  startDate: string;
  endDate: string;
  area: number;
}
export interface IDeviationAnalysisStatistics {
  id: number;
  infoDate: string; // 业务类型
  dayaheadVariance: number; // AI预测日前电价偏差率
  realtimeVariance: number; // AI预测实时电价偏差率
  priceDiffVariance: number; // AI预测价差偏差率
  ajStrategyOdds: number; // AJ策略赔率
  aiStrategyVariance: number; // AI预测偏差_策略偏差
  reviewStrategyOdds: number; // 复盘策略赔率
  reviewStrategyVariance: number; // AI预测偏差_复盘策略偏差
}
export function getDeviationAnalysisStatistics(params: IDeviationAnalysisStatisticsReq) {
  return energyRequest<IDeviationAnalysisStatistics[]>({
    url: '/tradeinfo/varianceanalysisstatistics',
    method: 'GET',
    params,
  });
}

export interface IDeviationAnalysisDetailReq {
  date: string;
  area: number;
}
export interface IDeviationAnalysisDetail {
  id: number;
  infoDate: string;
  infoTime: string;
  aiDayaheadPrice: number;
  aiPriceDiff: number;
  aiRealtimePrice: number;
  aiReviewStrategyProfit: number;
  aiVarianceDirect: number;
  aiVarianceProfit: number;
  ajStrategyProfit: number;
  dayaheadVariance: number;
  realDayaheadPrice: number;
  realPriceDiff: number;
  realRealtimePrice: number;
  realtimeVariance: number;
  reviewStrategyProfit: number;
  createdAt: string;
  updatedAt: string;
}
export function getDeviationAnalysisDetail(params: IDeviationAnalysisDetailReq) {
  return energyRequest<IDeviationAnalysisDetail[]>({
    url: '/tradeinfo/varianceanalysisdetail',
    method: 'GET',
    params,
  });
}
