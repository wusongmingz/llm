import { IPageInfoParams } from '@/api/type/base';

export interface ILoginReq {
  loginType: number;
  userInfo: string;
}

export interface ILoginResp {
  accessToken: string;
  refreshToken: string;
  expiresTime: string;
  refreshExpiresTime: string;
  clientId: string;
  loginId: string;
  openid: string;
  scope: string;
  expiresIn: number;
  refreshExpiresIn: string;
}

export interface IUserBaseInfo {
  // userId: string;
  // username: string;
  // nickname: string;
  // avatar: string;
  homePath: string;
  // desc: string;
}

// user 相关

export interface IUserInfo {
  userId: number;
  name: string;
  orgName: string;
  loginName: string;
  password: string;
  orgId: number;
  mail: string;
  status: number;
  phone: string;
  address: string;
  expireTime: string;
  lastModifyPwdTime: string;
  remark: string;
  languageCode: string;
  tenantId: number;
  isAdmin: number;
  changePassword: number;
  sysType: number;
  headImg: string;
  createTime: string;
  updateTime: string;
  createBy: number;
  updateBy: number;
  roleIds: number[];
}

export interface IOrgInfo {
  orgId: number;
  name: string;
  parentId: number;
  remark: string;
  type: string;
  orgFlag: number;
  tenantId: number;
  displayName: string;
  logo: string;
  serviceId: number;
}

export interface IRoleListInfo {
  createTime: string;
  updateTime: string;
  id: number;
  name: string;
  remark: string;
  status: number;
  createBy: number;
  updateBy: number;
}

export interface IUserInfoResp {
  userStatus: number;
  user: IUserInfo;
  org: IOrgInfo;
  roleList: IRoleListInfo;
}

export interface IUserDeatilResp {
  userId: number;
  sysUser: IUserInfo;
  sysOrg: IOrgInfo;
}

export interface IUserListReq extends IPageInfoParams {
  name?: string;
  loginName?: string;
  phone?: string;
  mail?: string;
}
export interface IUserListResp {
  records?: Array<IUserInfoResp>;
  total?: number;
}

export interface ICreateUserReq {
  name?: string;
  loginName?: string;
  orgId: number; //所属组织, 必传
  mail?: string;
  password: string;
  phone?: string;
  status: number;
  remark?: string;
  address?: string;
  headImg?: string;
  sysType: number;
  roleIds?: number[];
}

export interface IUpdateUserReq {
  userId: number;
  name?: string | undefined;
  loginName: string;
  orgId: number | undefined; //所属组织, 必传
  mail?: string | undefined;
  password: string;
  phone?: string | undefined;
  status: number;
  remark?: string | undefined;
  address?: string | undefined;
  headImg?: string | undefined;
  sysType: number;
  roleIds?: number[] | undefined;
}
