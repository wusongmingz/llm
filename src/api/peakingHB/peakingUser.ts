import { energyRequest } from '@/utils/request';

export interface planList {
  id: number;
  planId: number;
  peakShavingCode: string;
  custId: number;
  custName: string;
  provCode: number;
  provName: string;
  status: number;
  noticeFlag: number;
  ackFlag: number;
  submitFlag: number;
  offlineAckFlag: number;
  noticeTime: string;
  ackTime?: string;
  ackUserId?: 2;
  ackUserName?: string;
  ackUserPhone?: string;
  offlineAckTime?: string;
  offlineAckUserId?: number;
  ackContent: string;
  resSegmentName: string;
}

export interface peakUserInfo {
  aggregatorOrgId: number;
  aggregatorName: string;
  planInfo: {
    createTime: string;
    updateTime: string;
    id: number;
    aggregatorOrgId: number;
    peakShavingDate: string;
    dateType: number; //1：工作日、2：非工作日
    peakShavingCode: string; //调峰编号
    createBy: number;
    submitFlag: number;
    baseLoadFlag: number;
    clearingNextdayFlag: number;
    clearingCurdayFlag: number;
    actualLoadFlag: number;
    forecastIncomeFlag: number;
  };
  itemList?: planList[];
}

export interface custList {
  custId: number;
  status: number;
}

export interface peakList {
  planId: number;
  custInfoList: custList[];
}

export interface peakNotice {
  planId: number;
  custIds: number[];
}

export interface custInfo {
  custId: number;
  peakShavingCode: string;
  custName: string;
  foreignId: string;
  resSegment: number;
  resSegmentName: string;
}

export interface planDeatilRes {
  planId: number;
  peakShavingCode: string;
  peakShavingDate: string;
  type: number;
  provCode: number;
  provName: string;
  custNum: number;
  custInfos: custInfo[];
}

export interface peakDetailReq {
  pageNo?: number;
  pageSize?: number;
  beginDate: string;
  endDate: string;
  resSegment?: number;
}

export function obtainPlanList(peakShavingDate: string) {
  return energyRequest<peakUserInfo>({
    url: '/peak-shaving-plan/info',
    method: 'GET',
    params: { peakShavingDate: peakShavingDate },
  });
}

export function peakNoticePlan(data: peakNotice) {
  return energyRequest<undefined>({
    url: '/peak-shaving-plan/notice',
    method: 'POST',
    data,
  });
}

export function peakUpdatePlan(data: peakList) {
  return energyRequest<undefined>({
    url: '/peak-shaving-plan/updateItem',
    method: 'POST',
    data,
  });
}

export function peakSubmitPlan(id: number) {
  return energyRequest<undefined>({
    url: '/peak-shaving-plan/submit',
    method: 'GET',
    params: { planId: id },
  });
}

export function getPlanDetailPage(params: peakDetailReq) {
  return energyRequest<{
    records?: planDeatilRes[];
    total?: number;
  }>({
    url: '/peak-shaving-plan/detailPage',
    method: 'GET',
    params,
  });
}

export function exportPeakPlanDetail(param: string) {
  return energyRequest({
    url: '/peak-shaving-plan/exportDetail?' + param,
    method: 'GET',
    responseType: 'blob',
  });
}
