import { energyRequest } from '@/utils/request';

export interface midlong {
  month: string;
  label: string;
  statType: string;
  yearQuantity: number;
  yearPrice: number;
  monthQuantity: number;
  monthPrice: number;
  weekQuantity: number;
  weekPrice: number;
  dailyQuantity: number;
  dailyPrice: number;
}

export function getMidlongList(params: { custName: string; paramType: number; months: string }) {
  return energyRequest<midlong[]>({
    url: '/review-analysis/midlong/list',
    method: 'GET',
    params,
  });
}

export function getListByState(params: { custName: string; paramType: number; months: string; stateType: number }) {
  return energyRequest<midlong[]>({
    url: '/review-analysis/midlong/listByState',
    method: 'GET',
    params,
  });
}
