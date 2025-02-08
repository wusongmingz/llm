import { APIRequest } from '@/utils/request';
import { IPageInfoParams } from '../type/base';

export interface addKey {
  userId: number;
  tokenQuota: number;
  keyName: string;
  apiKey?: string;
}
export function addKey(data: addKey) {
  return APIRequest<any>({
    url: '/ai-apiKey/createKey',
    method: 'POST',
    data,
  });
}

export function editKey(data: addKey) {
  return APIRequest<any>({
    url: '/ai-apiKey/updateKey',
    method: 'POST',
    data,
  });
}

export function getKeyList(userId: number) {
  return APIRequest<any>({
    url: '/ai-apiKey/getKey',
    method: 'GET',
    params: { userId },
  });
}

export function deleteKey(params: any) {
  return APIRequest<any>({
    url: '/ai-apiKey/deleteKey',
    method: 'POST',
    params,
  });
}

export interface keyReq {
  pageNum: number;
  pageSize: number;
  apiKey: string;
}

// export function getKeyDetail(params: keyReq) {
//   return APIRequest<any>({
//     url: '/api-key-log/getlog',
//     method: 'GET',
//     params,
//   });
// }

//1.获取prompt列表
export interface promptReq {
  user: string;
  tag?: string;
}
export function getPromptList(params: promptReq) {
  return APIRequest<any>({
    url: '/ai-chat/getPromptList',
    method: 'POST',
    params,
  });
}

export function createPromptList(data: any) {
  return APIRequest<any>({
    url: '/ai-chat/createPrompt',
    method: 'POST',
    data,
  });
}

export function modifyPromptList(data: any) {
  return APIRequest<any>({
    url: '/ai-chat/modifyPromptList',
    method: 'POST',
    data,
  });
}

export function getTagList() {
  return APIRequest<any>({
    url: '/ai-chat/getTagList',
    method: 'GET',
  });
}

export interface delPromptReq {
  user: string;
  titleId: string;
}

export function deletePromptList(params: delPromptReq) {
  return APIRequest<any>({
    url: '/ai-chat/deletePrompt',
    method: 'POST',
    params,
  });
}

//AI聊天接口
export interface chatReq {
  apiKey?: string;
  model?: string;
  messages?: Array<any>;
  stream?: boolean;
  toolChoice?: string;
  maxTokens?: number;
  sessionId?: string;
}
export function chatAI(data: chatReq) {
  return APIRequest<any>({
    url: '/ai-gateway/chatCompletions',
    method: 'POST',
    headers: { 'session-id': data.sessionId },
    responseType: 'stream',
    data,
  });
}

//历史记录接口
//新聊天
export interface newChatReq {
  userId: string;
}
export function newChat(params: newChatReq) {
  return APIRequest<any>({
    url: '/ai-chat/createNewConversation',
    method: 'POST',
    params,
  });
}
//历史聊天列表
export function getChatList(params: { userId: string }) {
  return APIRequest<any>({
    url: '/ai-chat/getHisConversation',
    method: 'GET',
    params,
  });
}
//清空聊天
export function delChatList(params: { userId: string }) {
  return APIRequest<any>({
    url: '/ai-chat/clearHisConversation',
    method: 'POST',
    params,
  });
}
//删除指定聊天
export function delChat(params: { userId: string; conversationId: string }) {
  return APIRequest<any>({
    url: '/ai-chat/deleteHisConversation',
    method: 'POST',
    params,
  });
}
//对话历史
export interface conversationIdReq {
  conversationId: string;
}
export function getChatDetail(params: conversationIdReq) {
  return APIRequest<any>({
    url: '/ai-chat/getConversationDetail',
    method: 'GET',
    params,
  });
}

//查询聊天模型列表
export function getChatModelList() {
  return APIRequest<any>({
    url: '/ai-chat/getModelList',
    method: 'GET',
  });
}

//11.5修改模型列表选择
//获取当前所有供应商
export function filterSuppliert() {
  return APIRequest<any>({
    url: '/ai-modelList/filterSupplier',
    method: 'GET',
  });
}
//获取现在有的上下文长度
export function filterContextLength() {
  return APIRequest<any>({
    url: '/ai-modelList/filterContextLength',
    method: 'GET',
  });
}
//筛选
export function filterModel(params: any) {
  return APIRequest<any>({
    url: '/ai-modelList/filterModel',
    method: 'GET',
    params,
  });
}

//获取apikey列表 -- 11.11 聊天列表使用
export function getApiKeyList(params: any) {
  return APIRequest<any>({
    url: '/ai-apiKey/getApiKeyList',
    method: 'GET',
    params,
  });
}

// 判断聊天是否是新聊天
export function getIsNewConversation(params: any) {
  return APIRequest<any>({
    url: '/ai-chat/isNewConversation',
    method: 'post',
    params,
  });
}

// 更新title
export function setConversationTitle(params: any) {
  return APIRequest<any>({
    url: '/ai-chat/setConversationTitle',
    method: 'post',
    params,
  });
}
