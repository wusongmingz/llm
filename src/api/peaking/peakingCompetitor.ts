import { energyRequest } from '@/utils/request';

export function getCompetitorPriceList() {
  return energyRequest<{ name: string; price: number }[]>({
    url: '/competitor/price',
    method: 'GET',
  });
}

export function getUploadedDate(params: { month: string }) {
  return energyRequest<string[]>({
    url: '/competitor/importdays',
    method: 'GET',
    params,
  });
}

export function getUploadedInfo(params: { importDate: string }) {
  return energyRequest<IUploadInfo>({
    url: '/competitor/importdetail',
    method: 'GET',
    params,
  });
}

export interface ICompetitorAnalysisReq {
  month: string;
  compMonths: string[];
}

export function getCompetitorCompanyList() {
  return energyRequest<{ id: number; companyName: string }[]>({
    url: '/competitor/company',
    method: 'GET',
  });
}

export interface ICompetitorAnalysis {
  id: number;
  competitorName: string;
  companyName: string;
  companyShort: string;
  competitorShort: string;
  month: string;
  actionDays: number;
  clearingPower: number;
  forecastIncome: number;
  incomeRate: number;
}
export function getCompetitorAnalysisList(params: ICompetitorAnalysisReq) {
  return energyRequest<{
    compMonthList: ICompetitorAnalysis[];
    currMonthList: ICompetitorAnalysis[];
  }>({
    url: '/competitor/analysis',
    method: 'GET',
    params: {
      month: params.month,
      compMonths: params.compMonths.toString(),
    },
  });
}

export function saveCompetitorAnalysisList(data: ICompetitorAnalysis[]) {
  return energyRequest<void>({
    url: '/competitor/saveAnalysis',
    method: 'POST',
    data,
  });
}

export interface IUploadInfo {
  fileName: string;
  createdAt: string;
  opName: string;
  infoDate: string;
}
export function importClearing(data: FormData) {
  return energyRequest<IUploadInfo>({
    url: '/competitor/importClearing',
    method: 'POST',
    data,
  });
}

export interface IComparisonIncome {
  id: number;
  companyName: string;
  companyShort: string;
  month: string;
  supportProvince: string;
  actionPower: number;
  actionIncome: number;
  clearingPower: number;
  actionPercent: number;
}
export function getComparisonIncomeList(params: { month: string }) {
  return energyRequest<IComparisonIncome[]>({
    url: '/competitor/income4edit',
    method: 'GET',
    params,
  });
}

export function saveComparisonIncomeList(data: IComparisonIncome[]) {
  return energyRequest<void>({
    url: '/competitor/saveIncome',
    method: 'POST',
    data,
  });
}

export function getComparisonIncomeMonthlyList(params: ICompetitorAnalysisReq & { province: string }) {
  return energyRequest<{
    allSumList: IComparisonIncome[];
    compMonthList: IComparisonIncome[];
  }>({
    url: '/competitor/incomestat',
    method: 'GET',
    params: {
      month: params.month,
      compMonths: params.compMonths.toString(),
      province: params.province,
    },
  });
}
