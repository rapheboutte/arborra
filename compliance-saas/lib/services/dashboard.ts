export class DashboardService {
  static async getDashboardData() {
    try {
      // First try to initialize the database
      console.log('[DashboardService] Fetching /api/db/init');
      const initResponse = await fetch('/api/db/init', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      console.log('[DashboardService] /api/db/init status:', initResponse.status);

      if (!initResponse.ok) {
        const errorText = await initResponse.text();
        console.error('[DashboardService] /api/db/init error response:', errorText);
        
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || 'Unexpected error';
        } catch {
          errorMessage = 'Failed to parse error response';
        }
        throw new Error(errorMessage);
      }

      const initData = await initResponse.json();
      console.log('[DashboardService] /api/db/init response:', initData);
      
      // If database is not initialized yet, return empty dashboard data
      if (!initData?.initialized) {
        console.log('[DashboardService] Database not initialized, returning empty data');
        return {
          scores: [],
          tasks: [],
          alerts: []
        };
      }

      console.log('[DashboardService] Fetching /api/dashboard');
      // Get dashboard data
      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      console.log('[DashboardService] /api/dashboard status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[DashboardService] /api/dashboard error response:', errorText);
        
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || 'Unexpected error';
        } catch {
          errorMessage = 'Failed to parse error response';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('[DashboardService] /api/dashboard response:', data);
      return data;
    } catch (error) {
      console.error('[DashboardService] Error fetching dashboard data:', error);
      throw error;
    }
  }
}
