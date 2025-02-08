import { energyRequest, imsRequest } from '@/utils/request';
import { IPageInfoParams } from '../type/base';

export interface ICompany {
  custId: number; //企业ID
  customerName: string; //企业名称
  customerClass: number; //所属行业
  customerType: number; //电价类别
  customerSegment: number; //电压等级
  sts: number; //'状态 1 准入， 0 终止  和cd.cm_object_mapping.sts 一致'
  createDate: string;
  groupId: number; //组织ID
  provCode: number; //省
  regionCode: number; //市
  countyCode: number; //县/区
  validDate: string; // 开始时间
  expireDate: string; // 结束时间
  custCreditProfileId: number; // 年用电规模
  soNbr: number;
  taxFlag: number;
  tenantId: number;
  firstContactName: string; //第一联系人
  firstContactPhone: string; //第一联系人电话
  secondContactName: string; //第二联系人
  secondContactPhone: string; //第二联系人电话
  performanceId: number; //额定功率
  taxExemptionNo: string; //企业编码
  customerQuoteid: number; //合同容量
  readingLanguage: number; //峰段电价(元/mwh)
  listeningLanguage: number; //平段电价(元/mwh)
  writingLanguage: number; //谷段电价(元/mwh)
  remarks: string; //简介
  occupationId: number; //是否执行峰谷电价
  taxNo: string; //税务登记号
  ext1: string; //企业户号（电表号）
  realNameSts: number; //是否实现电能在线监测并接入省平台
  credit: number; //运行容量
  creditLevel: number; //用电规模
  measureId: number; //最大可调功率
}

export interface custNameList {
  custId: number;
  custName: string;
  provCode: number;
  regionCode: number;
  countyCode: number;
}

export interface ICompanyListReq extends IPageInfoParams {
  customerName?: string;
}

export function queryCustNameListService() {
  return energyRequest<custNameList[]>({
    url: '/cust/nameList',
    method: 'GET',
  });
}

export function getCompanyList(params: ICompanyListReq) {
  return imsRequest<{
    total?: number;
    records?: ICompany[];
  }>({
    url: '/cd/customer/list',
    method: 'GET',
    params,
  });
}

export function getCompanyById(custId: number) {
  return imsRequest<ICompany>({
    url: '/cd/customer/detail',
    method: 'GET',
    params: { custId: custId },
  });
}

export function createCompany(data: Partial<ICompany>) {
  return imsRequest<undefined>({
    url: '/cd/customer/create',
    method: 'POST',
    data,
  });
}

export function updateCompany(data: Partial<ICompany>, custId: number) {
  return imsRequest<undefined>({
    url: '/cd/customer/update/' + custId,
    method: 'POST',
    data,
  });
}
