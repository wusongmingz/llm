import { energyRequest } from '@/utils/request';

export interface record {
  id: number;
  province: string;
  cookie: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export function getLmdRecord(params: { province: string }) {
  return energyRequest<record[]>({
    url: '/tradeinfo/sessionStatus',
    method: 'GET',
    params,
  });
}

export function getLmdToken(params: { province: string; token: string }) {
  return energyRequest<undefined>({
    url: '/tradeinfo/lmdToken',
    method: 'GET',
    params,
  });
}
