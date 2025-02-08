import { permRequest } from '@/utils/request';
import { ICreateMenuReq, IMenuInfoResp, IRoleMenuResp, IUpdateMenuReq } from './type/menu';

// 登录获取菜单
export function getRoleMenuList() {
  return permRequest<IRoleMenuResp[]>({
    url: '/auth-user/menu',
    method: 'GET',
    params: {
      sysType: 1,
    },
  });
}

export function getMenuList() {
  return permRequest<IMenuInfoResp[]>({
    url: '/perm/menu/tree',
    method: 'get',
  });
}

export function createMenu(data: ICreateMenuReq) {
  return permRequest<undefined>({
    url: '/perm/menu/add',
    method: 'post',
    data,
  });
}

export function updateMenu(data: IUpdateMenuReq) {
  return permRequest<undefined>({
    url: '/perm/menu/update',
    method: 'post',
    data,
  });
}

export function deleteMenuByIds(permId: number) {
  return permRequest<undefined>({
    url: '/perm/remove',
    method: 'get',
    params: {
      permId,
    },
  });
}
