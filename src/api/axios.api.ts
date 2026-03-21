import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from '@/components/ui/sonner';

type ApiResponseShape = {
  message?: string;
};

declare module 'axios' {
  interface AxiosRequestConfig {
    notifySuccess?: boolean;
    notifyError?: boolean;
    successMessage?: string;
    errorMessage?: string;
  }

  interface InternalAxiosRequestConfig {
    notifySuccess?: boolean;
    notifyError?: boolean;
    successMessage?: string;
    errorMessage?: string;
  }
}

type NotifyConfig = InternalAxiosRequestConfig & {
  notifySuccess?: boolean;
  notifyError?: boolean;
  successMessage?: string;
  errorMessage?: string;
};

const recentToastCache = new Map<string, number>();
const TOAST_DEDUPE_MS = 1200;

const shouldDedupe = (key: string) => {
  const now = Date.now();
  const previous = recentToastCache.get(key);

  if (previous && now - previous < TOAST_DEDUPE_MS) return true;

  recentToastCache.set(key, now);
  return false;
};

const isSuccessfulMethod = (method?: string) => {
  const normalized = (method || 'get').toLowerCase();
  return !['head', 'options'].includes(normalized);
};

const getSuccessMessage = (response: AxiosResponse<ApiResponseShape>, config: NotifyConfig) => {
  if (config.successMessage) return config.successMessage;
  return response?.data?.message || 'Request completed successfully.';
};

const getErrorMessage = (error: AxiosError<ApiResponseShape>, config?: NotifyConfig) => {
  if (config?.errorMessage) return config.errorMessage;
  return error.response?.data?.message || error.message || 'Something went wrong.';
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4040/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponseShape>) => {
    const config = response.config as NotifyConfig;
    const shouldNotifySuccess = config.notifySuccess ?? isSuccessfulMethod(config.method);

    if (shouldNotifySuccess) {
      const message = getSuccessMessage(response, config);
      const dedupeKey = `success:${config.method}:${config.url}:${message}`;

      if (!shouldDedupe(dedupeKey)) {
        toast.success(message);
      }
    }

    return response;
  },
  (error: AxiosError<ApiResponseShape>) => {
    const config = error.config as NotifyConfig | undefined;
    const shouldNotifyError = config?.notifyError ?? true;

    if (shouldNotifyError) {
      const message = getErrorMessage(error, config);
      const dedupeKey = `error:${config?.method}:${config?.url}:${message}`;

      if (!shouldDedupe(dedupeKey)) {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
