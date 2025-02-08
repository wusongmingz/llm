import { imsRequest } from '@/utils/request';
import { IPageInfoParams } from '../type/base';

export interface IUploadPointReq {
  stationId: string;
  gatewayId: number;
  deviceId: number;
}

export interface IPoint {
  id: number;
  name: string;
  description: string;
  gatewayId: number;
  pointType: number;
  pointCategory: number;
  alarmType: number;
  timeStamp: string | number;
  rtValue: number;
  unit: string;
  defaultValue: number;
  deadRange: string;
  deviceId: number;
  statisticsType: string;
  isAlarm: number;
  isBan: number;
  rangeL: number;
  rangeLl: number;
  rangeH: number;
  rangeHh: number;
  createdAt: string;
  updatedAt: string;
  showStatus: number;
  orgId: number;
  stationId: string;
  stationName: string;
  resourceName: string;
  resourceCode: string;
}

export interface IPointListReq extends IPageInfoParams {
  stationId?: string;
  resourceCode?: string;
}

export function getPointList(params: IPointListReq) {
  return imsRequest<{
    total?: number;
    records?: IPoint[];
  }>({
    url: '/cd/point/list',
    method: 'GET',
    params,
  });
}

export function updatePoint(data: Partial<IPoint>) {
  return imsRequest<undefined>({
    url: '/cd/point/update',
    method: 'POST',
    data,
  });
}
