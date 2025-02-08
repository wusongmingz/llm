import { IFileResponse, energyRequest } from '@/utils/request';

export interface IInviteDecision {
  inviteCode: string;
  id: number;
  ackEndTime: string;
}
export function getInviteDecisionList() {
  return energyRequest<IInviteDecision[]>({
    url: '/inviteInfo/inviteDropList',
    method: 'GET',
  });
}

export interface IInvitePlanListReq {
  inviteId?: number;
  custId?: number;
  pageNo?: number;
  pageSize?: number;
}

export interface IInvitePlan {
  custName: string;
  inviteCode: string;
  endTime: string;
  inviteId: number;
  respLoad: number;
  beginTime: string;
  custId: number;
}

export function getInvitePlanList(params: IInvitePlanListReq) {
  return energyRequest<{
    records?: IInvitePlan[];
    total?: number;
  }>({
    url: '/inviteInfo/invitePlanPage',
    method: 'GET',
    params,
  });
}

export interface IInvitePlanExportReq {
  inviteId?: number;
  custId?: number;
}
export function getInvitePlanExport(params: IInvitePlanExportReq) {
  return energyRequest<IFileResponse>({
    url: '/inviteInfo/invitePlanExport',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}
