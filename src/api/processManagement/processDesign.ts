import { flowableRequest } from '@/utils/request';

export interface listReq {
  pageNo: number;
  pageSize: number;
}

export interface listRes {
  id: string;
  name: string;
  key: string;
  version: number;
  deploymentId: string;
  suspended: boolean;
  deploymentTime: string;
  formId: number;
  formName: string;
}

export function getProcessList(params: listReq) {
  return flowableRequest<{ records: listRes[]; total: number }>({
    url: '/process/definition/list',
    method: 'GET',
    params,
  });
}

export function delProcess(params: { flowId: string }) {
  return flowableRequest<undefined>({
    url: '/process/definition/delete',
    method: 'GET',
    params,
  });
}

export function getProcessInfo(params: { flowId: string }) {
  return flowableRequest<undefined>({
    url: '/process/definition/detail',
    method: 'GET',
    params,
  });
}

export interface variablesObj {
  [key: string]: string;
}

export interface start {
  procDefId: string;
  userId: number;
  variables: variablesObj;
}

export function startProcess(data: start) {
  return flowableRequest<undefined>({
    url: '/process/instance/start',
    method: 'POST',
    data,
  });
}

export interface create {
  flowId: string;
  name: string;
  process: any;
  formId: number;
  userId: number;
}

export function createProcess(data: create) {
  return flowableRequest<undefined>({
    url: '/process/definition/create',
    method: 'POST',
    data,
  });
}

export interface pageNameList {
  id: string;
  name: string;
  key: string;
  deploymentId: string;
  deploymentTime: string;
}

export function listByPageName(pageName: string) {
  return flowableRequest<pageNameList[]>({
    url: '/process/definition/listByPageName',
    method: 'GET',
    params: { pageName: pageName },
  });
}
