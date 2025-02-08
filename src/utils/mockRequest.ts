import axios, { AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/modules/user';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_MOCK_URL,
  timeout: 300000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    config.headers.Authorization = userStore.token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (res) => {
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
    ElMessage.error(error.message);
    return Promise.reject(error);
  },
);

const request = <T = any, U = any>(config: AxiosRequestConfig<U>) => {
  return axiosInstance.request<T, T>(config);
};

export default request;

type ResponseData<T> = {
  code: number;
  success: boolean;
  msg?: string;
  data?: T;
};
export type IFileResponse = {
  file: Blob;
  fileName: string;
};

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

export const openapiRequest = <T = any, U = any>(config: AxiosRequestConfig<U>) => {
  config.url = import.meta.env.VITE_SERVICE_OPENAPI + config.url;
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
