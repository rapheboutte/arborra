import axios from 'axios';
import { ComplianceFramework, ComplianceUpdate, ComplianceStats } from '../types/compliance';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.compliance.ai/v1',
  headers: {
    'Authorization': `Bearer ${process.env.COMPLIANCE_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const complianceApi = {
  async getFramework(frameworkId: string): Promise<ComplianceFramework> {
    const response = await api.get(`/frameworks/${frameworkId}`);
    return response.data;
  },

  async getFrameworks(): Promise<ComplianceFramework[]> {
    const response = await api.get('/frameworks');
    return response.data;
  },

  async getUpdates(since?: string): Promise<ComplianceUpdate[]> {
    const params = since ? { since } : {};
    const response = await api.get('/updates', { params });
    return response.data;
  },

  async getStats(): Promise<ComplianceStats> {
    const response = await api.get('/stats');
    return response.data;
  },

  async searchRegulations(query: string): Promise<any[]> {
    const response = await api.get('/search', {
      params: { q: query }
    });
    return response.data;
  },

  async updateRequirementStatus(
    frameworkId: string,
    requirementId: string,
    status: string,
    notes?: string
  ): Promise<void> {
    await api.patch(`/frameworks/${frameworkId}/requirements/${requirementId}`, {
      status,
      notes,
    });
  }
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const fetchWithErrorHandling = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 429) {
      // Rate limit handling
      throw new ApiError(429, 'Rate limit exceeded');
    }

    if (!response.ok) {
      throw new ApiError(response.status, `API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Unexpected error: ${error}`);
  }
};
