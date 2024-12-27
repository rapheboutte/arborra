import { ComplianceOverview, ComplianceData, ComplianceRequirement, ComplianceDocument } from '@/types/compliance';
import { ApiClient } from '@/lib/api-client';
import { connectToDatabase, Collections } from '@/lib/db/mongodb';
import { getRedisClient, CacheConfig } from '@/lib/cache/redis';

export class ComplianceService {
  private client: ApiClient;
  private redis;

  constructor() {
    this.client = new ApiClient();
    this.redis = getRedisClient();
  }

  private async getCachedData<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  private async setCachedData(key: string, data: any, ttl: number) {
    await this.redis.setex(key, ttl, JSON.stringify(data));
  }

  async getComplianceOverview(orgId: string, framework: string): Promise<ComplianceOverview> {
    try {
      // Try to get from cache first
      const cacheKey = CacheConfig.COMPLIANCE_DATA.key(orgId, `${framework}:overview`);
      const cached = await this.getCachedData<ComplianceOverview>(cacheKey);
      
      if (cached) {
        return cached;
      }

      // If not in cache, fetch from API
      const response = await this.client.request<ComplianceOverview>({
        method: 'GET',
        url: '/api/compliance',
        params: { framework },
      });

      // Store in MongoDB for historical tracking
      const { db } = await connectToDatabase();
      await db.collection(Collections.COMPLIANCE_DATA).insertOne({
        orgId,
        framework,
        type: 'overview',
        data: response.data,
        timestamp: new Date()
      });

      // Cache the response
      await this.setCachedData(cacheKey, response.data, CacheConfig.COMPLIANCE_DATA.ttl);

      return response.data;
    } catch (error) {
      console.error('Error fetching compliance overview:', error);
      throw error;
    }
  }

  async getFrameworkCompliance(orgId: string, framework: string): Promise<ComplianceData> {
    try {
      // Try cache first
      const cacheKey = CacheConfig.COMPLIANCE_DATA.key(orgId, framework);
      const cached = await this.getCachedData<ComplianceData>(cacheKey);
      
      if (cached) {
        return cached;
      }

      // Fetch from API
      const response = await this.client.request<ComplianceData>({
        method: 'GET',
        url: '/api/compliance',
        params: { framework },
      });

      // Store in MongoDB
      const { db } = await connectToDatabase();
      await db.collection(Collections.COMPLIANCE_DATA).insertOne({
        orgId,
        framework,
        type: 'full',
        data: response.data,
        timestamp: new Date()
      });

      // Cache the response
      await this.setCachedData(cacheKey, response.data, CacheConfig.COMPLIANCE_DATA.ttl);

      return response.data;
    } catch (error) {
      console.error(`Error fetching ${framework} compliance data:`, error);
      throw error;
    }
  }

  async updateRequirementStatus(
    orgId: string,
    framework: string,
    requirementId: string,
    status: string,
    notes?: string
  ) {
    try {
      const response = await this.client.request({
        method: 'PATCH',
        url: `/api/compliance/${framework}/requirements/${requirementId}`,
        data: { status, notes },
      });

      // Invalidate relevant caches
      await this.redis.del(
        CacheConfig.COMPLIANCE_DATA.key(orgId, framework),
        CacheConfig.COMPLIANCE_DATA.key(orgId, `${framework}:overview`)
      );

      // Store the update in MongoDB
      const { db } = await connectToDatabase();
      await db.collection(Collections.COMPLIANCE_DATA).insertOne({
        orgId,
        framework,
        type: 'requirement_update',
        requirementId,
        status,
        notes,
        timestamp: new Date()
      });

      return response.data;
    } catch (error) {
      console.error('Error updating requirement status:', error);
      throw error;
    }
  }

  async getComplianceHistory(orgId: string, framework: string, days: number = 30) {
    try {
      const { db } = await connectToDatabase();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      return await db.collection(Collections.COMPLIANCE_DATA)
        .find({
          orgId,
          framework,
          timestamp: { $gte: startDate }
        })
        .sort({ timestamp: -1 })
        .toArray();
    } catch (error) {
      console.error('Error fetching compliance history:', error);
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
