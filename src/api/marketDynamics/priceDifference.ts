import { energyRequest } from '@/utils/request';

export interface IPriceVariance {
  infoDate: string;
  infoTime: string;
  priceVariance: number;
}

export function getPriceVarianceTrends(data: { dates: string[]; area: number }) {
  return energyRequest<IPriceVariance[]>({
    url: '/tradeinfo/priceVarianceTrends',
    method: 'POST',
    data,
  });
}

export function getPriceVariancePerformance(params: { startDate: string; endDate: string; area: number }) {
  return energyRequest<IPriceVariance[]>({
    url: '/tradeinfo/priceVariance',
    method: 'GET',
    params,
  });
}

export function getPriceVariancePerformanceNode(data: { startDate: string; endDate: string; devices: string[] }) {
  return energyRequest<IPriceVariance[]>({
    url: '/tradeinfo/priceVarianceNode',
    method: 'POST',
    data,
  });
}

export interface IPriceVarianceReasons {
  bidDayaheadSubReal: number;
  blockDayahead: number;
  blockRealtime: number;
  deliveryDayaheadSubReal: number;
  eastDayaheadSubRealtime: number;
  infoTime: string;
  lightEnergyRealSubDayahead: number;
  loadDayaheadSubReal: number;
  newEnergyRealSubDayahead: number;
  waterEnergyRealSubDayahead: number;
  westDayaheadSubRealtime: number;
  windEnergyRealSubDayahead: number;
}
export function getPriceVarianceReasons(data: { dates: string[] }) {
  return energyRequest<IPriceVarianceReasons[]>({
    url: '/tradeinfo/priceVarianceReasons',
    method: 'POST',
    data,
  });
}
