import { energyRequest } from '@/utils/request';

export interface dataReq {
  resourceId?: number;
  custId?: number;
}

export interface resourceList {
  resourceId: number;
  resourceName: string;
}

export interface resourceListRes {
  custId: number;
  custName: string;
  resourceList?: resourceList[];
}

export interface loadListReq {
  resourceId?: number | undefined;
  custId?: number | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
}

export interface loadList {
  time: string;
  powerVal: number;
}

export function getResourceList() {
  return energyRequest<resourceListRes[]>({
    url: '/resource/list',
    method: 'GET',
  });
}

export function getOverviewDevice(params: dataReq) {
  return energyRequest<{
    status?: number;
    capacity?: number;
  }>({
    url: '/resource/overview/device',
    method: 'GET',
    params,
  });
}

export function getOverviewLoad(params: dataReq) {
  return energyRequest<{
    actualPower?: number;
    maxPower?: number;
    minPower?: number;
  }>({
    url: '/resource/overview/load',
    method: 'GET',
    params,
  });
}

export function getResourceLoadList(params: loadListReq) {
  return energyRequest<loadList[]>({
    url: '/resource/loadList',
    method: 'GET',
    params,
  });
}

export function exportLoadList(params: loadListReq) {
  return energyRequest({
    url: '/resource/exportLoadList',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}

export function getForecastLoadList(params: loadListReq) {
  return energyRequest<loadList[]>({
    url: '/resource/forecastLoadList',
    method: 'GET',
    params,
  });
}

export function getD7avgLoadList(params: loadListReq) {
  return energyRequest<loadList[]>({
    url: '/resource/d7avgLoadList',
    method: 'GET',
    params,
  });
}
