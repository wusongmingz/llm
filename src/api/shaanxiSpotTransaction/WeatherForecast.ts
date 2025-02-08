import { openapiRequest } from '@/utils/request';

export interface hourlyReq {
  provCode: number;
  regionCode: number;
  countyCode: number;
  beginDate: string;
  endDate: string;
  type: string;
}

export interface weatherList {
  id: number;
  collectionDate: string;
  collectionType: string;
  oriProvCode: number;
  oriRegionCode: number;
  oriCountyCode: number;
  locationId: string;
  fxDate: string;
  fxTime: string; //预报时间
  temp: string; //温度，默认单位：摄氏度
  icon: string; //天气状况的图标代码
  iconText: string; //天气状况的文字描述，包括阴晴雨雪等天气状态的描述
  wind360: string; //风向360角度
  windDir: string; //风向
  windScale: string; //风力等级
  windSpeed: string; //风速，公里/小时
  humidity: string; //相对湿度，百分比数值
  precip: string; //当前小时累计降水量，默认单位：毫米
  pop?: string; //逐小时预报降水概率，百分比数值，可能为空
  pressure: string; //大气压强，默认单位：百帕
  cloud?: string; //云量，百分比数值。可能为空
  dew?: string; // 露点温度。可能为空
  fxBeginTime: string;
  fxEndTime: string;
}

export interface solarList {
  id: number;
  collectionDate: string;
  collectionType: string;
  oriProvCode: number;
  oriRegionCode: number;
  oriCountyCode: number;
  locationId: string;
  fxDate: string;
  fxTime: string; //预报时间
  net: string; //净太阳辐射，W/m2
  diffuse: string; //太阳散射辐射，W/m2
  direct: string; //太阳直接辐射，W/m2
  fxBeginTime: string;
  fxEndTime: string;
}

export function getWeather(params: hourlyReq) {
  return openapiRequest<weatherList[]>({
    url: '/weather/weather/hourly',
    method: 'GET',
    params,
  });
}

export function getSolar(params: hourlyReq) {
  return openapiRequest<solarList[]>({
    url: '/weather/solar-radiation/hourly',
    method: 'GET',
    params,
  });
}
