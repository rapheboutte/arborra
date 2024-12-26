import { ApiClient } from '../api/client';

export interface ComplianceData {
  complianceScore: number;
  status: string;
  requirements: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string;
  }>;
  details: string[];
  recentUpdates: Array<{
    date: string;
    type: string;
    description: string;
  }>;
}

export interface ComplianceOverview {
  gdpr: ComplianceData;
  hipaa: ComplianceData;
  ccpa: ComplianceData;
  sox: ComplianceData;
  osha: ComplianceData;
}

const mockComplianceData = (framework: string): ComplianceData => ({
  complianceScore: Math.floor(Math.random() * 30) + 70,
  status: 'active',
  requirements: [
    {
      id: '1',
      title: `${framework.toUpperCase()} Requirement 1`,
      status: 'in_progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  details: [
    `${framework.toUpperCase()} compliance detail 1`,
    `${framework.toUpperCase()} compliance detail 2`
  ],
  recentUpdates: [
    {
      date: new Date().toISOString(),
      type: 'enforcement',
      description: `Recent ${framework.toUpperCase()} update`
    }
  ]
});

export class ComplianceService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async getComplianceOverview(orgId: string): Promise<ComplianceOverview> {
    try {
      const frameworks = ['gdpr', 'hipaa', 'ccpa', 'sox', 'osha'];
      
      // In development, return mock data
      if (process.env.NODE_ENV === 'development') {
        return frameworks.reduce((acc, framework) => {
          acc[framework] = mockComplianceData(framework);
          return acc;
        }, {} as ComplianceOverview);
      }

      const results = await Promise.allSettled(
        frameworks.map(framework =>
          this.apiClient.get<ComplianceData>(`/api/compliance?framework=${framework}`)
        )
      );

      const overview = frameworks.reduce((acc, framework, index) => {
        const result = results[index];
        acc[framework] = result.status === 'fulfilled' 
          ? result.value 
          : mockComplianceData(framework); // Fallback to mock data on error
        return acc;
      }, {} as ComplianceOverview);

      await createAuditLog({
        type: 'compliance_overview',
        organizationId: orgId,
        details: {
          action: 'fetch_compliance_overview',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      });

      return overview;
    } catch (error) {
      console.error('Error fetching compliance overview:', error);
      
      // Return mock data as fallback
      return ['gdpr', 'hipaa', 'ccpa', 'sox', 'osha'].reduce((acc, framework) => {
        acc[framework] = mockComplianceData(framework);
        return acc;
      }, {} as ComplianceOverview);
    }
  }

  async getRegulationUpdates(frameworks: string[]) {
    const updates = [];
    
    for (const framework of frameworks) {
      try {
        switch (framework.toLowerCase()) {
          case 'gdpr':
            const gdprData = await this.apiClient.get<ComplianceData>(`/api/compliance?framework=gdpr`);
            updates.push({
              framework: 'GDPR',
              updates: gdprData.recentUpdates
            });
            break;
          case 'hipaa':
            const hipaaData = await this.apiClient.get<ComplianceData>(`/api/compliance?framework=hipaa`);
            updates.push({
              framework: 'HIPAA',
              updates: hipaaData.recentUpdates
            });
            break;
          case 'osha':
            const oshaData = await this.apiClient.get<ComplianceData>(`/api/compliance?framework=osha`);
            updates.push({
              framework: 'OSHA',
              updates: oshaData.recentUpdates
            });
            break;
          case 'ccpa':
            const ccpaData = await this.apiClient.get<ComplianceData>(`/api/compliance?framework=ccpa`);
            updates.push({
              framework: 'CCPA',
              updates: ccpaData.recentUpdates
            });
            break;
          case 'sox':
            const soxData = await this.apiClient.get<ComplianceData>(`/api/compliance?framework=sox`);
            updates.push({
              framework: 'SOX',
              updates: soxData.recentUpdates
            });
            break;
        }
      } catch (error) {
        console.error(`Failed to fetch updates for ${framework}:`, error);
      }
    }

    return updates;
  }

  async validateCompliance(organizationId: string, framework: string) {
    // Implement framework-specific validation logic
    switch (framework.toLowerCase()) {
      case 'gdpr':
        // Implement GDPR validation
        break;
      case 'hipaa':
        // Implement HIPAA validation
        break;
      case 'osha':
        // Implement OSHA validation
        break;
      case 'ccpa':
        // Implement CCPA validation
        break;
      case 'sox':
        // Implement SOX validation
        break;
      default:
        throw new Error(`Unsupported compliance framework: ${framework}`);
    }
  }
}
