import { IFileResponse, energyRequest } from '@/utils/request';

export interface IPeakingPrice {
  aggregatorOrgId: number; //聚合商组织id
  createTime: string; //创建时间
  id: number; //价格id
  peakShavingType: 1 | 2; //调峰类型，1：日前调峰、2：日内调峰
  price: number; //单价，单位厘/千瓦时
  updateTime: string; //提交时间
}

export function getPeakingPriceList() {
  return energyRequest<IPeakingPrice[]>({
    url: '/peak-shaving/priceList',
    method: 'GET',
  });
}

export function updatePeakingPrice(data: { priceId: number; priceVal: number }) {
  return energyRequest<undefined>({
    url: '/peak-shaving/modifyPrice',
    method: 'POST',
    data,
  });
}

export function importActualLoadFile(data: FormData) {
  return energyRequest<string>({
    url: '/northwest-peak-shaving/actual-load/import',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data,
  });
}

export function getActualLoadTemplateUrl() {
  return '/resource/template/西北跨省调峰出清天实际负荷导入模板.xlsx';
}

export interface IActualLoad {
  importTime: string;
  custId: number;
  custName: string; // 企业名称
  foreignId: string; // 企业编号
  peakShavingDate: string; // 调峰日期
  phone: string;
  powerList: PowerList[];
  provCode: number;
  provName: string; //企业省份
}

export interface PowerList {
  powerVal?: number; //负荷，单位w
  time: string; //时间
}

export function getActualLoadList(params: { peakShavingDate: string }) {
  return energyRequest<IActualLoad[]>({
    url: '/northwest-peak-shaving/actual-load/list4Import',
    method: 'GET',
    params,
  });
}

export interface IGetPeakingMontorReq {
  peakShavingDate: string;
  peakShavingType: 1 | 2;
}
export interface IPeakingMontorOverview {
  // aggregatorIncome: number;
  beginTime: string;
  clearingVal: number;
  custCount: number;
  endTime: string;
  peakShavingCode: string;
  peakShavingDate: string;
  peakShavingType: number;
  peakShavingTypeName: string;
  peakShavingVal: number;
  income: number; //：预计收益，单位厘
  appraisePeakShavingVal: number; //：考核调峰量，单位w
  appraiseIncome: number; //：考核收益，单位厘
  totalCustCount: number; // 用户总数
  targetIncome: number; // 目标收益，单位厘
  forecastTime: string; // 调峰监测数据生成时间
}
export function getPeakingMontorOverview(params: IGetPeakingMontorReq) {
  return energyRequest<IPeakingMontorOverview>({
    url: '/northwest-peak-shaving/detection/general',
    method: 'GET',
    params,
  });
}

export interface IPeakingMontor {
  actualVal: number;
  baseVal: number;
  clearingVal: number;
  declareVal: number;
  income: number;
  peakShavingVal: number;
  time: string;
  appraisePeakShavingVal: number;
  appraiseIncome: number;
}
export function getPeakingMontorList(params: IGetPeakingMontorReq) {
  return energyRequest<IPeakingMontor[]>({
    url: '/northwest-peak-shaving/detection/items',
    method: 'GET',
    params,
  });
}

export interface IPeakingMontorWithProv {
  actualVal: number;
  baseVal: number;
  clearingVal: number;
  declareVal: number;
  income: number;
  peakShavingVal: number;
  time: string;
  peakShavingDate: string;
  peakShavingType: 1 | 2;
  supportProvName: string;
  appraisePeakShavingVal: number;
  appraiseIncome: number;
  earlyWarning: -1 | 1 | 2 | 3;
}
export function getPeakingMontorListByProv(params: IGetPeakingMontorReq) {
  return energyRequest<IPeakingMontorWithProv[]>({
    url: '/peak-shaving/detection/itemsByProv',
    method: 'GET',
    params,
  });
}

