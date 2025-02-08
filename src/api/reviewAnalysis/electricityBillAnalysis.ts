import { energyRequest } from '@/utils/request';

export interface billTree {
  customerId: number;
  customerName: string;
  purchaseType?: number;
  billMonth?: string;
  billId?: string;
  foreignId?: string;
  billImgId?: string;
  updatedAt?: string;
  children?: billTree[];
}

export function getBillTree() {
  return energyRequest<billTree[]>({
    url: '/review/billTree',
    method: 'GET',
  });
}

export interface customerList {
  id: number;
  customerName: string;
  area: number;
  riskType: number;
  capacity: number;
  declareUpperLimit: number;
}

export function getBillCustomerList() {
  return energyRequest<customerList[]>({
    url: '/review/billCustomerList',
    method: 'GET',
  });
}

export interface bill {
  id: number;
  aggregatorOrgId: number;
  foreignId: string;
  customerId: number;
  feeUnit: string;
  customerType: number;
  currentType: number;
  voltageLevel: string;
  billMonth: string;
  beginDate: string;
  endDate: string;
  readingDate: string;
  purchaseType: number;
  manager: string;
  address: string;
  totalFee: number;
  nonmarketFee: number;
  onlineFee: number;
  lineDamageFee: number;
  transAllocateFee: number;
  sysRunFee: number;
  powerFactorAdjustFee: number;
  govFundsFee: number;
  serviceFee: number;
  refundFee: number;
  deditFee: number;
  deductFee: number;
  payFee: number;
  balance: number;
  sumFeeStr: string;
  sumFee: number;
  capacityCounted: number;
  capacityPrice: number;
  capacityDemandFee: number;
  requireLoadRate: number;
  requireMax: number;
  requirePrice: number;
  requireFee: number;
  imageKey: string;
  ocrId: number;
  createBy: number;
  updateBy: number;
  createTime: string;
  updateTime: string;
}

export interface pointList {
  id: number;
  billId: number;
  pointCode: string;
  pointName: string;
  pointPrice: string;
  marketType: string;
  periodType: number;
  electricity: number;
}

export interface agentList {
  id: number;
  billId: number;
  periodType: number;
  agentPriceName: string;
  agentPrice: number;
  electricity: number;
  agentFee: number;
}

export interface spotList {
  id: number;
  billId: number;
  dayaheadElectricity: number;
  dayaheadFee: number;
  realtimeElectricity: number;
  realtimeFee: number;
  midlongElectricity: number;
  midlongFee: number;
  fixedElectricity: number;
  fixedFee: number;
  tradeElectricity: number;
  tradeFee: number;
}

export interface midlongList {
  id: number;
  billId: number;
  periodType: number;
  tradePrice: number;
  productionElectricity: number;
  contractElectricity: number;
  tradeElectricity: number;
  tradeFee: number;
  overElectricity: number;
  overFee: number;
  deviationElectricity: number;
  deviationFee: number;
  greenValueFee: number;
}

export interface transSum {
  id: number;
  billId: number;
  priceName: string;
  periodType: number;
  tradePrice: number;
  marketType: string;
  transElectricity: number;
  transFee: number;
}

export interface billDetailType {
  bill: bill;
  pointList: pointList[];
  agentList?: agentList[];
  agentSum?: agentList;
  spotList?: [];
  midlongList?: midlongList[];
  midlongSum?: midlongList;
  midlongSumFee?: number | string;
  transSum?: transSum;
  transList?: transSum[];
}

export function getBillDetail(billId: string) {
  return energyRequest<billDetailType>({
    url: '/review/billDetail',
    method: 'GET',
    params: { billId: billId },
  });
}

export function getBillOcrResult(ocrId: string) {
  return energyRequest<{ ocrStatus: number; ocrResult: string }>({
    url: '/review/queryBillOcrResult',
    method: 'GET',
    params: { ocrId: ocrId },
  });
}

export function saveBill(data: Partial<billDetailType>) {
  return energyRequest<undefined>({
    url: '/review/saveBill',
    method: 'POST',
    data,
  });
}

export function submitBillImgs(data: FormData) {
  return energyRequest<{ ocrId: string; imageKey: string }>({
    url: '/review/submitBillImgs',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data,
  });
}
