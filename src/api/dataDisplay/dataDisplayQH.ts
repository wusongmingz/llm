import { energyRequest } from '@/utils/request';

export interface ILargeScreenCust {
  custId: number; //客户id
  custName: string; //客户名称
  custType: number;
  custTypeName: string; // 客户类型
  custSegment: number;
  custSegmentName: string; //电压等级
  longitude: string; // 经纬度
  latitude: string; // 经纬度
  elecConsumeScale: number;
}
export interface ILargeScreenDetail {
  custCount: number; //企业数量
  elecConsumeScale: number; //年用电规模
  peakShavingIncome: number; //本年调峰电量
  peakShavingElecVal: number; //本年调峰收益
  custList: ILargeScreenCust[];
}

export function getLargeScreenDetail() {
  return energyRequest<ILargeScreenDetail>({
    url: '/largeScreen/qinghai/detail',
    method: 'GET',
  });
}

export function getRealtimeLoad(params: { custIds: string }) {
  return energyRequest<number>({
    url: '/largeScreen/qinghai/realtimeLoad',
    method: 'GET',
    params,
  });
}

export function getCustLatestLoad(params: { custId: number }) {
  return energyRequest<{ time: string; loadVal: number }[]>({
    url: '/largeScreen/qinghai/custLatestLoad',
    method: 'GET',
    params,
  });
}

export interface ICustLoad {
  time: string;
  loadVal: number; //实时负荷,单位w
  d7avg: number; //七日均值，单位w
  lastD7avg: number;
  lastLoadVal: number;
  peakShavingCapacity: number; // 调节能力
}
// 实时负荷
export function getCustLoadList(params: { custId: number; date: string }) {
  return energyRequest<ICustLoad[]>({
    url: '/largeScreen/qinghai/custLoad',
    method: 'GET',
    params,
  });
}
// 购电信息
export interface IElecPurchase {
  id: number;
  month: number; // 月份
  time: string; //时间
  periodType: number; //1尖峰，2峰，3平，4谷，5深谷
  voltageLevelLower: number;
  voltageLevelUpper: number;
  price: number; //价格，单位元
}
export function getElecPurchaseList(params: { custSegment: string; month: string }) {
  return energyRequest<IElecPurchase[]>({
    url: '/largeScreen/qinghai/elecPurchaseInfo',
    method: 'GET',
    params,
  });
}

// 购电信息
export interface IElecPrice {
  time: string; //时间
  price: number; //实时市场价格价格
}
export function getElecPriceList(params: { date: string }) {
  return energyRequest<IElecPrice[]>({
    url: '/largeScreen/qinghai/elecPrice',
    method: 'GET',
    params,
  });
}

// 按日统计电量
export interface ICustElecVal {
  createTime: string;
  updateTime: string;
  id: number;
  custId: number;
  date: string; //日期
  overVal: number; //尖
  highVal: number; //峰
  flatVal: number; //平
  valleyVal: number; //谷
  deepValleyVal: number; //深谷
  avgPrice: number; // 均价，单位元
}
export function getCustElecValList(params: { custId: number; beginDate: string; endDate: string }) {
  return energyRequest<ICustElecVal[]>({
    url: '/largeScreen/qinghai/custElecValByDate',
    method: 'GET',
    params,
  });
}

export interface ICustElecFee {
  id: number;
  custId: number;
  month: string;
  elecVal: number; // 电量，单位kWh
  fee: number; //费用，单位元
}
export function getCustElecFeeList(params: { custId: number; beginMonth: string; endMonth: string }) {
  return energyRequest<ICustElecFee[]>({
    url: '/largeScreen/qinghai/elecFee',
    method: 'GET',
    params,
  });
}