export function exportPeakingMontorList(params: IGetPeakingMontorReq) {
  return energyRequest<IFileResponse>({
    url: '/peak-shaving/detection/exportItemsByProv',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}

// 收益测算
export interface IPeakingIncome {
  id: number; // incomeId, 用于收益测算明细接口
  custName: string; //企业名称
  declareVal: number; //计划负荷
  baseVal: number; //基线
  actualVal: number; //实际负荷
  peakShavingVal: number; //调峰量
  appraisePeakShavingVal: number; //预测考核调峰量
  appraiseIncome: number; // 预测调峰考核收益
  appraiseCustIncome: number; //测算收益分成（企业）
  appraiseAggregatorIncome: number; // 测算收益分成（聚合商）
  shareRatio: number; // 合同企业分成比例
  createTime: string;
  updateTime: string;
  aggregatorOrgId: number;
  peakShavingDate: string;
  peakShavingType: number;
  custId: number;
  peakShavingElectricity: number;
  clearingBeginTime: string;
  clearingEndTime: string;
  clearingVal: number;
  clearingElectricity: number;
  price: number;
  income: number;
  aggregatorIncome: number;
  custIncome: number;
  clearingDuration: number;
  targetIncome: number;
  proportionPeakShavingVal: number;
}

export function getPeakingIncomeList(params: IGetPeakingMontorReq) {
  return energyRequest<IPeakingIncome[]>({
    url: '/northwest-peak-shaving/forecast/custIncome',
    method: 'GET',
    params,
  });
}

export function exportPeakingIncomeList(params: IGetPeakingMontorReq) {
  return energyRequest<IFileResponse>({
    url: '/northwest-peak-shaving/forecast/exportCustIncome',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}

export interface IPeakingIncomeItem {
  actualVal: number;
  aggregatorIncome: number;
  appraiseAggregatorIncome: number;
  appraiseCustIncome: number;
  appraiseIncome: number;
  appraisePeakShavingVal: number;
  baseVal: number;
  clearingElectricity: number;
  clearingTime: string;
  clearingVal: number;
  createTime: string;
  custIncome: number;
  declareVal: number;
  id: number;
  income: number;
  incomeId: number;
  peakShavingElectricity: number;
  peakShavingVal: number;
  price: number;
  proportion: number;
  shareRatio: number;
  targetIncome: number;
  totalAppraiseIncome: number;
  totalAppraisePeakShavingVal: number;
  totalPeakShavingVal: number;
  updateTime: string;
  proportionPeakShavingVal: string;
  totalProportionPeakShavingVal: string;
}
export function getPeakingIncomeItem(params: { incomeId: number }) {
  return energyRequest<IPeakingIncomeItem[]>({
    url: '/northwest-peak-shaving/forecast/custIncomeItem',
    method: 'GET',
    params,
  });
}
export function exportPeakingIncomeItem(params: { incomeId: number }) {
  return energyRequest<IFileResponse>({
    url: '/northwest-peak-shaving/forecast/exportCustIncomeItem',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}

export function getPeakingSupportProvList(params: IGetPeakingMontorReq) {
  return energyRequest<string[]>({
    url: '/northwest-peak-shaving/clearing/supportProvNameList',
    method: 'GET',
    params,
  });
}

export interface IPeakingWarningUser {
  custId: number;
  custName: string;
  earlyWarning: number;
}
export function getPeakingWarningUserList(params: IGetPeakingMontorReq) {
  return energyRequest<IPeakingWarningUser[]>({
    url: '/northwest-peak-shaving/early-warning/custInfos',
    method: 'GET',
    params,
  });
}

export interface IPeakingWarning {
  custName: string;
  actualVal: number;
  baseVal: number;
  clearingTime: string;
  clearingVal: number;
  custId: number;
  declareVal: number;
  earlyWarning: number;
  noticeTime: string;
  noticeUsers?: string[];
  peakShavingVal: number;
}

export function getPeakingWarningList(params: IGetPeakingMontorReq & { peakShavingTime: string }) {
  return energyRequest<(IPeakingWarning & { custName: string })[]>({
    url: '/northwest-peak-shaving/early-warning/itemListByTime',
    method: 'GET',
    params,
  });
}
