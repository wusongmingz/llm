import { APIRequest } from '@/utils/request';

//后台接口查有数据很慢，查无数据很快，防止数据覆盖手动取消
import axios from 'axios';
const { CancelToken } = axios;
// eslint-disable-next-line @typescript-eslint/no-empty-function
let cancel = () => {};
//筛选模型列表
export function getList(data: any) {
  return APIRequest<any>({
    url: '/ai-modelList/getModelInfoList',
    method: 'POST',
    data,
    cancelToken: new CancelToken((cancelFn) => {
      cancel && cancel();
      cancel = cancelFn;
    }),
  });
}

//获取模型所有条件
export function getOptionsList() {
  return APIRequest<any>({
    url: '/ai-modelList/getFilterCondition',
    method: 'GET',
  });
}

//获取大模型厂商
export function getSupplierInfo(params: any) {
  return APIRequest<any>({
    url: '/ai-modelList/getSupplierInfo',
    method: 'GET',
    params,
  });
}

//获取大模型明细
export function getModelInfo(params: any) {
  return APIRequest<any>({
    url: '/ai-modelList/getModelInfo',
    method: 'GET',
    params,
  });
}

//获取模型token近一周消耗
export function getModelTokenInfo(params: any) {
  return APIRequest<any>({
    url: '/ai-modelList/getModelTokenInfo',
    method: 'GET',
    params,
  });
}

//获取更多模型
export function getMoreModel(params: any) {
  return APIRequest<any>({
    url: '/ai-modelList/getMoreModel',
    method: 'GET',
    params,
  });
}
