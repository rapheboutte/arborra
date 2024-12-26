import { apiClients } from './index';
import { createAuditLog } from '@/lib/audit';

export interface InspectionData {
  id: string;
  establishmentName: string;
  inspectionDate: string;
  inspectionType: string;
  violations: {
    code: string;
    description: string;
    severity: string;
    penalty: number;
  }[];
  totalPenalties: number;
  status: string;
}

export interface SafetyStatistics {
  industryCode: string;
  year: string;
  incidentRate: number;
  totalCases: number;
  lostWorkdayCases: number;
  totalHours: number;
}

export class OSHAApiService {
  async getInspectionData(params: {
    establishmentId?: string;
    startDate?: string;
    endDate?: string;
    state?: string;
  }): Promise<InspectionData[]> {
    try {
      const response = await apiClients.osha.enforcement.get('/inspections', {
        params: {
          ...params,
          format: 'json'
        }
      });

      await createAuditLog({
        type: 'api_call',
        organizationId: 'system',
        details: {
          action: 'fetch_osha_inspections',
          params
        },
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch OSHA inspection data:', error);
      throw error;
    }
  }

  async getIndustryStats(params: {
    industryCode: string;
    year: string;
  }): Promise<SafetyStatistics> {
    try {
      const response = await apiClients.osha.enforcement.get('/statistics/industry', {
        params: {
          ...params,
          format: 'json'
        }
      });

      await createAuditLog({
        type: 'api_call',
        organizationId: 'system',
        details: {
          action: 'fetch_industry_stats',
          params
        },
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch industry safety statistics:', error);
      throw error;
    }
  }

  async getViolationTrends(industryCode: string): Promise<any> {
    try {
      const response = await apiClients.osha.enforcement.get('/violations/trends', {
        params: {
          industryCode,
          format: 'json'
        }
      });

      await createAuditLog({
        type: 'api_call',
        organizationId: 'system',
        details: {
          action: 'fetch_violation_trends',
          industryCode
        },
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch violation trends:', error);
      throw error;
    }
  }
}
