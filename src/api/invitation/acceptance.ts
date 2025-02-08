import { energyRequest as ajiotRequest } from '@/utils/request';

export interface IPageParams {
  pageNo: number;
  pageSize: number;
}

export interface IInviteInfo {
  id?: number;
  inviteCode: string;
  periodNo: number;
  integratorCode: string;
  respType: 1 | 2;
  rangeType: 1 | 2;
  rangeCode: string;
  respVal: number;
  receiveTime: string;
  ackEndTime: string;
  respBeginTime: string;
  respEndTime: string;
  ackStatus: 0 | 1;
  value: 1 | 2 | 3 | 4;
  note: string;
  inviteStep: 0 | 1 | 2 | 3;
  isCalcUsage?: number;
}

export interface IAcceptanceListReq extends IPageParams {
  ackStatus?: string;
  inviteStatus?: string;
  timeType?: string;
  beginTime?: string;
  endTime?: string;
  rangeTime?: string;
}

export interface IAcceptanceListRes extends IInviteInfo {
  inviteInfo?: any;
  inviteStatus?: any;
}

export function getAcceptanceList(data: string) {
  return ajiotRequest<{
    total?: number;
    records?: IAcceptanceListRes[];
  }>({
    url: '/inviteInfo/page?' + data,
    method: 'GET',
  });
}

export function createInvite(data: Partial<IInviteInfo>) {
  return ajiotRequest<undefined>({
    url: '/inviteInfo/add ',
    method: 'POST',
    data,
  });
}

export function updateInvite(data: Partial<IInviteInfo>) {
  return ajiotRequest<undefined>({
    url: '/inviteInfo/update ',
    method: 'POST',
    data,
  });
}

export function removeInvite(id: number) {
  return ajiotRequest<undefined>({
    url: '/inviteInfo/delete?id=' + id,
    method: 'GET',
  });
}

export function getInviteById(id: number) {
  return ajiotRequest<undefined>({
    url: '/inviteInfo/details?id=' + id,
    method: 'GET',
  });
}

export function getInviteNextStep(inviteId: number) {
  return ajiotRequest<undefined>({
    url: '/inviteInfo/nextStep?inviteId=' + inviteId,
    method: 'GET',
  });
}

export function getInviteCurStep(inviteId: number) {
  return ajiotRequest<undefined>({
    url: '/inviteInfo/curStep?inviteId=' + inviteId,
    method: 'GET',
  });
}

export function getIntegratorCode() {
  return ajiotRequest<undefined>({
    url: '/aggregator/integratorCode',
    method: 'GET',
  });
}
