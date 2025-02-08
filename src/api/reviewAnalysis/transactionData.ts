import { energyRequest } from '@/utils/request';

export interface IGetReviewTaskReq {
  taskName?: string;
  tradeType?: string;
  taskStatus?: number;
  pageNo: number;
  pageSize: string;
}

export interface IReviewTask {
  createdAt?: string; // 任务创建时间
  dataType?: string; // 采集数据项（逗号分隔）1-中长期交易结果2-日滚动交易结果3-现货交易日结算信息
  id?: string;
  infoDateEnd?: string; // 任务范围
  infoDateStart?: string; // 任务范围
  opId?: string; // 创建人ID
  opName?: string; // 创建人名称
  taskName?: string; // 任务名称
  taskProcess?: string; // 任务进度（百分比）
  taskStatus?: string; // 任务状态0-待执行；1-执行中；2-已完成
  taskToken?: string; // 采集数据需要的token
  tokenStatus?: string; // token状态0-失效，1-有效
  updatedAt?: string; // 任务修改时间
}

export function getReviewTaskList(params: IGetReviewTaskReq) {
  return energyRequest<{ total: number; records: IReviewTask[] }>({
    url: '/review/pageTask',
    method: 'GET',
    params,
  });
}

export function addReviewTask(data: IReviewTask) {
  return energyRequest<void>({
    url: '/review/addTask',
    method: 'POST',
    data,
  });
}

export function updateReviewTaskToken(data: IReviewTask) {
  return energyRequest<void>({
    url: '/review/updateTaskToken',
    method: 'POST',
    data,
  });
}

interface IGetSettlementReq {
  startDate: string;
  endDate: string;
  unitName?: string;
  periodType?: string;
  pageNo: number;
  pageSize: number;
}
interface ISettlement {
  actualMarketPrice?: number; // 实时市场电价
  actualPowerConsumption?: number; // 实际用电量
  clearingElecBTheDay?: number; // 日前出清电量
  currentNegativeSpotTariff?: number; // 日前负偏差电费
  currentSpotTariff?: number; // 日前正偏差电费
  dataDate: string; // 日期
  dataTime: string; // 时刻
  dayAheadMarketPrice?: number; // 日前市场电价
  malElecSettle?: number; // 中长期结算电量
  negativeSportPower?: number; // 日前负偏差电量
  nowspotNegativePower?: number; // 实时负偏差电量
  nowspotNegativeTariff?: number; // 实时负偏差电非
  nowspotPositivePower?: number; // 实时正偏差电量
  nowspotPositiveTariff?: number; // 实时正偏差电费
  pssitiveSpotPower?: number; // 日前正偏差电量
  recoveryFromexcessProfits?: number; // 超额获利回收电费
  userunitName: string; // 用户名称
  month: number;
  day: number;
  hour: string;
  period1: string;
  period2: string;
}
export function getSettlementList(params: IGetSettlementReq) {
  return energyRequest<{ records: ISettlement[]; total: number }>({
    url: '/review/pageSettlement',
    method: 'GET',
    params,
  });
}

export function importSettlement(data: FormData) {
  return energyRequest<{
    startDate: string;
    endDate: string;
  }>({
    url: '/review/importDailySettlement',
    method: 'POST',
    data,
  });
}

export function getSettlementTemplateUrl() {
  return '/resource/template/企业名称MM.DD日结算表.xlsx';
}

export function getCustomerList() {
  return energyRequest<
    {
      id: number;
      customerName: string;
      area: number;
      riskType: number;
      capacity: number;
      declareUpperLimit: number;
    }[]
  >({
    url: '/review/billCustomerList',
    method: 'GET',
  });
}
