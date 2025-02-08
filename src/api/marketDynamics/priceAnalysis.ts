import { energyRequest } from '@/utils/request';

export interface biddingSpaceTrend {
  startDate: string;
  endDate: string;
  area: number;
  infoType: number;
}

export interface BiddingSpaceAvgList {
  infoTime: string;
  price: number;
  eastPrice: number;
  westPrice: number;
  eastPriceAhead: number;
  eastPriceRealtime: number;
  westPriceAhead: number;
  westPriceRealtime: number;
  priceVariance: number;
}

export interface BiddingSpaceDayList {
  infoDate: string;
  infoTime: string;
  price: number;
  hydroPower: number;
  newEnergyLoad: number;
  biddingSpage: number;
  eastPrice: number;
  westPrice: number;
  eastPriceAhead: number;
  eastPriceRealtime: number;
  westPriceAhead: number;
  westPriceRealtime: number;
  priceVariance: number;
}

export interface priceReq {
  dates: string[];
  area: number;
  infoType?: number;
  pointCount?: number;
  sectionType?: number;
}

export interface avgList {
  infoTime: string;
  channel: number;
  area: number;
  value: string;
  infoType?: number;
}

export interface dayList {
  infoDate: string;
  id: number;
  infoType: number;
  channel: number;
  province: string;
  area: number;
  value: string;
  infoTime: string;
  createdAt: string;
}

export interface avgMonList {
  value: string;
  infoDate: string;
}

export interface areaList {
  infoTime?: string;
  infoDate?: string;
  dayaheadPrice: number;
  realtimePrice: number;
  eastPriceAhead?: number;
  eastPriceRealtime?: number;
}

export function getBiddingSpaceTrend(params: biddingSpaceTrend) {
  return energyRequest<{ avgList: BiddingSpaceAvgList[]; dayList: BiddingSpaceDayList[] }>({
    url: '/tradeinfo/biddingspacetrend',
    method: 'GET',
    params,
  });
}

export function getPricecompareTrends(data: priceReq) {
  return energyRequest<{
    avgList: avgList[];
    dayList: dayList[];
    avgHourList: avgList[];
    avgTenList: avgList[];
  }>({
    url: '/tradeinfo/pricecompare',
    method: 'POST',
    data,
  });
}

export function getMonthavgpriceTrends(data: priceReq) {
  return energyRequest<{
    avgList: avgList[];
    dayList: dayList[];
    avgMonList: avgMonList[];
  }>({
    url: '/tradeinfo/monthavgprice',
    method: 'POST',
    data,
  });
}

export function getMonthavgpricestatTrends(data: priceReq) {
  return energyRequest<avgList[]>({
    url: '/tradeinfo/monthavgpricestat',
    method: 'POST',
    data,
  });
}

export function getAreapricetrendTrends(data: priceReq) {
  return energyRequest<{
    avgList: areaList[];
    dayList: areaList[];
  }>({
    url: '/tradeinfo/areapricetrend',
    method: 'POST',
    data,
  });
}

export function getDayareapricetrendTrends(params: { infoDate: string; area: number }) {
  return energyRequest<areaList[]>({
    url: '/tradeinfo/dayareapricetrend',
    method: 'GET',
    params,
  });
}

export function getNodepricetrendTrends(data: { dates: string[]; devices: string[] }) {
  return energyRequest<{
    avgList: areaList[];
    dayList: areaList[];
  }>({
    url: '/tradeinfo/nodepricetrend',
    method: 'POST',
    data,
  });
}

export function getDaynodepricetrendTrends(data: { infoDate: string; devices: string[] }) {
  return energyRequest<areaList[]>({
    url: '/tradeinfo/daynodepricetrend',
    method: 'POST',
    data,
  });
}

export function getDeviceList() {
  return energyRequest<string[]>({
    url: '/tradeinfo/devicelist',
    method: 'GET',
  });
}
