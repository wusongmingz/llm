import { transactionRequest, energyRequest } from '@/utils/request';

export interface IGetPriceForecastListReq {
  infoDate: string[];
  channel: string;
  type: 1 | 2; // 1：24、2：96
}

export interface IPriceForecast {
  infoDate: string;
  infoTime: string;
  dayaheadForecastPrice: number;
  intradayForecastPrice: number;
  dayaheadMaketPrice: number;
  intradayMaketPrice: number;
  intradayMaketForecastPrice: number;
}

export function getPriceForecastList(data: IGetPriceForecastListReq) {
  return transactionRequest<{
    dataEast: IPriceForecast[];
    dataWest: IPriceForecast[];
  }>({
    url: '/spot_eectricity_price_trading/list',
    method: 'POST',
    data,
  });
}

export function getPriceForecastListByHz(data: IGetPriceForecastListReq) {
  return energyRequest<
    {
      areaCode: number;
      areaName: string;
      list: IPriceForecast[];
    }[]
  >({
    url: '/electric-spots/price-forecast/list2',
    method: 'POST',
    data,
  });
}
