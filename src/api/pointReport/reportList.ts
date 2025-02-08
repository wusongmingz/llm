import { energyRequest } from '@/utils/request';

export interface IPointReportListReq {
  pageNo: number;
  pageSize: number;
  custId?: number;
  deviceId?: number;
}
export interface IPointReport {
  custId: number;
  custName: string;
  deviceId: number;
  deviceName: string;
  expireDate: string;
  gatewayId: string;
  id: number;
  respLoad: number;
  seeId: string;
  status: number;
  userId: string;
  validDate: string;
}

export function getPointReportList(params: IPointReportListReq) {
  return energyRequest<{
    total?: number;
    records?: IPointReport[];
  }>({
    url: '/syncData/list',
    method: 'GET',
    params,
  });
}

export interface IReportSheet {
  id: number;
  pointId: number;
  relId: number;
  seeId: string;
  type: string;
  typeName: string;
  unit: string;
}
export function getReportSheetForEdit(deviceId: number) {
  return energyRequest<IReportSheet[]>({
    url: '/syncData/detail4Edit',
    method: 'GET',
    params: { deviceId },
  });
}

export function getReportSheetForInit(deviceId: number) {
  return energyRequest<IReportSheet[]>({
    url: '/syncData/detailInit',
    method: 'GET',
    params: { deviceId },
  });
}

export interface IPointSheetCreateReq {
  custId: number; // 用户ID
  deviceId: number; // 设备ID
  userId: string;
  seeId: string; // 户号
  foreignId: string;
  status: number; // 启用上报
  gatewayId: string; // 网关ID
  validDate: string; // 生效时间
  expireDate: string; // 过期时间
  detailList: {
    type: string;
    pointId: number;
  }[];
}

export function createReportSheet(data: IPointSheetCreateReq) {
  return energyRequest<undefined>({
    url: '/syncData/create',
    method: 'POST',
    data,
  });
}

export interface IPointSheetUpdateReq extends IPointSheetCreateReq {
  id: number;
  detailList: {
    id: number;
    type: string;
    pointId: number;
  }[];
}

export function updateReportSheet(data: IPointSheetUpdateReq) {
  return energyRequest<undefined>({
    url: '/syncData/update',
    method: 'POST',
    data,
  });
}

export function uploadReportFile(data: FormData) {
  return energyRequest<undefined>({
    url: '/syncData/importExcel',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data,
  });
}
