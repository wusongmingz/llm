import { IFileResponse, energyRequest as ajiotRequest } from '@/utils/request';

import type { TableColumnCtx } from 'element-plus';

export interface IPageParams {
  pageNo: number;
  pageSize: number;
}

export interface IInviteDecision {
  inviteId?: number;
  acctId: number;
  foreignId?: string;
  custId: number;
  custName?: string;
  userName?: string;
  resourceId?: number;
  deviceCapacity?: number;
  forecastAdjLoad?: number;
  declareLoad?: number;
  declareStatus?: number;
  bidderFlag?: number;
}

export interface SpanMethodProps {
  row?: IInviteDecision;
  column?: TableColumnCtx<IInviteDecision>;
  rowIndex: number;
  columnIndex: number;
}

export interface IInviteDecisionListReq {
  inviteId?: number;
}

export interface IInviteDecisionListRes {
  custId: number;
  custName: number;
  acctId: number;
  foreignId: string;
  declareStatus: number;
  forecastAdjLoad: number;
  bidderFlag: number;
  declareLoad: number;
  resourceDetailList: any[];
}

export interface planListNeedDeclareRes {
  inviteId: number;
  inviteCode: string;
  respType: number;
  respTypeName: string;
  custId: number;
  custName: string;
  acctId: number;
  foreignId: string;
  respBeginTime: string;
  respEndTime: string;
  declareLoad: number;
}

export function getInviteDecisionList(data: number) {
  return ajiotRequest<IInviteDecisionListRes>({
    url: '/inviteDeclare/planList?inviteId=' + data,
    method: 'GET',
  });
}

export function getNeedNoticeResult(data: number) {
  return ajiotRequest<IInviteDecisionListRes>({
    url: '/inviteDeclare/planListNeedNoticeResult?inviteId=' + data,
    method: 'GET',
  });
}

export function updateInviteDecision(data: any) {
  return ajiotRequest<undefined>({
    url: '/inviteDeclare/modifyDeclareLoad',
    method: 'POST',
    data,
  });
}

export function putInviteNotice(data: any) {
  return ajiotRequest<undefined>({
    url: '/inviteDeclare/noticePlan',
    method: 'POST',
    data,
  });
}

export function checkInviteNotice(data: string) {
  return ajiotRequest<undefined>({
    url: '/inviteDeclare/noticeResult',
    method: 'POST',
    data,
  });
}

export function getPlanListNeedDeclare(inviteId: number) {
  return ajiotRequest<planListNeedDeclareRes[]>({
    url: '/inviteDeclare/planListNeedDeclare?inviteId=' + inviteId,
    method: 'GET',
  });
}

export function exportPlanListNeedDeclare(inviteId: number) {
  return ajiotRequest<IFileResponse>({
    url: '/inviteDeclare/exportPlanListNeedDeclare?inviteId=' + inviteId,
    method: 'GET',
    responseType: 'blob',
  });
}
