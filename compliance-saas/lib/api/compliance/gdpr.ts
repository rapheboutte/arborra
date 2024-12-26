import axios from 'axios';

const EDPB_API_BASE = 'https://edpb.europa.eu/api/v1';
const EU_OPENDATA_BASE = 'https://data.europa.eu/api/hub/search/datasets';

export interface GDPREnforcementAction {
  id: string;
  title: string;
  authority: string;
  date: string;
  fine: number;
  description: string;
}

export interface GDPRGuideline {
  id: string;
  title: string;
  content: string;
  publishedDate: string;
  status: string;
}

export interface GDPRStats {
  totalCases: number;
  resolvedCases: number;
  avgResolutionTime: number;
}

export class GDPRApiService {
  private async fetchWithRetry(url: string, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }

  async getEnforcementActions(params: { from?: string; to?: string } = {}) {
    try {
      const response = await this.fetchWithRetry(
        `${EDPB_API_BASE}/enforcement-actions`
      );
      return response.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        authority: item.authority,
        date: item.date,
        fine: item.fine,
        description: item.description
      }));
    } catch (error) {
      console.error('Failed to fetch GDPR enforcement actions:', error);
      return [];
    }
  }

  async getLatestGuidelines() {
    try {
      const response = await this.fetchWithRetry(
        `${EDPB_API_BASE}/guidelines`
      );
      return response.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        publishedDate: item.published_date,
        status: item.status
      }));
    } catch (error) {
      console.error('Failed to fetch GDPR guidelines:', error);
      return [];
    }
  }

  async getCrossBorderStats() {
    try {
      const response = await this.fetchWithRetry(
        `${EU_OPENDATA_BASE}?q=cross-border+data+protection`
      );
      return {
        totalCases: response.statistics?.total_cases || 0,
        resolvedCases: response.statistics?.resolved_cases || 0,
        avgResolutionTime: response.statistics?.avg_resolution_time || 0
      };
    } catch (error) {
      console.error('Failed to fetch cross-border statistics:', error);
      return {
        totalCases: 0,
        resolvedCases: 0,
        avgResolutionTime: 0
      };
    }
  }

  private getMockData() {
    return {
      enforcement: [
        {
          id: 'enf-1',
          title: 'Data Processing Violation',
          authority: 'Irish DPC',
          date: new Date().toISOString(),
          fine: 50000,
          description: 'Unauthorized processing of personal data'
        }
      ],
      guidelines: [
        {
          id: 'guide-1',
          title: 'Updated Cookie Consent Guidelines',
          content: 'New requirements for obtaining valid cookie consent',
          publishedDate: new Date().toISOString(),
          status: 'active'
        }
      ],
      stats: {
        totalCases: 250,
        resolvedCases: 180,
        avgResolutionTime: 45
      }
    };
  }

  async getGDPRData() {
    if (process.env.NODE_ENV === 'development') {
      return this.getMockData();
    }

    try {
      const [enforcement, guidelines, stats] = await Promise.all([
        this.getEnforcementActions(),
        this.getLatestGuidelines(),
        this.getCrossBorderStats()
      ]);

      return {
        enforcement,
        guidelines,
        stats
      };
    } catch (error) {
      console.error('Failed to fetch GDPR data:', error);
      return this.getMockData();
    }
  }
}
