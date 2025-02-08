import axios, { AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/modules/user';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 300000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    /**
     * --------------------------------------------------------
     * @fixme 临时方案，强制为get请求添加请求头
     */
    if (config.method?.toLowerCase() === 'get' && !config.data) {
      config.data = {}; // 解决请求没有参数时添加不上Content-Type问题
      config.headers['Content-Type'] = 'application/json';
    }
    /**
     * --------------------------------------------------------
     */
    // config.headers.Authorization = userStore.token;
    config.headers.token = userStore.token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (res) => {
    if (res?.data?.code === 50002) {
      const userStore = useUserStore();
      userStore.removeLoginInfo();
      window.location.href = '/';
      return;
    }
    if (res.config.responseType === 'blob') {
      if (res.headers['content-disposition']) {
        const fileName = decodeURIComponent(res.headers['content-disposition']).split(';')[1].split('=')[1];
        return {
          code: 0,
          success: true,
          data: {
            file: res.data,
            fileName: fileName,
          },
        };
      } else {
        const error = new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = function (event) {
            const json = JSON.parse(
              (event?.target?.result as string) ||
                JSON.stringify({
                  code: 1,
                  success: false,
                  msg: '文件名获取失败！',
                }),
            );
            ElMessage.error(json.msg || '文件名获取失败！');
            resolve(json);
          };
          reader.readAsText(res.data);
        });
        throw error;
      }
    }
    return res.data;
  },
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      const userStore = useUserStore();
      userStore.removeLoginInfo();
      window.location.href = '/';
      return Promise.reject(error);
    }
    if (error.name === 'CanceledError') {
      return Promise.reject(error);
    }
    ElMessage.error(error.message || '未知错误');
    return Promise.reject(error);
  },
);

const request = <T = any, U = any>(config: AxiosRequestConfig<U>) => {
  return axiosInstance.request<T, T>(config);
};

export default request;

export type ResponseData<T = any> = {
  code: number;
  success: boolean;
  msg?: string;
  data?: T;
};

export type IFileResponse = {
  file: Blob;
  fileName: string;
};

export function checkRequestSuccess(result: ResponseData, showMessagge = true, throwError = false) {
  if (result.code !== 0) {
    if (showMessagge) ElMessage.error(result.msg || '未知错误');
    if (throwError) throw new Error(result.msg || '未知错误');
    return false;
  }
  return true;
}

export const baseRequest = <T = any, U = any>(config: AxiosRequestConfig<U>) => {
  config.url = import.meta.env.VITE_SERVICE_BASE + config.url;
  return axiosInstance.request<T, ResponseData<T>>(config);
};

export const energyRequest = <T = any, U = any>(config: AxiosRequestConfig<U>) => {
  config.url = import.meta.env.VITE_SERVICE_ENERGY_TRADE + config.url;
  return axiosInstance.request<T, ResponseData<T>>(config);
};

export const imsRequest = <T = any, U = any>(config: AxiosRequestConfig<U>) => {
  config.url = import.meta.env.VITE_SERVICE_IMS + config.url;
  return axiosInstance.request<T, ResponseData<T>>(config);
};

export const permRequest = <T = any, U = any>(config: AxiosRequestConfig<U>) => {
  config.url = import.meta.env.VITE_SERVICE_PERM + config.url;
  return axiosInstance.request<T, ResponseData<T>>(config);
};

export const flowableRequest = <T = any, U = any>(config: AxiosRequestConfig<U>) => {
  config.url = import.meta.env.VITE_SERVICE_FLOWABLE + config.url;
  return axiosInstance.request<T, ResponseData<T>>(config);
};

export const marketRequest = <T = any, U = any>(config: AxiosRequestConfig<U>) => {
  config.url = import.meta.env.VITE_SERVICE_MARKET + config.url;
  return axiosInstance.request<T, ResponseData<T>>(config);
};

export const transactionRequest = <T = any, U = any>(config: AxiosRequestConfig<U>) => {
  config.url = import.meta.env.VITE_SERVICE_TRANSACTION + config.url;
  return axiosInstance.request<T, Omit<ResponseData<T>, 'success'>>(config);
};

export const openapiRequest = <T = any, U = any>(config: AxiosRequestConfig<U>) => {
  config.url = import.meta.env.VITE_SERVICE_OPENAPI + config.url;
  return axiosInstance.request<T, ResponseData<T>>(config);
};

export const APIRequest = <T = any, U = any>(config: AxiosRequestConfig<U>) => {
  config.url = import.meta.env.VITE_SERVICE_APIKEY + config.url;
  return axiosInstance.request<T, ResponseData<T>>(config);
};

export const getResource = <T = any, U = any>(url: string, option: AxiosRequestConfig = {}) => {
  return request<T, U>({
    url,
    baseURL: '',
    method: 'GET',
    ...option,
  });
};
