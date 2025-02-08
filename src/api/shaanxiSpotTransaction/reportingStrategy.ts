import { energyRequest } from '@/utils/request';

export interface areaList {
  id: number;
  provCode: number;
  areaCode: number;
  areaName: string;
}

export interface custList {
  id: number;
  area: number;
  customerName: string;
  riskType: number;
  capacity: number;
  declareUpperLimit: number;
}

export interface listByGroupId {
  id: number;
  groupId: number;
  riskType: number;
  priceForecastModel: number;
  province: string;
  area: number;
  infoDate: string;
  infoTime: string; //时段
  segment: number; // 报价段
  startCoefficient: number; //开始系数
  endCoefficient: number; //结束系数
  price: number; //电价
  createdAt: string;
  updatedAt: string;
}

export interface strategyBacktestingReq {
  areaCode: number;
  riskType: number;
  date: string;
}

export interface strategyBacktestingRes {
  id: number;
  source: number;
  strategyAdjustGroupId: number;
  date: string;
  area: number;
  custId: number;
  priceForecastModel: 2 | 3 | 4;
  strategy: 1 | 2;
  riskType: 1 | 2 | 3;
  strategyGroupId: number;
  rate: number;
  unitLoss: number;
  submit: number;
  approve: number;
  createDt: string;
  createBy: number;
  updateDt: string;
  updateBy: number;
}

export function getAreaList() {
  return energyRequest<areaList[]>({
    url: '/electric-spots/common/areaList',
    method: 'GET',
  });
}

export function getCustList(params: { areaCode: number }) {
  return energyRequest<custList[]>({
    url: '/electric-spots/common/custList',
    method: 'GET',
    params,
  });
}

export function getStrategyBacktesting(params: strategyBacktestingReq) {
  return energyRequest<strategyBacktestingRes[]>({
    url: '/electric-spots/bid-strategy/strategyBacktesting',
    method: 'GET',
    params,
  });
}

export function getListByGroupId(params: { strategyGroupId: number; areaCode: number }) {
  return energyRequest<listByGroupId[]>({
    url: '/electric-spots/bid-strategy/listByGroupId',
    method: 'GET',
    params,
  });
}

export function getBiddingStrategyTemplateUrl() {
  return '/resource/template/LSTM日前申报策略_区域_YYYYMMDD_导入模板.xlsx';
}

export function importBiddingStrategyFile(data: FormData) {
  return energyRequest<number>({
    url: '/tradeinfo/importDayaheadStrategy',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data,
  });
}
