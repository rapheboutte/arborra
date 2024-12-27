type RequestOptions = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  responseType?: string;
  params?: Record<string, string>;
  data?: any;
};

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request<T>(options: RequestOptions): Promise<{ data: T }> {
    const url = `${this.baseUrl}${options.url}`;
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    // Build URL with query parameters
    const queryParams = options.params ? new URLSearchParams(options.params).toString() : '';
    const fullUrl = `${url}${queryParams ? `?${queryParams}` : ''}`;

    try {
      const response = await fetch(fullUrl, {
        method: options.method,
        headers,
        body: options.data ? JSON.stringify(options.data) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle blob response type for file downloads
      if (options.responseType === 'blob') {
        const blob = await response.blob();
        return { data: blob as T };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>({ method: 'GET', url: endpoint, ...options });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request<T>({ method: 'POST', url: endpoint, data, ...options });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request<T>({ method: 'PUT', url: endpoint, data, ...options });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request<T>({ method: 'PATCH', url: endpoint, data, ...options });
  }

  async delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>({ method: 'DELETE', url: endpoint, ...options });
  }

  // Handle form data uploads
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<{ data: T }> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      return { data: responseData };
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  // Set authorization token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Clear authorization token
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }
}
