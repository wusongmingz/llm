export interface IRoleMenuResp {
  createTime: string;
  updateTime: string;
  id: number;
  parentId: number;
  title: string;
  permType: number;
  path: string;
  name: string;
  component: string;
  icon: string;
  hidden: number;
  status: number;
  createBy: number;
  updateBy: number;
  sort: number;
  remark: string;
  children: IRoleMenuResp[];
}

export interface IMenuInfo {
  id?: number;
  permId?: number;
  menuType?: 0 | 1; // 0 是目录  1是菜单  目前不支持目录
  sysType: number;
  title: string;
  parentId: number;
  sort: number;
  icon: string;
  name: string;
  path: string;
  component: string;
  // dynamicLevel: number;
  status: number;
  // ignoreKeepAlive: boolean;
  hidden: number;
}

export interface IMenuInfoRes {
  id: number;
  menuType: 0 | 1; // 0 是目录  1是菜单  目前不支持目录
  sysType: number;
  title: string;
  parentId: number;
  sort: number;
  icon: string;
  name: string;
  path: string;
  component: string;
  // dynamicLevel: number;
  status: number;
  // ignoreKeepAlive: boolean;
  hidden: number;
}

export interface IMenuInfoResp extends IMenuInfo {
  trans: string;
  createdAt: number;
  updatedAt: number;
}

export interface ICreateMenuReq {
  menuType?: 0 | 1;
  title: string;
  parentId: number;
  sort: number;
  icon: string;
  name: string;
  path: string;
  component: string;
  // dynamicLevel: number;
  status: number;
  // ignoreKeepAlive: boolean;
  hidden: number;
}

export interface IUpdateMenuReq {
  permId?: number;
  menuType?: 0 | 1;
  title?: string;
  parentId?: number;
  sort?: number;
  icon?: string;
  name?: string;
  path?: string;
  component?: string;
  // dynamicLevel?: number;
  status?: number;
  // ignoreKeepAlive?: boolean;
  hidden?: number;
}
