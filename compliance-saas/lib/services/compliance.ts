import { ComplianceOverview, ComplianceData, ComplianceRequirement, ComplianceDocument } from '@/types/compliance';
import { ApiClient } from '@/lib/api-client';

export class ComplianceService {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient();
  }

  async getComplianceOverview(framework: string): Promise<ComplianceOverview> {
    try {
      const response = await this.client.request<ComplianceOverview>({
        method: 'GET',
        url: '/api/compliance',
        params: { framework },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance overview:', error);
      throw error;
    }
  }

  async getFrameworkCompliance(framework: string): Promise<ComplianceData> {
    try {
      const response = await this.client.request<ComplianceData>({
        method: 'GET',
        url: '/api/compliance',
        params: { framework },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${framework} compliance data:`, error);
      throw error;
    }
  }

  async updateRequirementStatus(
    framework: string,
    requirementId: string,
    status: string,
    notes?: string
  ) {
    try {
      const response = await this.client.request({
        method: 'PATCH',
        url: `/api/compliance/${framework}/requirements/${requirementId}`,
        data: {
          status,
          notes,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating requirement status:', error);
      throw error;
    }
  }

  async uploadDocument(framework: string, formData: FormData) {
    try {
      const response = await this.client.request<ComplianceDocument>({
        method: 'POST',
        url: `/api/compliance/${framework}/documents`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async getDocuments(framework: string) {
    try {
      const response = await this.client.request<ComplianceDocument[]>({
        method: 'GET',
        url: `/api/compliance/${framework}/documents`,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  async generateReport(framework: string) {
    try {
      const response = await this.client.request<Blob>({
        method: 'POST',
        url: `/api/compliance/${framework}/report`,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  async validateDocument(framework: string, documentId: string) {
    try {
      const response = await this.client.request({
        method: 'POST',
        url: `/api/compliance/${framework}/documents/${documentId}/validate`,
      });
      return response.data;
    } catch (error) {
      console.error('Error validating document:', error);
      throw error;
    }
  }

  async getRequirementTasks(framework: string, requirementId: string) {
    try {
      const response = await this.client.request({
        method: 'GET',
        url: `/api/compliance/${framework}/requirements/${requirementId}/tasks`,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching requirement tasks:', error);
      throw error;
    }
  }

  async createTask(
    framework: string,
    requirementId: string,
    taskData: {
      title: string;
      description?: string;
      dueDate?: string;
      assignedTo?: string;
      priority: string;
    }
  ) {
    try {
      const response = await this.client.request({
        method: 'POST',
        url: `/api/compliance/${framework}/requirements/${requirementId}/tasks`,
        data: taskData,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(
    framework: string,
    requirementId: string,
    taskId: string,
    taskData: {
      status?: string;
      completedAt?: string;
      notes?: string;
    }
  ) {
    try {
      const response = await this.client.request({
        method: 'PATCH',
        url: `/api/compliance/${framework}/requirements/${requirementId}/tasks/${taskId}`,
        data: taskData,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }
}

export default new ComplianceService();
