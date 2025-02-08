import { IPageInfoParams } from '@/api/type/base';

export interface IRoleInfo {
  id: number;
  name: string;
  remark: string;
  status: number;
}

export interface IRoleInfoResp extends IRoleInfo {
  createTime: string;
  updateTime: string;
  createBy: number;
  updateBy: number;
}

export interface IRoleListReq extends IPageInfoParams {
  status?: number;
}
export interface IRoleListResp {
  records?: IRoleInfoResp[];
  total?: number;
}

export interface ICreateRoleReq {
  name: string;
  remark: string;
  status: number;
}

export interface IUpdateRoleReq {
  roleId: number;
  name: string;
  remark: string;
  status: number;
}
