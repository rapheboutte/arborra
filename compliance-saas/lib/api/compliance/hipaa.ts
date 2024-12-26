import { apiClients } from './index';
import { createAuditLog } from '@/lib/audit';

export interface BreachNotification {
  id: string;
  entityName: string;
  breachDate: string;
  discoveryDate: string;
  reportDate: string;
  affectedIndividuals: number;
  breachType: string;
  location: string;
  status: string;
}

export interface ComplianceStatistics {
  period: string;
  totalComplaints: number;
  resolvedComplaints: number;
  enforcementActions: number;
  totalPenalties: number;
}

export class HIPAAApiService {
  async getBreachNotifications(params: {
    startDate?: string;
    endDate?: string;
    state?: string;
  }): Promise<BreachNotification[]> {
    try {
      const response = await apiClients.hipaa.hhs.get('/breach-notifications', {
        params: {
          ...params,
          format: 'json'
        }
      });

      await createAuditLog({
        type: 'api_call',
        organizationId: 'system',
        details: {
          action: 'fetch_hipaa_breaches',
          params
        },
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch HIPAA breach notifications:', error);
      throw error;
    }
  }

  async verifyProvider(npi: string): Promise<any> {
    try {
      const response = await apiClients.hipaa.npi.get('/registry', {
        params: {
          number: npi,
          version: '2.1'
        }
      });

      await createAuditLog({
        type: 'api_call',
        organizationId: 'system',
        details: {
          action: 'verify_provider',
          npi
        },
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Failed to verify healthcare provider:', error);
      throw error;
    }
  }

  async getComplianceStats(year: string): Promise<ComplianceStatistics> {
    try {
      const response = await apiClients.hipaa.hhs.get('/compliance-statistics', {
        params: {
          year,
          format: 'json'
        }
      });

      await createAuditLog({
        type: 'api_call',
        organizationId: 'system',
        details: {
          action: 'fetch_hipaa_stats',
          year
        },
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch HIPAA compliance statistics:', error);
      throw error;
    }
  }
}
