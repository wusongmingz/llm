import { energyRequest } from '@/utils/request';

export interface custObj {
  custId: number;
  custName: string;
  baseValImportFlag: number;
  basicValImportFlag: number;
}

export interface custInfoReq {
  peakShavingDate: string;
  resSegment?: number;
}

export interface loadInfoReq {
  peakShavingDate: string;
  resSegment?: number;
  custId?: number;
}

export interface loadInfoRes {
  time: string;
  basicVal: number;
  baseVal: number;
  declareVal: number;
  actualVal: number;
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

export interface basicLoadRes {
  userId: number;
  userName: string;
  importTime: string;
}

export interface periodsRes {
  id: number;
  name: string;
  beginTime: string;
  endTime: string;
  createTime: string;
  basicLoadFlag: number;
}

export function getBaseLineType(peakShavingDate: string) {
  return energyRequest<undefined>({
    url: '/peak-shaving-plan-load/baseLineType',
    method: 'GET',
    params: { peakShavingDate: peakShavingDate },
  });
}

export function getPeriods() {
  return energyRequest<periodsRes[]>({
    url: '/peak-shaving-basic-load/queryPeriods',
    method: 'GET',
  });
}

export function getCustInfo(params: custInfoReq) {
  return energyRequest<custObj[]>({
    url: '/peak-shaving/custInfo',
    method: 'GET',
    params,
  });
}

export function getLoadInfo(params: loadInfoReq) {
  return energyRequest<loadInfoRes[]>({
    url: '/peak-shaving-plan-load/queryLoadInfo',
    method: 'GET',
    params,
  });
}

export function getBasicLoadDetailInfo(peakShavingDate: string) {
  return energyRequest<basicLoadRes>({
    url: '/peak-shaving-basic-load/queryBasicLoadDetail',
    method: 'GET',
    params: { peakShavingDate: peakShavingDate },
  });
}

export function updateLoadInfo(data: loadInfoUpdate) {
  return energyRequest<undefined>({
    url: '/peak-shaving-declareload/updateLoadInfo',
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
    url: '/peak-shaving-basic-load/importBasicLoad',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data,
  });
}

export function getPeakingPlanTemplateUrl() {
  return '/resource/template/基线模板.xlsx';
}

export function exportPeakDeclarePlan(params: loadInfoReq) {
  return energyRequest({
    url: '/peak-shaving-plan-load/exportDeclarePlan',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}
