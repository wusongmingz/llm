import { energyRequest } from '@/utils/request';

export interface preweekpower {
  id: number;
  province: string;
  infoType: number;
  infoDate: string;
  infoTime: string;
  power: number;
  business: number;
  createdAt: string;
  updatedAt: string;
}
export function getPreweekPowerList(params: { startDate: string; endDate: string; province: string }) {
  return energyRequest<preweekpower[]>({
    url: '/tradeinfo/preweekpower',
    method: 'GET',
    params,
  });
}

export interface linkdetailexReq {
  startDate: string;
  endDate: string;
  infoType?: string;
  lineCode?: string;
  province?: string;
}
export interface linkdetailexRes {
  id: number;
  name: string;
  time: string;
  type: string;
  data: string;
  createdAt: string;
  updatedAt: string;
}
export function linkdetailexList(params: linkdetailexReq) {
  return energyRequest<linkdetailexRes[]>({
    url: '/tradeinfo/linkdetailex',
    method: 'GET',
    params,
  });
}

export interface premonthlineReq {
  infoDate: string;
  periodType?: string;
  lineCode?: string;
  province: string;
}
export interface premonthlineRes {
  id: number;
  province: string;
  periodType: number;
  lineCode: number;
  power: number;
  infoDate: string;
  infoTime: string;
  createdAt: string;
  updatedAt: string;
}
export function premonthlineList(params: premonthlineReq) {
  return energyRequest<premonthlineRes[]>({
    url: '/tradeinfo/premonthline',
    method: 'GET',
    params,
  });
}
