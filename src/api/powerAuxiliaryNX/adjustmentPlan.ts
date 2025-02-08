import { energyRequest } from '@/utils/request';
import { IPageInfoParams } from '../type/base';

export interface plan {
  peakShavingDate: string;
  peakShavingCode: string;
  dateType: number;
  custNum: number;
  baseLoadFlag: number;
  clearingNextdayFlag: number;
  clearingCurdayFlag: number;
  actualLoadFlag: number;
  forecastIncomeFlag: number;
  createTime: string;
}

export interface planReq extends IPageInfoParams {
  clearingType?: number; //可删除 todoyeyc
  month?: string;
  marketType?: number;
  tradeType?: number;
}

export interface addPlanReq {
  marketType: number;
  tradeType: number;
  baseLoadDateType: number;
  declarePrice: number;
  peakShavingDate: string;
}

export function getPlanList(params: planReq) {
  return energyRequest<{
    records?: plan[];
    total?: number;
  }>({
    url: '/ningxia-peak-shaving/plan/profilePage',
    method: 'GET',
    params,
  });
}

export function deletePlan(planId: number) {
  return energyRequest<undefined>({
    url: '/ningxia-peak-shaving/plan/remove',
    method: 'GET',
    params: { planId: planId },
  });
}

export function addPlan(data: addPlanReq) {
  return energyRequest<undefined>({
    url: '/ningxia-peak-shaving/plan/add',
    method: 'POST',
    data,
  });
}
