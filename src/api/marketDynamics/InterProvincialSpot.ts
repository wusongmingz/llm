import { energyRequest } from '@/utils/request';

export function getChannelList() {
  return energyRequest<string[]>({
    url: '/tradeinfo/channellist',
    method: 'GET',
  });
}

export interface IInterProvincialSpotReq {
  date: string;
  province: string;
}

export interface IChannelPower {
  id: number;
  elecChannel: string;
  infoTime: string;
  dayaheadChanelPower: number;
  intradayChannelPower: number;
}
export function getChannelPowerList(params: IInterProvincialSpotReq & { channel: string; business: number }) {
  return energyRequest<IChannelPower[]>({
    url: '/tradeinfo/channelpower',
    method: 'GET',
    params,
  });
}

export interface IElecBalance {
  infoTime: string;
  elecBalanceInfo: string;
}
export function getElecBalanceList(params: IInterProvincialSpotReq) {
  return energyRequest<IChannelPower[]>({
    url: '/tradeinfo/elecbalance',
    method: 'GET',
    params,
  });
}

export interface IRenewableBalance {
  infoTime: string;
  renewableBalanceOver: string;
}
export function getRenewableBalanceList(params: IInterProvincialSpotReq) {
  return energyRequest<IRenewableBalance[]>({
    url: '/tradeinfo/renewablebalance',
    method: 'GET',
    params,
  });
}
