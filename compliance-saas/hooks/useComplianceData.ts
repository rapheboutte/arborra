import { useState, useEffect } from 'react';
import { complianceApi } from '../utils/api';
import { ComplianceFramework, ComplianceUpdate, ComplianceStats } from '../types/compliance';

export function useComplianceData(frameworkId?: string) {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [currentFramework, setCurrentFramework] = useState<ComplianceFramework | null>(null);
  const [updates, setUpdates] = useState<ComplianceUpdate[]>([]);
  const [stats, setStats] = useState<ComplianceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [allFrameworks, recentUpdates, complianceStats] = await Promise.all([
          complianceApi.getFrameworks(),
          complianceApi.getUpdates(),
          complianceApi.getStats(),
        ]);

        setFrameworks(allFrameworks);
        setUpdates(recentUpdates);
        setStats(complianceStats);

        if (frameworkId) {
          const framework = await complianceApi.getFramework(frameworkId);
          setCurrentFramework(framework);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch compliance data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [frameworkId]);

  const updateRequirementStatus = async (
    fwId: string,
    reqId: string,
    status: string,
    notes?: string
  ) => {
    try {
      await complianceApi.updateRequirementStatus(fwId, reqId, status, notes);
      // Refresh the current framework data
      if (fwId === frameworkId && currentFramework) {
        const updated = await complianceApi.getFramework(fwId);
        setCurrentFramework(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update requirement status');
      throw err;
    }
  };

  return {
    frameworks,
    currentFramework,
    updates,
    stats,
    loading,
    error,
    updateRequirementStatus,
  };
}
