import { imsRequest } from '@/utils/request';

export interface enumListReq {
  domainFlag: string;
  tableName: string;
  columnName: string;
}

export interface enumListRes {
  codeValue: string;
  dispName: string;
}

export interface provList {
  provCode: number;
  countryId: number;
  provName: string;
  tenantId: number;
}

export interface regionList {
  regionCode: number;
  regionName: string;
  shortName: string;
  areaCode: string;
  provCode: number;
  validDate: string;
  expireDate: string;
  modifyDate: string;
  tenantId: number;
}

export interface countyList {
  countyCode: number;
  countyName: string;
  regionCode: number;
  validDate: string;
  expireDate: string;
  modifyDate: string;
  tenantId: number;
}

export function queryResourceSegmentService() {
  return imsRequest<enumListRes[]>({
    url: '/sysEnum/resource/segment',
    method: 'GET',
  });
}

export function querySysEnumListService(params: enumListReq) {
  return imsRequest<enumListRes[]>({
    url: '/sysEnum/list',
    method: 'GET',
    params,
  });
}

export function querySysEnumProvlistService() {
  return imsRequest<provList[]>({
    url: '/sysEnum/provlist',
    method: 'GET',
  });
}

export function querySysEnumRegionlistService(provCode: number) {
  return imsRequest<regionList[]>({
    url: '/sysEnum/regionlist',
    method: 'GET',
    params: { provCode: provCode },
  });
}

export function querySysEnumCountylistService(regionCode: number) {
  return imsRequest<countyList[]>({
    url: '/sysEnum/countylist',
    method: 'GET',
    params: { regionCode: regionCode },
  });
}

export function queryContractTypeListService() {
  return imsRequest<enumListRes[]>({
    url: '/cd/agreement/typeList',
    method: 'GET',
  });
}
