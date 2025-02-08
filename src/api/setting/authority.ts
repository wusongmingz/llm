import { permRequest } from '@/utils/request';
import { IRoleList } from './type/authority';

export function getRoleMenu(roleId: number) {
  return permRequest<IRoleList[]>({
    url: '/role-perm/menu/list',
    method: 'get',
    params: {
      roleId,
    },
  });
}

export function updateRoleMenu(data: { roleId: number; permIds: number[] }) {
  return permRequest<undefined>({
    url: '/role-perm/menu/assign',
    method: 'POST',
    data,
  });
}
