import { imsRequest } from '@/utils/mockRequest';
import { energyRequest } from '@/utils/request';

export interface IChannelSeller {
  userId: number;
  name: string;
  loginName: string;
  orgId: number;
  phone: string;
  countyCode: number;
  provCode: number;
  regionCode: number;
  deptId: number;
}

export function getChannelSellerList() {
  return imsRequest<IChannelSeller[]>({
    url: '/sysUser/channelSellers',
    method: 'GET',
  });
}

export interface IMarketManager {
  userId: number;
  name: string;
  loginName: string;
  orgId: number;
  phone: string;
  countyCode: number;
  provCode: number;
  regionCode: number;
  deptId: number;
}

export function getMarketManagerList() {
  return imsRequest<IMarketManager[]>({
    url: '/sysUser/marketManagers',
    method: 'GET',
  });
}

export interface ICustomer {
  custId: number;
  custName: string;
  provCode: number;
  provName: string;
}

export function getCustomerList() {
  return imsRequest<ICustomer[]>({
    url: '/cd/customer/listByName',
    method: 'GET',
  });
}

export interface IBusiness {
  id: number;
  name: string;
}

export function getBusinessList(params: { custId?: number }) {
  return energyRequest<IBusiness[]>({
    url: '/channel-business/list',
    method: 'GET',
    params,
  });
}
