import { apiClients } from './index';
import { createAuditLog } from '@/lib/audit';

export interface FinancialFiling {
  cik: string;
  companyName: string;
  formType: string;
  filingDate: string;
  documentUrl: string;
  description: string;
}

export interface AuditInspection {
  firmId: string;
  firmName: string;
  inspectionDate: string;
  findings: {
    category: string;
    description: string;
    severity: string;
  }[];
  status: string;
}

export class SOXApiService {
  async getFinancialFilings(params: {
    cik?: string;
    startDate?: string;
    endDate?: string;
    formType?: string;
  }): Promise<FinancialFiling[]> {
    try {
      const response = await apiClients.sox.edgar.get('/company', {
        params: {
          ...params,
          format: 'json'
        }
      });

      await createAuditLog({
        type: 'api_call',
        organizationId: 'system',
        details: {
          action: 'fetch_financial_filings',
          params
        },
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch financial filings:', error);
      throw error;
    }
  }

  async getAuditInspections(params: {
    firmId?: string;
    year?: string;
  }): Promise<AuditInspection[]> {
    try {
      const response = await apiClients.sox.pcaob.get('/inspections', {
        params: {
          ...params,
          format: 'json'
        }
      });

      await createAuditLog({
        type: 'api_call',
        organizationId: 'system',
        details: {
          action: 'fetch_audit_inspections',
          params
        },
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch audit inspections:', error);
      throw error;
    }
  }

  async getStandardsUpdates(): Promise<any> {
    try {
      const response = await apiClients.sox.pcaob.get('/standards/updates');

      await createAuditLog({
        type: 'api_call',
        organizationId: 'system',
        details: {
          action: 'fetch_standards_updates'
        },
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch standards updates:', error);
      throw error;
    }
  }
}
