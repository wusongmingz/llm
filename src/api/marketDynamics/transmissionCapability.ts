import { energyRequest } from '@/utils/request';

export interface IMaintenancePlan {
  powerPlantName: string;
  unitName: string;
  startDate: string;
  endDate: string;
  serviceType: string;
}
export function getMaintenancePlanList(params: { date: string }) {
  return energyRequest<IMaintenancePlan[]>({
    url: '/tradeinfo/maintenanceplan',
    method: 'GET',
    params,
  });
}

export interface ISectionBlock {
  infoType: number;
  infoDate: string;
  infoTime: string;
  power: number;
  sectionName: string;
  blockingType: string;
}
export function getSectionBlockList(params: { startDate: string; endDate: string }) {
  return energyRequest<ISectionBlock[]>({
    url: '/tradeinfo/sectionblockinfo',
    method: 'GET',
    params,
  });
}

export interface ITransmissionCapability {
  channelName: string;
  sectionName: string;
  power: string;
  infoDate: string;
  infoTime: string;
}
export function getTransmissionCapabilityList(params: { startDate: string; endDate: string; channelName: string }) {
  return energyRequest<ITransmissionCapability[]>({
    url: '/tradeinfo/keysectiontrans',
    method: 'GET',
    params,
  });
}
