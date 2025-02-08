import { APIRequest } from '@/utils/request';
export interface monthDateKey {
  queryMonth: string;
}
export function getHotMonthDataList(params: monthDateKey) {
  return APIRequest<any>({
    url: '/ai-chat/getHotPromptList',
    method: 'GET',
    params,
  });
}
export function getHotYearDataList() {
  return APIRequest<any>({
    url: '/ai-chat/getHotPromptYearList',
    method: 'GET',
  });
}
export interface monthHotKey {
  queryMonth: string;
  limit: number;
}
export function getHotMonthTypeList(params: monthHotKey) {
  return APIRequest<any>({
    url: '/ai-chat/getHotPromptType',
    method: 'GET',
    params,
  });
}
export function getHotYearTypeList() {
  return APIRequest<any>({
    url: '/ai-chat/getHotPromptTypeYear',
    method: 'GET',
  });
}
