import { energyRequest } from '@/utils/mockRequest';
import { IPageInfoParams } from '../type/base';

/**
 * 渠道商相关接口
 */
export interface IChannelBusiness {
  createTime: string;
  updateTime: string;
  id: number;
  name: string;
  shortName: string;
  sellerId: number;
  contactProv: string;
  contactRegion: string;
  contactCounty: string;
  contactAddress: string;
  contactUser: string;
  contactPhone: string;
  bankUser: string;
  bankName: string;
  bankAccount: string;
  payRule: string;
  description: string;
  resource: string;
  sellerName: string;
}

export interface IChannelBusinessPage extends IChannelBusiness {
  contractList: IChannelContract[];
  paymentList: {
    channelBusinessId: number;
    type: number;
    toBePaid: number; //应支付
    paid: number; //已支付
  }[];
}

export interface IGetChannelBusinessPageReq extends IPageInfoParams {
  name?: string;
  sellerId?: number;
  contractStatus?: number;
  year?: number;
}

export function getChannelBusinessList(params: IGetChannelBusinessPageReq) {
  return energyRequest<{ records: IChannelBusinessPage[]; total: number }>({
    url: '/channel-business/page',
    method: 'GET',
    params,
  });
}

export function getChannelBusinessDetail(params: { id: number }) {
  return energyRequest<IChannelBusiness>({
    url: '/channel-business/detail',
    method: 'GET',
    params,
  });
}

export function createChannelBusiness(data: Partial<IChannelBusiness>) {
  return energyRequest<void>({
    url: '/channel-business/add',
    method: 'POST',
    data,
  });
}

export function updateChannelBusiness(data: Partial<IChannelBusiness> & { id: number }) {
  return energyRequest<void>({
    url: '/channel-business/update',
    method: 'POST',
    data,
  });
}

export function deleteChannelBusiness(params: { id: string }) {
  return energyRequest<void>({
    url: '/channel-business/delete',
    method: 'GET',
    params,
  });
}

/**
 * 合同相关接口
 */
export interface IChannelContract {
  createTime: string;
  updateTime: string;
  id: number;
  channelBusinessId: number;
  type: number; //业务，1调峰，2售电
  code: string; //合同编号
  name: string; //合同名称
  cooperationArea: string; //合作区域
  signDate: string; //签约日期
  validateDate: string; //合作周期
  expireDate: string; //合作周期
  status: number; //合同状态, 1正常，2异常
  settleRemarks: string;
  supplementCount: number; //补充协议个数
}

export interface ISupplement {
  createTime: string;
  updateTime: string;
  id: number;
  channelContractId: number;
  code: string; //补充协议编号
  signDate: string; //签约日期
  validateDate: string;
  expireDate: string;
  changeItems: string; //变更项目
  changeContent: string; //变更内容
  settleRemarks: string; // 结算的规则条款信息
  cooperationCycleRemarks: string; // 合作周期的备注信息
  otherRemarks: string; // 其他配置信息
}

export interface IChannelContractWithSupplement extends IChannelContract {
  supplementList?: ISupplement[];
}

export function getChannelContractList(params: { channelBusinessId: number }) {
  return energyRequest<IChannelContractWithSupplement[]>({
    url: '/channel-contract/list',
    method: 'GET',
    params,
  });
}

export interface ISettle {
  settleProvCode: number; // 分地区结算，不分则上传'不限'
  feeRule: number; //渠道费计算规则: 1按聚合商收益分成, 2按总收益分成
  agentFirstRate: number; // 渠道（直接中介）分成比例
  agentFirstTaxRate: number; //  渠道开票税率
  agentSecondRate: number; // 间接渠道分成比例
  agentSecondTaxRate: number; //间接渠道开票税率
  aggregatorIncomeBaseRate: number; // 聚合商保底分成比例
  validateDate: string;
  expireDate: string;
}
export function createChannelContract(data: { contract: Partial<IChannelContract>; settleList: Partial<ISettle>[] }) {
  return energyRequest<void>({
    url: '/channel-contract/add',
    method: 'POST',
    data,
  });
}

export function updateChannelContract(data: Partial<IChannelContract>) {
  return energyRequest<void>({
    url: '/channel-contract/update',
    method: 'POST',
    data,
  });
}

export function obtainChannelContractCode(params: { businessId: number; contractType: number; date: string }) {
  return energyRequest<string>({
    url: '/channel-contract/obtainCode',
    method: 'GET',
    params,
  });
}

/**
 * 补充协议相关接口
 */
export interface IChannelContractSupplement {
  channelContractId: number;
  code: string;
  signDate: string;
  validateDate: string;
  expireDate: string;
  changeItems: string;
  changeContent: string;
  settleRemarks: string;
  cooperationCycleRemarks: string;
  otherRemarks: string;
}

export function createChannelContractSupplement(data: { contractSupplement: Partial<IChannelContractSupplement>; settleList: Partial<ISettle>[] }) {
  return energyRequest<void>({
    url: '/channel-contract-supplement/add',
    method: 'POST',
    data,
  });
}

export function obtainChannelContractSupplementCode(params: { contractId: number; contractType: number; date: string }) {
  return energyRequest<string>({
    url: '/channel-contract-supplement/obtainCode',
    method: 'GET',
    params,
  });
}

/**
 * 结算规则相关接口
 */
export interface IChannelContractSettle {
  id: number;
  contractId: number;
  contractCode: string; //合同编号
  contractType: number; //合作业务
  settleProvCode: number;
  settleProveName: string; //分地区结算
  feeRule: number; //渠道计费规则
  agentFirstRate: number; //渠道（直接中介）分成比例
  agentSecondRate: number; //间接渠道分成比例
  agentFirstTaxRate: number; //渠道开票税率
  agentSecondTaxRate: number; //间接渠道开票税率
  aggregatorIncomeBaseRate: number; //聚合商保底分成比例（按聚合商收益）
  validateDate: string;
  expireDate: string;
}
export function getChannelContractSettleList(params: { channelBusinessId: number }) {
  return energyRequest<IChannelContractSettle[]>({
    url: '/channel-contract/settleList',
    method: 'GET',
    params,
  });
}

/**
 * 渠道合同支付情况
 */
export interface IChannelContractPayment {
  id: number;
  channelBusinessId: number;
  type: number;
  month: string;
  toBePaid: number; //应支付，单位元
  paid: number; //已支付，单位元
}
export function getChannelContractPaymentList(params: { channelBusinessId: number; year: string; type: number }) {
  return energyRequest<IChannelContractPayment[]>({
    url: '/channel-contract/payment',
    method: 'GET',
    params,
  });
}

export function updateChannelContractPaymentList(data: { id: number; channelBusinessId: number; type: number; paid: number }[]) {
  return energyRequest<void>({
    url: '/channel-contract/updatePaid',
    method: 'POST',
    data,
  });
}

/**
 * 排他清单
 */
export function getChannelCustExclusiveList(params: { businessId: number }) {
  return energyRequest<void>({
    url: '/channel-business/custExclusiveList',
    method: 'GET',
    params,
  });
}

export function importChannelCustExclusiveList(data: FormData) {
  return energyRequest<void>({
    url: '/channel-business/importCustExclusive',
    method: 'POST',
    data,
  });
}
