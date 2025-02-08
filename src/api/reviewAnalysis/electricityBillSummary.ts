import { energyRequest } from '@/utils/request';

export interface list {
  billId: number;
  customerId: string;
  billMonth: string;
  purchaseType: number;
  totalElectricity: number;
  peakElectricity: number;
  flatElectricity: number;
  valleyElectricity: number;
  capacityCounted: number;
  capacityPrice: number;
  capacityDemandFee: number;
  requireMax: number;
  requirePrice: number;
  requireFee: number;
  totalFee: number;
  nonmarketFee: number;
  onlineFee: number;
  sysRunFee: number;
  serviceFee: number;
  transAllocateFee: number;
  govFundsFee: number;
  lineDamageFee: number;
  powerFactorAdjustFee: number;
  deditFee: number;
  midlongElectricity: number;
  dayaheadElectricity: number;
  realtimeElectricity: number;
  fixedElectricity: number;
  midlongFee: number;
  dayaheadFee: number;
  realtimeFee: number;
  fixedFee: number;
  tradeElectricity: number;
  tradeFee: number;
  deviationEarn: number;
  positionRatio: number;
  midlongAvgPrice: number;
  tradeAvgPrice: number;
  earnIncludedAvgPrice: number;
  avgServiceFee: number;
  customerAvgPrice: number;
}

export function getBillAnalysis(params: { customerId: string; billMonth: string; feeType: number }) {
  return energyRequest<{ tableList: list[]; midLongGraphList: list[]; spotGraphList: list[] }>({
    url: '/review/billAnalysis',
    method: 'GET',
    params,
  });
}
