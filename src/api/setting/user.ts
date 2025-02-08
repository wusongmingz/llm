import { permRequest } from '@/utils/request';
import { ICreateUserReq, ILoginReq, ILoginResp, IUpdateUserReq, IUserListReq, IUserListResp, IUserDeatilResp } from './type/user';
import { IRoleMenuResp } from './type/menu';
import { APIRequest } from '@/utils/request';
// 获取rsa公钥
export function getPublicKey() {
  return permRequest<undefined>({
    url: '/cipher/rsa/publicKey',
    method: 'get',
  });
}

// 登录
export function login(data: ILoginReq) {
  return permRequest<ILoginResp>({
    url: '/oauth2/login',
    method: 'post',
    data,
  });
}

export function logout() {
  return permRequest<undefined>({
    url: '/oauth2/logout',
    method: 'get',
  });
}

export function loginCode(params: { phone: string }) {
  return permRequest<undefined>({
    url: '/oauth2/verify-code',
    method: 'get',
    params,
  });
}

export function changePassword(data: { oldPassword: string; newPassword: string }) {
  return permRequest<undefined>({
    url: '/auth-user/change-password',
    method: 'post',
    data,
  });
}

export function resetPassword(data: { info: string | boolean }) {
  return permRequest<undefined>({
    url: '/oauth2/reset-password-2',
    method: 'post',
    data,
  });
}

export function getUserList(params: IUserListReq) {
  return permRequest<IUserListResp>({
    url: '/auth-user/page',
    method: 'get',
    params,
  });
}

export function getUserInfoById(id: number) {
  return permRequest<IUserDeatilResp>({
    url: '/auth-user/userinfo',
    method: 'get',
    params: {
      id,
    },
  });
}

export function deleteUserByIds(id: number) {
  return permRequest<undefined>({
    url: '/auth-user/remove',
    method: 'get',
    params: {
      id,
    },
  });
}

export function createUser(data: ICreateUserReq) {
  return permRequest<undefined>({
    url: '/auth-user/add',
    method: 'post',
    data,
  });
}

export function updateUser(data: IUpdateUserReq) {
  return permRequest<undefined>({
    url: '/auth-user/update',
    method: 'post',
    data,
  });
}

// 登录用户详细信息
export interface ISysUser {
  userId?: number;
  name?: string; //用户名
  loginName?: string;
  orgId?: number;
  status?: string;
  phone?: string; //电话
  expireTime?: string;
  languageCode?: string;
  empId?: number;
  tenantId?: number;
  isAdmin?: number;
  sysType?: number;
  provCode?: number;
  provName?: string;
  provShortName?: string;
  lastModifyPwdTime?: string;
  avatar?: string; //头像
  owner?: string; //群组
  email?: string; //邮箱
  id?: string; //userId
  groups?: Array<string>; //userid
  userID: string;
}

export interface ISysOrg {
  orgId: number;
  name: string; //登录用户所属组织名
  parentId: number;
  remark: string;
  type: string;
  orgFlag: number;
  tenantId: number;
  displayName: string;
  serviceId: number;
}

export interface IApis {
  id: number;
  parentId: number;
  title: string;
  sysType: number;
  permType: number;
  path: string;
  name: string;
  hidden: number;
  status: number;
  createBy: number;
  updateBy: number;
  sort: number;
  createTime: string;
  updateTime: number;
}

export interface IRoles {
  id: number;
  name: string;
  remark: string;
  status: number;
  enhanceAuth: number;
  createBy: number;
  updateBy: number;
  createTime: string;
  updateTime: string;
}

export function getUserInfo() {
  return permRequest<{
    userId: number;
    sysUser: ISysUser;
    sysOrg: ISysOrg;
    topOrg: ISysOrg;
    menus: IRoleMenuResp[];
    apis: IApis[];
    roles: IRoles[];
  }>({
    url: '/auth-user/loginUserinfo',
    method: 'get',
  });
}

//网关
export function getUserInfoNew(params: { state: string; code: string }) {
  return APIRequest({
    url: '/login/getuser',
    method: 'get',
    params,
  });
}
