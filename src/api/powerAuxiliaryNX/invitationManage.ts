import { energyRequest } from '@/utils/request';

export interface IInviteInfo {
  inviteId: number; //邀约id
  eventCode: string; //事件编码
  eventType: number; //交易类型
  tranVariety: number; //交易类型
  runDate: string; //运行日期
  controlStartTime: string; //调控开始时间
  controlEndTime: string; //调控结束时间
  controlPower: number; //使用量
  curveTime: string; //时间点
}

export function getInviteInfoList(params: {
  pageNo: number;
  pageSize: number;
  startTime: string;
  endTime: string;
  tranVariety: number;
  eventType: number;
}) {
  return energyRequest<{
    records: IInviteInfo[];
    total: number;
  }>({
    url: '/inviteInfoNingXia/page',
    params,
  });
}

export interface IInviteDetail {
  eventType: number; //交易类型
  runDate: string; //运行日期
  curveTime: string; //时间点
  controlPower: number; //需求量
}
export function getInviteDetail(params: { inviteId: number }) {
  return energyRequest<IInviteDetail[]>({
    url: '/inviteInfoNingXia/detailList',
    params,
  });
}
