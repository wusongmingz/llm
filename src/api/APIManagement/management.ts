import { APIRequest } from '@/utils/request';
//后台接口查有数据很慢，查无数据很快，防止数据覆盖手动取消
import axios from 'axios';
const { CancelToken } = axios;
// eslint-disable-next-line @typescript-eslint/no-empty-function
let cancel = () => {};

export interface addKey {
  userId: string;
  tokenQuota: number;
  keyName: string;
  apiKey?: string;
}
export function addKey(data: addKey) {
  return APIRequest<any>({
    url: '/ai-apiKey/createKey',
    method: 'POST',
    data,
  });
}

export function editKey(data: addKey) {
  return APIRequest<any>({
    url: '/ai-apiKey/updateKey',
    method: 'POST',
    data,
  });
}

export function getKeyList(userId: string) {
  return APIRequest<any>({
    url: '/ai-apiKey/getKey',
    method: 'GET',
    params: { userId },
  });
}

export function deleteKey(params: any) {
  return APIRequest<any>({
    url: '/ai-apiKey/deleteKey',
    method: 'POST',
    params,
  });
}

// export interface keyReq {
//   pageNum: number;
//   pageSize: number;
//   apiKey: string;
// }

// export function getKeyDetail(params: keyReq) {
//   return APIRequest<any>({
//     url: '/api-key-log/getlog',
//     method: 'GET',
//     params,
//   });
// }

export function getKeyDetail(params: any) {
  return APIRequest<any>({
    url: '/api-key-log/getlogList',
    // url: '/api-key-log/getlog',
    method: 'GET',
    params,
    cancelToken: new CancelToken((cancelFn) => {
      cancel && cancel();
      cancel = cancelFn;
    }),
  });
}
