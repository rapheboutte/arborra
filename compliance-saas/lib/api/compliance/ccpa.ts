import { apiClients } from './index';
import { createAuditLog } from '@/lib/audit';

export interface EnforcementAction {
  id: string;
  date: string;
  company: string;
  violation: string;
  penalty: number;
  resolution: string;
  status: string;
}

export interface ConsumerComplaint {
  id: string;
  date: string;
  category: string;
  description: string;
  status: string;
  resolution?: string;
}

export class CCPAApiService {
  async getEnforcementActions(params: {
    startDate?: string;
    endDate?: string;
  }): Promise<EnforcementAction[]> {
    try {
      const response = await apiClients.ccpa.caAG.get('/enforcement', {
        params: {
          ...params,
          format: 'json'
        }
      });

      await createAuditLog({
        type: 'api_call',
        organizationId: 'system',
        details: {
          action: 'fetch_ccpa_enforcement',
          params
        },
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch CCPA enforcement actions:', error);
      throw error;
    }
  }

  async getConsumerComplaints(params: {
    startDate?: string;
    endDate?: string;
    category?: string;
  }): Promise<ConsumerComplaint[]> {
    try {
      const response = await apiClients.ccpa.caOpenData.get('/consumer-complaints', {
        params: {
          ...params,
          format: 'json'
        }
      });

      await createAuditLog({
        type: 'api_call',
        organizationId: 'system',
        details: {
          action: 'fetch_consumer_complaints',
          params
        },
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch consumer complaints:', error);
      throw error;
    }
  }

  async getRegulatoryUpdates(): Promise<any> {
    try {
      const response = await apiClients.ccpa.caAG.get('/regulatory-updates');

      await createAuditLog({
        type: 'api_call',
        organizationId: 'system',
        details: {
          action: 'fetch_regulatory_updates'
        },
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch regulatory updates:', error);
      throw error;
    }
  }
}
