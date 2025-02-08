import { mixMap } from '@/utils/utils';

/**
 * 现货、电力交易平台板块
 */
export const PROVINCE_MAP = new Map([
  ['甘肃', '甘肃'],
  ['山东', '山东'],
  ['内蒙', '内蒙古'],
  ['陕西', '陕西'],
  ['宁夏', '宁夏'],
]);
export const PROVINCE_TRANS_MAP = new Map([
  ['甘肃', 'gansu'],
  ['山东', 'shandong'],
  ['内蒙', 'neimeng'],
  ['陕西', 'shanxi'],
  ['宁夏', '宁夏'],
]);
export const CHANNEL_MAP = new Map([
  [2, 'LSTM'],
  [3, 'AI大脑'],
  [4, 'trident'],
  [5, '策略计算'],
]);
export const INFO_TYPE_MAP = new Map([
  [0, '日期预计划'],
  [1, '日前'],
  [2, '日内'],
  [3, '实时'],
]);
export const STRATEGY_MAP = new Map<number, string>([
  [1, 'CVaR'],
  [3, 'SCVaR'],
]);
export const RISK_TYPE_MAP = new Map([
  [1, 'low'],
  [2, 'mid'],
  [3, 'high'],
]);
export const RISK_TYPE_CH_MAP = new Map([
  [1, '低'],
  [2, '中'],
  [3, '高'],
]);
export const RISK_TYPE_LOW_MAP = new Map([[1, 'low']]);
export const PRICE_FORECAST_MODEL_MAP = new Map<number, string>([
  [4, 'trident'],
  [3, 'AI大脑'],
  [2, 'LSTM'],
]);
export const MIXIN_FORECAST_SR_MAP = mixMap(STRATEGY_MAP, RISK_TYPE_MAP);
MIXIN_FORECAST_SR_MAP.set('2_1', 'LSTM_low');
export const MIXIN_FORECAST_SRP_MAP = mixMap(mixMap(STRATEGY_MAP, RISK_TYPE_MAP), PRICE_FORECAST_MODEL_MAP);
MIXIN_FORECAST_SRP_MAP.set('2_1_2', 'LSTM_low_LSTM');
export const MIXIN_FORECAST_SRP_LOW_MAP = mixMap(mixMap(STRATEGY_MAP, RISK_TYPE_LOW_MAP), PRICE_FORECAST_MODEL_MAP);
MIXIN_FORECAST_SRP_LOW_MAP.set('2_1_2', 'LSTM_low_LSTM');
export const CATEGOTY_MAP = new Map<number, string>([[1, '典型负荷曲线']]);
export const TYPE_MAP = new Map<number, string>([
  [1, '直线型'],
  [2, '中午低谷型'],
  [3, '中午夜间工作型'],
  [4, '中午高峰型'],
  [5, '凌晨工作型'],
  [6, '双峰型'],
  [7, '早高峰型'],
  [8, '晚高峰型'],
]);
export const PERIOD_TYPE_MAP = new Map<number, string>([
  [1, '尖峰'],
  [2, '峰'],
  [3, '平'],
  [4, '谷'],
  [5, '深谷'],
]);

// review
export const TASK_STATUS_MAP = new Map<number, string>([
  [0, '待执行'],
  [1, '执行中'],
  [2, '已完成'],
]);
export const DATA_TYPE_MAP = new Map<number, string>([
  [1, '中长期交易结果'],
  [2, '日滚动交易结果'],
  [3, '现货交易日结算信息'],
]);
export const TOKEN_STATUS_MAP = new Map<number, string>([
  [0, '失效'],
  [1, '有效'],
]);
export const FEE_TYPE_MAP = new Map<number, string>([
  [1, '容量计费'],
  [2, '需量计费'],
]);

/**
 * 西北调峰
 */
export const CONTRACT_STATUS_MAP = new Map<number, string>([
  [1, '正常'],
  [2, '异常'],
]);
export const CONTRACT_TYPE_MAP = new Map<number, string>([
  [1, '安捷调峰'],
  [2, '安捷售电'],
]);
export const FEE_RULE_MAP = new Map<number, string>([
  [1, '按聚合商收益分成'],
  [2, '按总收益分成'],
]);
export const COOPERATION_AREA_MAP = new Map<string, string>([
  ['西北', '西北'],
  ['陕西', '陕西'],
  ['青海', '青海'],
  ['新疆', '新疆'],
  ['甘肃', '甘肃'],
  ['宁夏', '宁夏'],
]);

export const SETTLE_PROV_CODE_MAP = new Map<string | number, string>([
  ['不限', '不分地区'],
  [61, '陕西'],
  [63, '青海'],
  // ['新疆', '新疆'],
  // ['甘肃', '甘肃'],
  // ['宁夏', '宁夏'],
]);

/**
 * 宁夏虚拟电厂
 */
export const DIC_NX_POWER_AUXILIARY = {
  MARKET_TYPE_MAP: new Map<number, string>([
    [1, '辅助服务'],
    [2, '需求响应'],
  ]),
  TRADE_TYPE_MAP: new Map<number, string>([
    [0, '需求响应'],
    [3, '调峰'],
    [2, '顶峰'],
  ]),
};

export const SUPPLEMENT_CHANGE_MAP = new Map<string, string>([
  ['结算规则', '结算规则'],
  ['合作周期', '合作周期'],
  ['其他', '其他'],
]);

// 大屏颜色
export const PERIOD_TYPE_COLOR_MAP = new Map([
  [1, 'rgba(200, 61, 223, 0.2)'],
  [2, 'rgba(200, 61, 223, 0.1)'],
  [3, 'rgba(249, 208, 56, 0.1)'],
  [4, 'rgba(61, 205, 135, 0.1)'],
  [5, 'rgba(61, 205, 135, 0.1)'],
]);
