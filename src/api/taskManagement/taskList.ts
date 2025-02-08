import { flowableRequest } from '@/utils/request';

export interface listReq {
  pageNo: number;
  pageSize: number;
}

export interface myProcess {
  taskId: string;
  taskName: string;
  assigneeId: number;
  assigneeName: string;
  assigneeDeptName: string;
  category: string;
  deployId: string;
  procDefName: string;
  procDefVersion: number;
  procInsId: string;
  duration: number;
  createTime: string;
  finishTime: string;
}

export interface todoList {
  taskId: string;
  executionId: string;
  taskName: string;
  startUserName: string;
  startDeptName: string;
  taskDefKey: string;
  deployId: string;
  procDefId: string;
  procDefName: string;
  procDefVersion: number;
  procInsId: string;
  createTime: string;
}

export interface finishedList {
  taskId: string;
  taskName: string;
  taskDefKey: string;
  startUserId: number;
  startUserName: string;
  startDeptName: string;
  deployId: string;
  procDefId: string;
  procDefName: string;
  procDefVersion: number;
  procInsId: string;
  hisProcInsId: string;
  duration: number;
  createTime: string;
  finishTime: string;
}

export interface complete {
  taskId: string;
  procInsId: string;
  isAgreed: boolean;
  comment: string;
}

export function getMyProcessList(params: listReq) {
  return flowableRequest<{ records: myProcess[]; total: number }>({
    url: '/process/task/mineList',
    method: 'GET',
    params,
  });
}

export function getTodoList(params: listReq) {
  return flowableRequest<{ records: todoList[]; total: number }>({
    url: '/process/task/todoList',
    method: 'GET',
    params,
  });
}

export function getFinishedList(params: listReq) {
  return flowableRequest<{ records: finishedList[]; total: number }>({
    url: '/process/task/finishedList',
    method: 'GET',
    params,
  });
}

export function completeTask(data: complete) {
  return flowableRequest<undefined>({
    url: '/process/task/complete',
    method: 'POST',
    data,
  });
}

export function delMineList(procInsId: string) {
  return flowableRequest<undefined>({
    url: '/process/instance/delete',
    method: 'GET',
    params: { procInsId: procInsId },
  });
}

export interface variablesObj {
  [key: string]: string | number;
}

export interface formDetail {
  form: { id: number; name: string; type: number; content: string };
  variables: variablesObj;
}

export function getFormDetail(taskId: string) {
  return flowableRequest<formDetail>({
    url: '/process/task/formDetail',
    method: 'GET',
    params: { taskId: taskId },
  });
}
