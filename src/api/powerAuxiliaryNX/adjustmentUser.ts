import { energyRequest } from '@/utils/request';

export interface planList {
  id: number;
  planId: number;
  custNumber: number;
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
  submitByName: string;
  planInfo: {
    createTime: string;
    updateTime: string;
    id: number;
    aggregatorOrgId: number;
    peakShavingDate: string;
    marketType: number;
    tradeType: number;
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
  custNumber: number;
  status: number;
}

export interface peakList {
  planId: number;
  custInfoList: custList[];
}

export interface peakNotice {
  planId: number;
  custNumbers: number[];
}

export interface peakPlanReq {
  peakShavingDate: string;
  marketType: number;
  tradeType: number;
  custNumbers?: string;
}

export interface peakDetailReq {
  pageNo?: number;
  pageSize?: number;
  beginDate: string;
  endDate: string;
}

//申报计划返回结果接口
export interface declareLoad {
  custId: number;
  custName: string;
  custNumber: string;
  itemList: Array<declareLoadInfo>;
}
export interface declareLoadInfo {
  time: string;
  loadVal: number;
  price: number;
  clearingFlag: number;
}

export function getRecommendCustList(planId: number) {
  return energyRequest<number[]>({
    url: '/ningxia-peak-shaving/plan/recommendCustList',
    method: 'GET',
    params: { planId: planId },
  });
}

export function obtainUserPlanList(params: peakPlanReq) {
  return energyRequest<peakUserInfo>({
    url: '/ningxia-peak-shaving/plan/detail',
    method: 'GET',
    params,
  });
}

export function peakNoticePlan(data: peakNotice) {
  return energyRequest<undefined>({
    url: '/ningxia-peak-shaving/plan/notice',
    method: 'POST',
    data,
  });
}

export function peakUpdatePlan(data: peakList) {
  return energyRequest<undefined>({
    url: '/ningxia-peak-shaving/plan/updateItem',
    method: 'POST',
    data,
  });
}

export function peakSubmitPlan(id: number) {
  return energyRequest<undefined>({
    url: '/ningxia-peak-shaving/plan/submit',
    method: 'GET',
    params: { planId: id },
  });
}

export function exportPeakPlanDetail(param: string) {
  return energyRequest({
    url: '/ningxia-peak-shaving/plan/exportPlanItem?' + param,
    method: 'GET',
    responseType: 'blob',
  });
}

export function getBaseCustLoadList(params: peakPlanReq) {
  return energyRequest<undefined>({
    url: '/ningxia-peak-shaving/base-load/custLoadList',
    method: 'GET',
    params,
  });
}

export function getDeclareCustLoadList(params: peakPlanReq) {
  return energyRequest<undefined>({
    url: '/ningxia-peak-shaving/declare-load/custLoadList',
    method: 'GET',
    params,
  });
}

export function getActualCustLoadList(params: { date: string; custNumbers: string }) {
  return energyRequest<undefined>({
    url: '/platform/actual-load/custLoadList',
    method: 'GET',
    params,
  });
}

export function getlastSelectedList(planId: number) {
  return energyRequest<custList[]>({
    url: '/ningxia-peak-shaving/plan/lastSelected',
    method: 'GET',
    params: { planId: planId },
  });
}

//调峰用户-申报计划{ peakShavingDate: string; marketType: number; tradeType: number }
export function getDeclareLoad(params: { peakShavingDate: string; marketType: number; tradeType: number }) {
  return energyRequest<declareLoad[]>({
    url: '/ningxia-peak-shaving/declare-load/list4Contribute',
    method: 'GET',
    params,
  });
}
