import { imsRequest } from '@/utils/request';

export interface IContract {
  agreementId: number;
  custId: number;
  agrLevelId: number;
  agreementName: string;
  createDate: string;
  expireDate: string;
  validDate: string;
  path: string;
  createdAt: string;
  updatedAt: string;
  status: number;
  agrType: number;
  clPlanName: string;
  companyName: string;
}

export interface IContractListReq {
  pageNum: number;
  pageSize: number;
  custId?: number;
}

export interface IAgreement {
  agreementName: string;
  expireDate: string;
}

export function getContractList(custId: number) {
  return imsRequest<IContract[]>({
    url: '/cd/agreement/list',
    method: 'GET',
    params: {
      custId: custId,
    },
  });
}

export function getContractById(id: number) {
  return imsRequest<IContract>({
    url: '/base/contract',
    method: 'GET',
    data: { id },
  });
}

export function getAgrType(orgId: number) {
  return imsRequest<any[]>({
    url: '/cd/agreement/typeList',
    method: 'GET',
    data: { orgId: orgId },
  });
}

export function createContract(data: any[]) {
  return imsRequest<undefined>({
    url: '/cd/agreement/create',
    // headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data,
  });
}

export function updateContract(data: any[]) {
  return imsRequest<undefined>({
    url: '/cd/agreement/update',
    // headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data,
  });
}

export function deleteContract(ids: number[]) {
  return imsRequest<undefined>({
    url: '/cd/agreement/delete',
    method: 'GET',
    data: { agreementId: ids[0] },
  });
}

export function agreementList() {
  return imsRequest<IAgreement[]>({
    url: '/cd/agreement/soon-expire',
    method: 'GET',
  });
}

export function getOSSDownloadLink(url: string) {
  return imsRequest<{
    downloadUrl: string;
  }>({
    url: '/aliyun/oss/download',
    method: 'GET',
    params: { url },
  });
}
