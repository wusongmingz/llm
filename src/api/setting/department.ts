import { permRequest } from '@/utils/request';
import { IPageInfoParams } from '../type/base';

export interface IDepartment {
  orgId: number;
  name: string;
  parent: number[];
  parentId: number;
  remark: string;
  type: string;
  tenantId: number;
  logo: string;
  serviceId: number;
}

export interface IDepartmentInfo extends IDepartment {
  children: IDepartment[];
}

export interface IDepartmentListReq extends IPageInfoParams {
  name?: string;
}

export function getDepartmentPage(params: IDepartmentListReq) {
  return permRequest<{
    records?: IDepartmentInfo[];
    total?: number;
  }>({
    url: '/org/page',
    method: 'get',
    params,
  });
}

export function getDepartmentList() {
  return permRequest<IDepartmentInfo[]>({
    url: '/org/list',
    method: 'get',
  });
}

export function createDepartment(data: Partial<IDepartmentInfo>) {
  return permRequest<undefined>({
    url: '/org/add',
    method: 'post',
    data,
  });
}

export function updateDepartment(data: Partial<IDepartmentInfo>) {
  return permRequest<undefined>({
    url: '/org/update',
    method: 'post',
    data,
  });
}

export function deleteDepartmentByIds(orgId: number) {
  return permRequest<undefined>({
    url: '/org/remove',
    method: 'get',
    params: {
      orgId,
    },
  });
}
