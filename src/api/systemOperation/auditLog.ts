import { baseRequest } from '@/utils/request';
import { IPageInfoParams } from '../type/base';

export interface IAuditLog {
  executeTime: number;
  httpCode: number;
  loginName: string;
  method: string;
  operateResult: string;
  operateType: string;
  requestContentType: string;
  requestTime: string;
  schema: string;
  sourceIp: string;
  systemName: string;
  uriPath: string;
}
export interface IGetAuditLogReq extends IPageInfoParams {
  beginDate: string;
  endDate: string;
}

export function getAuditLogList(params: IGetAuditLogReq) {
  return baseRequest<{ records: IAuditLog[]; total: number }>({
    url: '/audit-log/page',
    method: 'GET',
    params,
  });
}
