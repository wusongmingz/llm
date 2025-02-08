import { energyRequest } from '@/utils/request';

export interface custObj {
  custId: number;
  custName: string;
  loadSource: number;
  warning: number;
}

export interface loadInfoReq {
  peakShavingDate: string;
  custId?: number;
}

export interface declarePlanReq {
  peakShavingDate: string;
  custIds: string;
}

export interface loadInfoRes {
  time: string;
  oriDeclareVal: number;
  oriBaseVal: number;
  baseVal: number;
  declareVal: number;
  actualVal: number;
  peakShavingFlag: number;
}

export interface loadInfoUpdate {
  peakShavingDate: string;
  custId: number;
  time: string;
  declareVal: number;
}

export interface logReq {
  pageNo: number;
  pageSize: number;
}

export interface logRes {
  id: number;
  logType: number;
  orgId: number;
  orgName: string;
  operatorTime: string;
  operatorId: number;
  operatorName: string;
  content: string;
  operateType: number;
}

export interface trendReq {
  beginDate: string;
  endDate: string;
  custId?: number;
}

export interface loadList {
  time: string;
  loadVal: number;
  clearingFlag?: number;
}

export interface baseLineType {
  baseLineType: number;
  updateTime: string;
}

export function getBaseLineType(params: { peakShavingDate: string; custId: number }) {
  return energyRequest<baseLineType>({
    url: '/northwest-peak-shaving/base-load/info',
    method: 'GET',
    params,
  });
}

export function getCustInfo(peakShavingDate: string) {
  return energyRequest<custObj[]>({
    url: '/peak-shaving/custInfo',
    method: 'GET',
    params: { peakShavingDate: peakShavingDate },
  });
}

export function getCustListInfo(peakShavingDate: string) {
  return energyRequest<custObj[]>({
    url: '/northwest-peak-shaving/base-load/custList',
    method: 'GET',
    params: { peakShavingDate: peakShavingDate },
  });
}

export function getDeclarePlan(params: declarePlanReq) {
  return energyRequest<loadInfoRes[]>({
    url: '/northwest-peak-shaving/plan/queryDeclarePlan',
    method: 'GET',
    params,
  });
}

export function updateLoadInfo(data: loadInfoUpdate) {
  return energyRequest<undefined>({
    url: '/northwest-peak-shaving/declare-load/update',
    method: 'POST',
    data,
  });
}

export function getOperateLog(params: logReq) {
  return energyRequest<{ records?: logRes[]; total?: number }>({
    url: '/operate-log/peak-shaving/page',
    method: 'GET',
    params,
  });
}

export function importPeakingPlanFile(data: FormData) {
  return energyRequest<undefined>({
    url: '/northwest-peak-shaving/base-load/import',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data,
  });
}

export function batchUpdateLoadInfo(data: FormData) {
  return energyRequest<undefined>({
    url: '/northwest-peak-shaving/declare-load/batchUpdate',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data,
  });
}

export function getPeakingBaselineTemplateUrl() {
  return '/resource/template/基线模板.xlsx';
}

export function getPeakingPlanTemplateUrl() {
  return '/resource/template/计划导入模板.xlsx';
}

export function exportPeakDeclarePlan(peakShavingDate: string) {
  return energyRequest({
    url: '/northwest-peak-shaving/plan/exportDeclarePlan?peakShavingDate=' + peakShavingDate,
    method: 'GET',
    responseType: 'blob',
  });
}

export function exportDeclareLoadInfo(params: loadInfoReq) {
  return energyRequest({
    url: '/northwest-peak-shaving/declare-load/exportDeclareTemplate',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}

export function exportPeakBaseLoadInfo(params: loadInfoReq) {
  return energyRequest({
    url: '/northwest-peak-shaving/plan/exportLoadInfoByCust',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}

export function optimizeLoadInfo(peakShavingDate: string) {
  return energyRequest<undefined>({
    url: '/northwest-peak-shaving/declare-load/optimize',
    method: 'GET',
    params: { peakShavingDate: peakShavingDate },
  });
}

export function getBaseLoadList(params: loadInfoReq) {
  return energyRequest<loadList[]>({
    url: '/northwest-peak-shaving/base-load/custLoad',
    method: 'GET',
    params,
  });
}

export function getDeclareLoadList(params: loadInfoReq) {
  return energyRequest<loadList[]>({
    url: '/northwest-peak-shaving/declare-load/custLoad',
    method: 'GET',
    params,
  });
}

export function getBaseTrendList(params: trendReq) {
  return energyRequest<loadList[]>({
    url: '/northwest-peak-shaving/base-load/custLoadTrend',
    method: 'GET',
    params,
  });
}

export function getLoadTrendList(params: trendReq) {
  return energyRequest<loadList[]>({
    url: '/platform/actual-load/custLoadTrend',
    method: 'GET',
    params,
  });
}

export function getDeclareTrendList(params: trendReq) {
  return energyRequest<loadList[]>({
    url: '/northwest-peak-shaving/declare-load/custLoadTrend',
    method: 'GET',
    params,
  });
}

export function getBaseCustLoad4Contribute(params: { peakShavingDate: string }) {
  return energyRequest<loadList[]>({
    url: '/northwest-peak-shaving/base-load/custLoad4Contribute',
    method: 'GET',
    params,
  });
}

export function getDeclareCustLoad4Contribute(params: { peakShavingDate: string }) {
  return energyRequest<loadList[]>({
    url: '/northwest-peak-shaving/declare-load/custLoad4Contribute',
    method: 'GET',
    params,
  });
}

export function getBaseCustLoadTrend4Contribute(params: { beginDate: string; endDate: string }) {
  return energyRequest<loadList[]>({
    url: '/northwest-peak-shaving/base-load/custLoadTrend4Contribute',
    method: 'GET',
    params,
  });
}

export function getDeclareCustLoadTrend4Contribute(params: { beginDate: string; endDate: string }) {
  return energyRequest<loadList[]>({
    url: '/northwest-peak-shaving/declare-load/custLoadTrend4Contribute',
    method: 'GET',
    params,
  });
}

export interface custPeriodElectric {
  custId: number;
  date: string; //日期
  overVal: number; //尖
  highVal: number; //峰
  flatVal: number; //平
  valleyVal: number; //谷
  deepValleyVal: number; //深谷
}

export function getCustPeriodElectric(params: trendReq) {
  return energyRequest<custPeriodElectric[]>({
    url: '/platform/actual-load/custPeriodElectric',
    method: 'GET',
    params,
  });
}

export function getPeriodTimeConfigNote(params: { orgId: number }) {
  return energyRequest<string>({
    url: '/northwest-peak-shaving/common/periodTimeConfigNote',
    method: 'GET',
    params,
  });
}
