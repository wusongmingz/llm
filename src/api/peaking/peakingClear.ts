import { IFileResponse, energyRequest } from '@/utils/request';

export function getClearMonthList() {
  return energyRequest<string[]>({
    url: '/peak-shaving-clearing/queryMonthList',
    method: 'GET',
  });
}

export interface ICustOption {
  custId?: number;
  custName?: string;
  orgId?: number;
}

export function getCustOptionList() {
  return energyRequest<ICustOption[]>({
    url: '/cust/nameList',
    method: 'GET',
  });
}

export interface IPeakingClearListReq {
  month?: string;
  type?: number;
  custId?: number;
  pageNo: number;
  pageSize: number;
}

export interface IPeakingClear {
  beginTime: string;
  clearingElectricity: number;
  clearingInfoId: number;
  clearingVal: number;
  endTime: string;
  peakShavingCode: string;
  peakShavingDate: string;
  peakShavingProvName: string;
  peakShavingTypeName: string;
  importTime: string;
  phone: string;
  supportProvNames?: string[];
}

export function getPeakingClearList(params: IPeakingClearListReq) {
  return energyRequest<{
    records?: IPeakingClear[];
    total?: number;
    totalClearVal?: number;
    totalClearingElectricity?: number;
  }>({
    url: '/peak-shaving-clearing/queryInfoPage',
    method: 'GET',
    params,
  });
}

export interface IPeakingClearItem {
  aggregatorOrgName: string;
  clearingVal: number;
  peakShavingDate: string;
  peakShavingTime: string;
  peakShavingTypeName: string;
  supportProvName: string;
}

export function getPeakingClearItemById(clearingInfoId: number) {
  return energyRequest<IPeakingClearItem[]>({
    url: '/peak-shaving-clearing/queryItemList',
    method: 'GET',
    params: { clearingInfoId },
  });
}

export function deletePeakingClearById(clearingInfoId: number) {
  return energyRequest<boolean>({
    url: '/peak-shaving-clearing/removeInfo',
    method: 'GET',
    params: { clearingInfoId },
  });
}

export function getPeakingClearTemplateUrl() {
  return '/resource/template/西北跨省调峰出清详细信息系统导入模板.xls';
}
export function importPeakingClearFile(data: FormData) {
  return energyRequest<number>({
    url: '/peak-shaving-clearing/importInfo',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data,
  });
}

export interface IExportPeakingClearReq {
  month?: string;
  type?: number;
  custId?: number;
}
export function exportPeakingClear(params: IExportPeakingClearReq) {
  return energyRequest<IFileResponse>({
    url: '/peak-shaving-clearing/exportInfo',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}

export function exportPeakingClearItem(params: IExportPeakingClearReq & { clearingInfoId: number }) {
  return energyRequest<IFileResponse>({
    url: '/peak-shaving-clearing/exportInfoById',
    method: 'GET',
    responseType: 'blob',
    params,
  });
}
