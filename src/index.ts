import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ToastOptions } from 'react-toastify';
import type { ComponentType } from 'react';

// Toast setup
let toast: any | undefined;
let toastId: string | number | null = null;
let toastInitialized = false;
// inial just checking
// Lazy loader for toast using dynamic import (works in both ESM and CommonJS)
async function initializeToast() {
  if (toastInitialized) return;
  toastInitialized = true;

  try {
    // Use dynamic import which works in both ESM and CommonJS environments
    const toastModule = await import('react-toastify');
    toast = toastModule.toast;
  } catch (error) {
    toast = undefined;
  }
}

// Export ToastContainer safely for JSX using React hooks for proper re-rendering
import { useState, useEffect, createElement } from 'react';

export const APIToastContainer: ComponentType<any> = (props: any) => {
  const [ToastContainer, setToastContainer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('react-toastify')
      .then(module => {
        setToastContainer(() => module.ToastContainer);
        setLoading(false);
      })
      .catch((error) => {
        setToastContainer(() => () => null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return null; // Loading state
  }

  if (!ToastContainer) {
    return null; // Failed to load
  }

  // Use createElement to avoid JSX compilation issues
  return createElement(ToastContainer, props);
};



// API Config Interface
export interface CreateAPIConfig {
  baseURL: string;
  getToken?: () => Promise<string | undefined> | string | undefined;
  withToast?: boolean;
  successMessage?: string | ((res: AxiosResponse) => string);
  errorMessage?: string | ((err: any) => string);
  toastOptions?: ToastOptions;
  deduplicateToasts?: boolean; // Avoid repeated toasts
}

// API Interface
export interface API {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  instance: AxiosInstance;
}

// Factory Function
export function createAPI(config: CreateAPIConfig): API {
  const {
    baseURL,
    getToken,
    withToast = true,
    successMessage,
    errorMessage,
    toastOptions = {},
    deduplicateToasts = true,
  } = config;

  const instance = axios.create({ baseURL });

  // Request interceptor
  instance.interceptors.request.use(async (req) => {
    if (getToken) {
      const token = typeof getToken === 'function' ? await getToken() : getToken;
      if (token) {
        req.headers = req.headers || {};
        (req.headers as any)['Authorization'] = `Bearer ${token}`;
      }
    }
    return req;
  });

  // Response Interceptor
  instance.interceptors.response.use(
    async (response: AxiosResponse) => {
      if (withToast) {
        await initializeToast();
      }
      if (withToast && toast) {
        const message =
          typeof successMessage === 'function'
            ? successMessage(response)
            : successMessage || 'Request successful';

        if (deduplicateToasts && toastId) {
          toast.dismiss(toastId);
        }

        toastId = toast(message, {
          type: 'success',
          ...toastOptions,
        });
      }

      return response;
    },
    async (error) => {
      if (withToast) {
        await initializeToast();
      }
      if (withToast && toast) {
        const msg =
          typeof errorMessage === 'function'
            ? errorMessage(error)
            : error?.response?.data?.message || error.message || 'Request failed';

        if (deduplicateToasts && toastId) {
          toast.dismiss(toastId);
        }

        toastId = toast(msg, {
          type: 'error',
          ...toastOptions,
        });
      }

      return Promise.reject(error);
    }
  );

  return {
    get: async (url, config) => {
      const res = await instance.get(url, config);
      return res.data;
    },
    post: async (url, data, config) => {
      const res = await instance.post(url, data, config);
      return res.data;
    },
    put: async (url, data, config) => {
      const res = await instance.put(url, data, config);
      return res.data;
    },
    delete: async (url, config) => {
      const res = await instance.delete(url, config);
      return res.data;
    },
    instance,
  };
}
