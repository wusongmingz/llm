import { energyRequest } from '@/utils/request';

export interface ICurveType {
  id: number;
  category: number;
  type: number;
  time: number;
  periodType: number;
  val: number;
}

export function getCurveTypeList(params: { category: number; type: number }) {
  return energyRequest<ICurveType[]>({
    url: '/electric-spots/curve-valuation/curveTypeList',
    method: 'GET',
    params,
  });
}

export interface IUnitLoss {
  strategy: number;
  priceForecastModel: number;
  riskType: number;
  unitLoss: number;
}
export function getUnitLossList(params: { curveType: number; areaCode: number; beginDate: string; endDate: string }) {
  return energyRequest<IUnitLoss[]>({
    url: '/electric-spots/curve-valuation/unitLossList',
    method: 'GET',
    params,
  });
}
