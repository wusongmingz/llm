// import CryptoJS from "crypto-js";
// import * as base64 from "base-64";
//定义配置 信息接口对象
interface WSConfig {
  APPID: string;
  APIKey: string;
  APISecret: string;
  VERSION: string;
}
//会话项
export interface ChatItem {
  role: 'user' | 'assistant' | 'system';
  content: string;
  index?: number;
  [key: string]: any; //允许包含额外的属性
}
//根据版本指定访问的领域
const vDomain: { [key: string]: string } = {
  'v1.1': 'general',
  'v2.1': 'generalv2',
  'v3.1': 'generalv3',
  'v3.5': 'generalv3.5',
};
//请求参数规则定义
export interface WSReqParams {
  header: {
    app_id: string; //应用ID
    uid?: string; //用户id，用于区分不同用户（非必传）
  };
  parameter: {
    chat: {
      domain: string; //指定请求的领域
      max_tokens?: number;
    };
  };
  payload: {
    message: {
      text: ChatItem[];
    };
  };
}
//接口响应参数规则定义
export interface WSResParams {
  header: {
    code: number;
    message: string;
    //本次会话id
    sid: string;
    status: number; //0:start,1:continue 2:end
  };
  payload: {
    choices: {
      status: number; //0:start,1:continue 2:end
      seq: number; //数据序号，标明数据为第几块，取值为[0,9999999]
      text: ChatItem[]; //文本数据
    };
    usage: {
      text: {
        question_tokens: number; //问题的tokens 大小
        prompt_tokens: number; //包含历史问题的总tokens大小
        completion_tokens: number; //回答的tokens大小
        total_tokens: number; //prompt_tokens和completion_tokens的和，也是本次交互计费的tokens大小
      };
    };
  };
}
export const getWebsocketUrl = (config: WSConfig): string => {
  // let url = `wss://spark-api.xf-yun.com/${config.VERSION}/chat`;
  // let host = window.location.origin;
  // let date = new Date().toUTCString();
  // //加密算法
  // var algorithm = 'hmac-sha256';
  // //参与签名的参数，固定的参数名称为：host date request-line
  // var headers = 'host date request-line'
  // //原始签名地址
  // var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /${config.VERSION}/chat HTTP/1.1`;
  // //利用hmac-sha256算法结合APISecret对上一步的signatureOrigin签名，获得签名后的摘要signatureSha。
  // var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.APISecret);
  // //将上方的signatureSha进行base64编码生成signature
  // var signature = CryptoJS.enc.Base64.stringify(signatureSha);
  // //利用上面生成的signature，拼接下方的字符串生成authorizationOrigin
  // var authorizationOrigin = `api_key="${config.APIKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
  // //最后再将上方的authorizationOrigin进行base64编码,生成最终的authorization
  // var authorization = base64.encode(authorizationOrigin);
  // url = `${url}?authorization=${authorization}&date=${encodeURI(date)}&host=${host}`;
  // return url;
  return '';
};

/**
 * 发送数据格式化处理
 * @param config  配置信息
 * @param sendData 发送数据内容
 * @returns
 */
export const wsSendMsgFormat = (config: WSConfig, sendData: ChatItem[]) => {
  const formatData = {
    header: {
      app_id: config.APPID, //应用ID
    },
    parameter: {
      chat: {
        domain: vDomain[config.VERSION], //指定请求的领域
        max_tokens: 2048,
      },
    },
    payload: {
      message: {
        text: sendData,
      },
    },
  };
  return formatData;
};
