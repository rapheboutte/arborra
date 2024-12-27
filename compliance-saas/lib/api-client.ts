import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type RequestOptions = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  responseType?: string;
  params?: Record<string, string>;
  data?: any;
};

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string = '') {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        // Add any auth headers here if needed
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Handle specific error responses
          switch (error.response.status) {
            case 401:
              // Handle unauthorized
              break;
            case 403:
              // Handle forbidden
              break;
            case 404:
              // Handle not found
              break;
            case 429:
              // Handle rate limit
              break;
            default:
              // Handle other errors
              break;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async request<T>(options: RequestOptions): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      method: options.method,
      url: options.url,
      headers: options.headers,
      params: options.params,
      data: options.data,
      responseType: options.responseType,
    };

    return this.client.request<T>(config);
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: 'GET', url: endpoint, ...options });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: 'POST', url: endpoint, data, ...options });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: 'PUT', url: endpoint, data, ...options });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: 'PATCH', url: endpoint, data, ...options });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: 'DELETE', url: endpoint, ...options });
  }

  // Handle form data uploads
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: endpoint,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return this.client.request<T>(config);
  }

  // Set authorization token
  setAuthToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Clear authorization token
  clearAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }
}
