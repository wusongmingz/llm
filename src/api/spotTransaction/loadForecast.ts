import { transactionRequest } from '@/utils/request';
import { IPageParams } from '../type/base';

export interface IGetLoadForecastListReq extends IPageParams {
  startInfoDate: string;
  endInfoDate: string;
  customerId?: number;
}

export interface ILoadForecast {
  id: number;
  customerId: number;
  customerName: string;
  actualLoad: number;
  forecastLoad: number;
  forecastSource: string;
  infoDate: string;
  infoTime: number;
}
export function getLoadForecastList(data: IGetLoadForecastListReq) {
  return transactionRequest<{
    data: ILoadForecast[];
    total: number;
  }>({
    url: '/ods_gansu_customer_load_forecast/list',
    method: 'POST',
    data,
  });
}

export function uploadLoadForecast(data: FormData) {
  return transactionRequest<void>({
    url: '/ods_gansu_customer_load_forecast/upload',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data,
  });
}

export function getLoadForecastTemplateUrl() {
  return '/resource/template/电量预测数据表模板.xlsx';
}

export function updateLoadForecast(data: { id: number; forecastLoad: number }[]) {
  return transactionRequest<void>({
    url: '/ods_gansu_customer_load_forecast/batch/update',
    method: 'POST',
    data: { data },
  });
}

export interface ICustomerInfo {
  id: number;
  customerName: string;
}
export function getCustomList() {
  return transactionRequest<ICustomerInfo[]>({
    url: '/ods_customer_info/list',
    method: 'POST',
    data: { page: 1, pageSize: 10000 },
  });
}
