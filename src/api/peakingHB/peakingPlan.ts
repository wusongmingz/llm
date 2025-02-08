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
  clearingType?: number;
  month?: string;
}

export interface addPlanReq {
  peakShavingMode: number;
  peakShavingDate: string;
  dateType: number;
}

export function getPlanList(params: planReq) {
  return energyRequest<{
    records?: plan[];
    total?: number;
  }>({
    url: '/peak-shaving-plan/page',
    method: 'GET',
    params,
  });
}

export function deletePlan(peakShavingDate: string) {
  return energyRequest<undefined>({
    url: '/peak-shaving-plan/removeByDate',
    method: 'GET',
    params: { peakShavingDate: peakShavingDate },
  });
}

export function addPlan(data: addPlanReq) {
  return energyRequest<undefined>({
    url: '/peak-shaving-plan/add',
    method: 'POST',
    data,
  });
}
