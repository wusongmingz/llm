import { APIRequest } from '@/utils/request';

//获取apikey
export function userGuide() {
  return APIRequest<any>({
    url: '/doc/userGuide',
    method: 'GET',
  });
}

//获取apikey
export function userGuide1() {
  return APIRequest<any>({
    url: '/doc/userPolicy',
    method: 'GET',
  });
}
