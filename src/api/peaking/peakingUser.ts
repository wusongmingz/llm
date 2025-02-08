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
  validBaseLoad: number;
  validDeclareLoad: number;
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
  foreignId: number;
}

export interface peakUserInfo {
  aggregatorOrgId: number;
  aggregatorName: string;
  updateItemStatusByName: string;
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
    saveFlag: number;
    updateItemStatusBy: number;
    updateItemStatusTime: string;
  };
  itemList?: planList[];
}

export interface custList {
  custId: number;
  status: number;
  validBaseLoad?: number;
  validDeclareLoad?: number;
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
}

export function getRecommendCustList(planId: number) {
  return energyRequest<number[]>({
    url: '/northwest-peak-shaving/plan/recommendCustList',
    method: 'GET',
    params: { planId: planId },
  });
}

export function obtainUserPlanList(peakShavingDate: string) {
  return energyRequest<peakUserInfo>({
    url: '/northwest-peak-shaving/plan/detail',
    method: 'GET',
    params: { peakShavingDate: peakShavingDate },
  });
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
    url: '/northwest-peak-shaving/plan/notice',
    method: 'POST',
    data,
  });
}

export function peakUpdatePlan(data: peakList) {
  return energyRequest<undefined>({
    url: '/northwest-peak-shaving/plan/updateItem',
    method: 'POST',
    data,
  });
}

export function peakSubmitPlan(id: number) {
  return energyRequest<undefined>({
    url: '/northwest-peak-shaving/plan/submit',
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
    url: '/northwest-peak-shaving/plan/exportPlanItem?' + param,
    method: 'GET',
    responseType: 'blob',
  });
}

export function getBaseCustLoadList(params: { peakShavingDate: string; custIds: string }) {
  return energyRequest<undefined>({
    url: '/northwest-peak-shaving/base-load/custLoadList',
    method: 'GET',
    params,
  });
}

export function getDeclareCustLoadList(params: { peakShavingDate: string; custIds: string }) {
  return energyRequest<undefined>({
    url: '/northwest-peak-shaving/declare-load/custLoadList',
    method: 'GET',
    params,
  });
}

export function getActualCustLoadList(params: { date: string; custIds: string }) {
  return energyRequest<undefined>({
    url: '/platform/actual-load/custLoadList',
    method: 'GET',
    params,
  });
}

export function getlastSelectedList(planId: number) {
  return energyRequest<custList[]>({
    url: '/northwest-peak-shaving/plan/lastSelected',
    method: 'GET',
    params: { planId: planId },
  });
}
