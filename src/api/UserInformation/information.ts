import { APIRequest } from '@/utils/request';

//获取apikey
export function getApiKey(params: { userId: string }) {
  return APIRequest<any>({
    url: '/ai-apiKey/getValidKey',
    method: 'GET',
    params,
  });
}

//查询服务商模型列表
export function getServiceList() {
  return APIRequest<any>({
    url: '/user/getSupplierList',
    method: 'GET',
  });
}
//查看排除服务商模型列表-用户
export function getServiceDiffList(params: { userId: string }) {
  return APIRequest<any>({
    url: '/user/userSupplierException',
    method: 'GET',
    params,
  });
}
//修改排除服务商模型列表-用户
export function modifyUserSupplierException(params: { userId: string; suppliers: string }) {
  return APIRequest<any>({
    url: '/user/modifyUserSupplierException',
    method: 'POST',
    params,
  });
}
//查询token用量
export function getTokens(params: { userId: string }) {
  return APIRequest<any>({
    url: '/user/countToken',
    method: 'GET',
    params,
  });
}
//查询模型列表-默认
export function getModelDefault(params: { userId: string }) {
  return APIRequest<any>({
    url: '/user/getDefaultModel',
    method: 'GET',
    params,
  });
}
//修改模型列表-默认
export function modifyDefaultModel(params: { userId: string; modelId: number }) {
  return APIRequest<any>({
    url: '/user/modifyDefaultModel',
    method: 'POST',
    params,
  });
}

//获取用户max_tokens
export function getMaxToken(params: { userId: string }) {
  return APIRequest<any>({
    url: '/user/getMaxToken',
    method: 'GET',
    params,
  });
}

//修改用户max_tokens
export function modifyMaxToken(params: { userId: string; maxToken: any }) {
  return APIRequest<any>({
    url: '/user/modifyMaxToken',
    method: 'POST',
    params,
  });
}
