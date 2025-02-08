import { marketRequest } from '@/utils/request';

export function getSupplyData(url: string, data: any) {
  return marketRequest<Record<string, any>[]>({
    url: url,
    method: 'POST',
    data,
  });
}
