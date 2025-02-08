import { energyRequest } from '@/utils/request';

export interface linkdetail {
  createTime: string;
  data: string;
  id: number;
  name: string;
  time: string;
  type: string;
  updateTime: string;
}

export interface predaypowner {
  id: number;
  time: string;
  name: string;
  data: string;
}

export interface realpowner {
  data: string;
  id: number;
  name: string;
  time: string;
}

export function getPredayPowner(params: { date: string; province: string }) {
  return energyRequest<predaypowner[]>({
    url: '/tradeinfo/predaypowner',
    method: 'GET',
    params,
  });
}

export function getrealpowner(params: { date: string; province: string }) {
  return energyRequest<realpowner[]>({
    url: '/tradeinfo/realpowner',
    method: 'GET',
    params,
  });
}

export function getLinkdetail(date: string) {
  return energyRequest<linkdetail[]>({
    url: '/tradeinfo/linkdetail',
    method: 'GET',
    params: { date: date },
  });
}
