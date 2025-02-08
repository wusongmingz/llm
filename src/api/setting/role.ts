import { permRequest } from '@/utils/request';
import { ICreateRoleReq, IRoleListReq, IRoleListResp, IUpdateRoleReq } from './type/role';

export function getRolePage(params: IRoleListReq) {
  return permRequest<IRoleListResp>({
    url: '/role/page',
    method: 'get',
    params,
  });
}

export function getRoleList() {
  return permRequest<any[]>({
    url: '/role/list',
    method: 'get',
    params: { ststus: 1 },
  });
}

export function createRole(data: ICreateRoleReq) {
  return permRequest<undefined>({
    url: '/role/add',
    method: 'post',
    data,
  });
}

export function updateRole(data: IUpdateRoleReq) {
  return permRequest<undefined>({
    url: '/role/update',
    method: 'post',
    data,
  });
}

export function deleteRoleByIds(roleId: number) {
  return permRequest<undefined>({
    url: '/role/remove',
    method: 'get',
    params: {
      roleId,
    },
  });
}
