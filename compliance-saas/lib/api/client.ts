import axios, { AxiosError } from 'axios';

const BASE_URL = '/api';

export class ApiClient {
  private async handleRequest<T>(request: Promise<T>): Promise<T> {
    try {
      return await request;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error('API Error Response:', error.response.data);
          throw new Error(`API Error: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          console.error('API No Response:', error.request);
          throw new Error('Unable to reach the server. Please check your connection.');
        }
        console.error('API Request Error:', error.message);
        throw new Error('Error setting up the request. Please try again.');
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.handleRequest(
      axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(response => response.data)
    );
  }
}
