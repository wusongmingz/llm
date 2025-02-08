import { flowableRequest } from '@/utils/request';

export interface list {
  id: number;
  name: string;
  type: number;
  content: string;
}

export function getFormList() {
  return flowableRequest<list[]>({
    url: '/process/form/list',
    method: 'GET',
  });
}

export function getFormDetail(id: string) {
  return flowableRequest<list>({
    url: '/process/form/info',
    method: 'GET',
    params: { id: id },
  });
}
