import { energyRequest } from '@/utils/request';

export interface record {
  id: number;
  province: string;
  cookie: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export function getWarningRecord(params: { province: string; date: string }) {
  return energyRequest<record[]>({
    url: '/tradeinfo/warningrecord',
    method: 'GET',
    params,
  });
}
