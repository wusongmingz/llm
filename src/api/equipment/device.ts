import { imsRequest } from '@/utils/request';
import { IPageInfoParams } from '../type/base';

export interface IDevice {
  resourceId: number; //设备ID
  resourceCode: string; //设备编码
  resourceSpecId: number;
  billingType: number;
  createDate: string;
  activeDate: string; //投运时间
  brandId: number;
  userAddress: string; //设备地址
  provCode: number;
  regionCode: number;
  countyCode: number;
  readingLanguage: number;
  listeningLanguage: number;
  writingLanguage: number;
  emailLanguage: number;
  email: string; //厂家
  resClass: number; //设备大类
  resSegment: number; //设备类型
  isTest: number; //是否可检测
  isSendCard: number; //
  flhFlag: number; //是否可控
  continueFlag: number; //参与方式
  orgId: number;
  validDate: string;
  expireDate: string;
  remarks: string; //型号
  soNbr: number;
  soDate: string;
  tenantId: number;
  userName: string; //设备名称
  isVirtual: number; //是否参与
  prop1: string; //响应速度
  prop2: number; //额定电压(kV)
  prop3: number; //并网线路
  prop4: number; //并网电站
  prop5: number; // 最大调节步长（Kw）
  prop6: number; // 正常调节速率（kW/min）
  prop7: number; // 最大上升速率（kW/min）
  prop8: number; // 最大下降速率（kW/min）
  prop9: number; // 额定功率   -----chg3
  prop10: number; // 最大可调功率 ------ch
  prop11: string; // 资源编号   -----chg
  prop12: string; // 资源名称 ------chg3
  prop13: number; // 网关id ------chg3
  prop14: number; // 蓄热类型 ------chg3
  status: number; //设备状态
  custId: number; //客户id
  customerName: string;
  lng: number; //经度
  lat: number; //纬度
  resCap: number; //设备容量
  calPoint: string; //计算点位
  busiServices: string; //参与业务
  relPoints: string; //关联监测点
  osSts: number; //设备状态
}

export interface IDeviceListReq extends IPageInfoParams {
  custId?: number;
  userName?: string;
  resClass?: number;
  resSegment?: number;
  status?: number;
}

export interface partListReq {
  custId: number;
  busiServices?: string;
}

export interface partListRes {
  agreementId: number; //合同id
  agreementName: string; //合同名称
  agrType: number; //业务类型
  busiName: string; //业务名称
  relFlag: string; //1-已关联标志
}

export interface pointListReq {
  gateId: string;
  resourceId?: number;
}

export interface pointListRes {
  gateId: string;
  deviceId: number;
  pointId: string;
  pointValue: number;
  relFlag: number; //1-已关联标志
}

export function getDeviceList(params: IDeviceListReq) {
  return imsRequest<{
    total?: number;
    records?: IDevice[];
  }>({
    url: '/cd/resource/list',
    method: 'GET',
    params,
  });
}

export function getDeviceById(resourceId: number) {
  return imsRequest<IDevice>({
    url: '/cd/resource/detail',
    method: 'GET',
    params: { resourceId: resourceId },
  });
}

export function updateDevice(data: Partial<IDevice>, resourceId: number) {
  return imsRequest<undefined>({
    url: '/cd/resource/update/' + resourceId,
    method: 'POST',
    data,
  });
}

export function createDevice(data: Partial<IDevice>) {
  return imsRequest<undefined>({
    url: '/cd/resource/create',
    method: 'POST',
    data,
  });
}

export function checkGatewayServices(gateId: string) {
  return imsRequest<undefined>({
    url: '/cd/resource/checkGateway',
    method: 'GET',
    params: { gateId: gateId },
  });
}
export function gatewayPointList(params: pointListReq) {
  return imsRequest<pointListRes[]>({
    url: '/cd/resource/gatewayPointList',
    method: 'GET',
    params,
  });
}

export function getPartListServices(params: partListReq) {
  return imsRequest<partListRes[]>({
    url: '/cd/resource/partList',
    method: 'GET',
    params,
  });
}

export function getDeviceHeader() {
  return imsRequest<{
    onlineCount?: number;
    offlineCount?: number;
    refreshDate?: string;
    totalCount?: number;
  }>({
    url: '/cd/resource/stat',
    method: 'GET',
  });
}
