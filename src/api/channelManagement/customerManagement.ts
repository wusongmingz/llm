import { energyRequest } from '@/utils/request';

export interface IAlarm {
  custId: number;
  custName: string;
  contractId: number;
  contractName: string;
  expireDate: string;
}

export function getList4Alarm() {
  return energyRequest<IAlarm[]>({
    url: '/channel-cust-contract/list4Alarm',
    method: 'GET',
  });
}

export interface IPrice {
  id: number;
  aggregatorOrgId: number;
  aggregatorOrgName: string;
  peakShavingType: number;
  price: number;
}

export function getPriceList() {
  return energyRequest<IPrice[]>({
    url: '/peak-shaving/priceList',
    method: 'GET',
  });
}

export interface ICustReq {
  custName: string;
  provCode: number | string;
  marketManagerId: number | string;
  pageNo: number;
  pageSize: number;
}

export interface IChannelCust {
  custId: number;
  custName: string;
  shortName: string;
  provCode: number;
  provName: string;
  bizType: number;
  marketManagerId: number;
  marketManagerName: string;
  elecConsume: number;
  capacity: number;
  voltage: number;
  contactProv: string;
  contactRegion: string;
  contactCounty: string;
  contactAddress: string;
  contactUser: string;
  contactPhone: string;
  accessNetwork: number;
  accessDate: string;
  accessRemark: string;
  contractList: IContract[];
}

export interface IContract {
  createTime: string;
  updateTime: string;
  id: number;
  custId: number;
  type: number;
  code: string;
  name: string;
  signDate: string;
  validateDate: string;
  expireDate: string;
  paperNum: number;
  totalIncomeAggregatorRate: number;
  status: number;
  source: number;
  returnFeeRate: number;
  firstChannelBusinessId: number;
  firstChannelBusinessName: string;
  firstChannelBusinessRate: number;
  firstChannelBusinessTaxRate: number;
  secondChannelBusinessId: number;
  secondChannelBusinessName: string;
  secondChannelBusinessRate: number;
  secondChannelBusinessTaxRate: number;
  firstChannelContractCode: string;
  aggregatorIncomeAggregatorRate: number;
  custRate: number;
}

export function getChannelCustList(params: ICustReq) {
  return energyRequest<{ records: IChannelCust[]; total: number }>({
    url: '/channel-cust/page',
    method: 'GET',
    params,
  });
}

export interface IPeakShavingInfo {
  month: string;
  updateTime: string;
  electricityVal: number;
  custSettleIncome: number;
  aggregatorSettleIncome: number;
}

export function getPeakShavingInfoList(params: { custId: number; year: number }) {
  return energyRequest<IPeakShavingInfo[]>({
    url: '/channel-cust-contract/peakShavingInfoList',
    method: 'GET',
    params,
  });
}

export interface ICustContract {
  createTime: string;
  updateTime: string;
  id: number;
  custId: number;
  type: number;
  code: string;
  name: string;
  signDate: string;
  validateDate: string;
  expireDate: string;
  paperNum: number;
  totalIncomeAggregatorRate: number;
  status: number;
  source: number;
  returnFeeRate: number;
  firstChannelBusinessId: number;
  firstChannelBusinessName: string;
  firstChannelBusinessRate: number;
  firstChannelBusinessTaxRate: number;
  secondChannelBusinessId: number;
  secondChannelBusinessName: string;
  secondChannelBusinessRate: number;
  secondChannelBusinessTaxRate: number;
  firstChannelContractCode: string;
  aggregatorIncomeAggregatorRate: number;
  custRate: number;
}

export function getChannelCustContractList(params: { custId: number }) {
  return energyRequest<ICustContract[]>({
    url: '/channel-cust-contract/list',
    method: 'GET',
    params,
  });
}

export function createChannelCustContract(data: Partial<ICustContract>) {
  return energyRequest<void>({
    url: '/channel-cust-contract/add',
    method: 'POST',
    data,
  });
}

export function updateChannelCustContract(data: Partial<ICustContract> & { id: number }) {
  return energyRequest<void>({
    url: '/channel-cust-contract/update',
    method: 'POST',
    data,
  });
}

export interface ICalculateRate {
  custId: number;
  contractType: number;
  totalIncomeAggregatorRate: number;
  firstBusinessId: number;
  secondBusinessId?: number;
}

export function getCalculateRate(params: { custId: number }) {
  return energyRequest<{ agentFirstRate: number; agentSecondRate: number; aggregatorIncomeAggregatorRate: number }>({
    url: '/channel-cust-contract/calculateRate',
    method: 'GET',
    params,
  });
}

export function getObtainCode(params: { custId: number }) {
  return energyRequest<void>({
    url: '/channel-cust-contract/obtainCode',
    method: 'GET',
    params,
  });
}

export interface ICust {
  custId: number;
  custName: string;
  shortName: string;
  provCode: number;
  bizType: number;
  marketManagerId: number;
  elecConsume: number;
  capacity: number;
  voltage: number;
  contactProv: string;
  contactRegion: string;
  contactCounty: string;
  contactAddress: string;
  contactUser: string;
  contactPhone: string;
  accessNetwork: number;
  accessDate: string;
  accessRemark: string;
  provName: string;
  contactPlace?: any[];
}

export function getCustDetail(params: { custId: number }) {
  return energyRequest<ICust>({
    url: '/channel-cust/detail',
    method: 'GET',
    params,
  });
}

export function createChannelCust(data: Partial<ICust>) {
  return energyRequest<void>({
    url: '/channel-cust/add',
    method: 'POST',
    data,
  });
}

export function updateChannelCust(data: Partial<ICust>) {
  return energyRequest<void>({
    url: '/channel-cust/update',
    method: 'POST',
    data,
  });
}

export function delChanneCust(params: { custId: number }) {
  return energyRequest<ICust>({
    url: '/channel-cust/delete',
    method: 'GET',
    params,
  });
}

export function getChanneCostList(params: { month: string }) {
  return energyRequest<{ aggregatorId: number; aggregatorName: string; itemList: ICustContract[] }[]>({
    url: '/channel-cost-analysis/reportList',
    method: 'GET',
    params,
  });
}
