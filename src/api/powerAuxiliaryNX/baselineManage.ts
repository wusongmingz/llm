import { energyRequest } from '@/utils/request';
import { IPeakShavingNXReqBase } from './common';

export interface IBaseLoadCustInfo {
  custId: number;
  custName: string;
  custNumber?: string;
  loadSource: number;
  warning: number; // 0 正常，1小于20%，2超过20%
}

export function getBaseLoadCustList(params: IPeakShavingNXReqBase) {
  return energyRequest<IBaseLoadCustInfo[]>({
    url: '/ningxia-peak-shaving/base-load/custList',
    method: 'GET',
    params,
  });
}

export interface ILoadCustLoad {
  time: string;
  loadVal: number;
  clearingFlag: number;
}
// 基线对比
export function getBaseLoadCustLoad(params: IPeakShavingNXReqBase & { custNumber: string }) {
  return energyRequest<ILoadCustLoad[]>({
    url: '/ningxia-peak-shaving/base-load/custLoad',
    method: 'GET',
    params,
  });
}
export function getBaseLoadCustLoad4Contribute(params: IPeakShavingNXReqBase) {
  return energyRequest<ILoadCustLoad[]>({
    url: '/ningxia-peak-shaving/base-load/custLoad4Contribute',
    method: 'GET',
    params,
  });
}
// 计划对比
export function getDeclareLoadCustLoad(params: IPeakShavingNXReqBase & { custNumber: string }) {
  return energyRequest<ILoadCustLoad[]>({
    url: '/ningxia-peak-shaving/declare-load/custLoad',
    method: 'GET',
    params,
  });
}
export function getDeclareLoadCustLoad4Contribute(params: IPeakShavingNXReqBase) {
  return energyRequest<ILoadCustLoad[]>({
    url: '/ningxia-peak-shaving/declare-load/custLoad4Contribute',
    method: 'GET',
    params,
  });
}
// 基线趋势
export function getBaseLoadCustLoadTrend(
  params: Omit<IPeakShavingNXReqBase, 'peakShavingDate'> & { beginDate: string; endDate: string; custNumber: string },
) {
  return energyRequest<ILoadCustLoad[]>({
    url: '/ningxia-peak-shaving/base-load/custLoadTrend',
    method: 'GET',
    params,
  });
}
export function getBaseLoadCustLoadTrend4Contribute(params: Omit<IPeakShavingNXReqBase, 'peakShavingDate'> & { beginDate: string; endDate: string }) {
  return energyRequest<ILoadCustLoad[]>({
    url: '/ningxia-peak-shaving/base-load/custLoadTrend4Contribute',
    method: 'GET',
    params,
  });
}
// 计划趋势
export function getDeclareLoadCustLoadTrend(
  params: Omit<IPeakShavingNXReqBase, 'peakShavingDate'> & { beginDate: string; endDate: string; custNumber: string },
) {
  return energyRequest<ILoadCustLoad[]>({
    url: '/ningxia-peak-shaving/declare-load/custLoadTrend',
    method: 'GET',
    params,
  });
}
export function getDeclareLoadCustLoadTrend4Contribute(
  params: Omit<IPeakShavingNXReqBase, 'peakShavingDate'> & { beginDate: string; endDate: string },
) {
  return energyRequest<ILoadCustLoad[]>({
    url: '/ningxia-peak-shaving/declare-load/custLoadTrend4Contribute',
    method: 'GET',
    params,
  });
}

// 上传基线负荷
export function importBaseLoadFile(data: FormData) {
  return energyRequest<undefined>({
    url: '/ningxia-peak-shaving/base-load/import',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data,
  });
}

export interface IDeclarePlan {
  time: string;
  baseVal: number;
  oriDeclareVal: number;
  declareVal: number;
  actualVal: number;
  peakShavingFlag: number;
  declarePrice: number;
}
// 查询参与调峰用户申报负荷/基线负荷/实时负荷合计
export function getDeclarePlanList(params: IPeakShavingNXReqBase & { custNumbers?: string }) {
  return energyRequest<IDeclarePlan[]>({
    url: '/ningxia-peak-shaving/plan/queryDeclarePlan',
    method: 'GET',
    params,
  });
}

// 下载申报计划模板
export function exportDeclareLoadTemplate(params: IPeakShavingNXReqBase & { custNumber: string }) {
  return energyRequest({
    url: '/ningxia-peak-shaving/declare-load/exportDeclareTemplate',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}
// 导出基线信息
export function exportBaseLoadInfo(params: IPeakShavingNXReqBase & { custNumber?: string }) {
  return energyRequest({
    url: '/ningxia-peak-shaving/plan/exportLoadInfoByCust',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}
// 基线模板
export function getPeakingBaselineTemplateUrl() {
  return '/resource/template/宁夏基线模板.xlsx';
}

// 修改参与调峰用户申报负荷
export interface IDeclareLoadUpload {
  peakShavingDate: string;
  marketType: number;
  tradeType: number;
  custNumber: string;
  time: string;
  declareVal: number;
  declarePrice: number;
}
export function updateDeclareLoad(data: IDeclareLoadUpload) {
  return energyRequest<void>({
    url: '/ningxia-peak-shaving/declare-load/update',
    method: 'POST',
    data,
  });
}
export function updateDeclareLoadBatch(data: FormData) {
  return energyRequest<void>({
    url: '/ningxia-peak-shaving/declare-load/batchUpdate',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data,
  });
}
