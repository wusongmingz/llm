import { imsRequest } from '@/utils/request';
import { IPageInfoParams } from '../type/base';

export interface IGateway {
  id: number;
  sn: string; //网关sn
  stationName: string; //网关名称
  stationId: string; //网关id
  topicDataSub: string; //
  topicCmdSub: string;
  description: string; //网关描述
  companyId: number;
  gatewayStatus: number; //网关状态
  penetrateStatus: number;
  lockStatus: number;
  card: string;
  version: string;
  accountId: number;
  longitude: number;
  latitude: number;
  compress: number;
  encryptType: number;
  comProtocol: number;
  gatewayIp: number; //网关ip
  createdAt: string; //创建时间
  showStatus: number;
  updatedAt: string; //修改时间
  comType: number;
  configVersion: string;
  orgId: number;
  customerName: string; //企业名称
}

export interface IGatewayListReq extends IPageInfoParams {
  customerName?: string;
  stationId?: string;
  stationName?: string;
}

export function getGatewayList(params: IGatewayListReq) {
  return imsRequest<{
    total?: number;
    records?: IGateway[];
  }>({
    url: '/cd/gateway/list',
    method: 'GET',
    params,
  });
}

export function getGatewayRefresh() {
  return imsRequest<undefined>({
    url: '/cd/gateway/refresh',
    method: 'GET',
  });
}

export function updateGateway(data: Partial<IGateway>) {
  return imsRequest<undefined>({
    url: '/cd/gateway/update',
    method: 'POST',
    data,
  });
}

export function getGatewayHeader() {
  return imsRequest<{
    onlineCount?: number;
    offlineCount?: number;
    refreshDate?: string;
    totalCount?: number;
  }>({
    url: '/cd/gateway/stat',
    method: 'GET',
  });
}
