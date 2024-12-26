'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DashboardSkeleton } from '@/components/loading-states';
import { ComplianceService } from '@/lib/services/compliance';
import { mockComplianceData } from '@/lib/mocks/gdpr';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import ComplianceModal from '@/components/ui/ComplianceModal';

const initialData = {
  companyName: "Jane's Retail Store",
  complianceScore: 0,
  regulations: []
};

interface DashboardData {
  companyName: string;
  complianceScore: number;
  regulations: Array<{
    name: string;
    progress: number;
  }>;
}

const ComplianceCard = ({ framework, data, onViewDetails }) => {
  const getStatusClass = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getProgressClass = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = (score: number) => {
    if (score >= 80) return 'Compliant';
    if (score >= 60) return 'Partially Compliant';
    return 'Non-Compliant';
  };

  const trend = {
    direction: framework === 'GDPR' ? 'up' : framework === 'HIPAA' ? 'down' : 'up',
    change: framework === 'GDPR' ? 3 : framework === 'HIPAA' ? 2 : 1
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{framework} Compliance Status</h3>
        <Tooltip>
          <Info className="w-4 h-4 text-gray-400" />
        </Tooltip>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(data.complianceScore)}`}>
            {getStatusText(data.complianceScore)}
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${getProgressClass(data.complianceScore)}`}
            style={{ width: `${data.complianceScore}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Current Score: {data.complianceScore}%
          </span>
          <div className={`flex items-center gap-1 ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend.direction === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend.change}%</span>
          </div>
        </div>

        <Button
          onClick={onViewDetails}
          variant="outline"
          className="w-full mt-2"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const complianceService = useMemo(() => new ComplianceService(), []);
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [complianceData, setComplianceData] = useState(mockComplianceData);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  const fetchComplianceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const overview = await complianceService.getComplianceOverview();
      setComplianceData(overview);
      setData(prev => ({
        ...prev,
        complianceScore: Object.values(overview).reduce((acc, curr) => acc + curr.complianceScore, 0) / Object.keys(overview).length,
        regulations: Object.entries(overview).map(([framework, data]) => ({
          name: framework.toUpperCase(),
          progress: data.complianceScore
        }))
      }));
    } catch (err) {
      console.error('Error loading compliance data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load compliance data'));
      setComplianceData(mockComplianceData);
    } finally {
      setLoading(false);
    }
  }, [complianceService]);

  const handleViewDetails = useCallback((framework: string) => {
    setSelectedFramework(framework);
    setModalTitle(`${framework.toUpperCase()} Compliance Details`);
    setModalOpen(true);
  }, []);

  useEffect(() => {
    fetchComplianceData();
  }, [fetchComplianceData]);

  return (
    <ErrorBoundary>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {data.companyName}</h1>
          <div className="mt-4 flex space-x-2">
            <Button variant="outline" size="sm">Settings</Button>
            <Button variant="default" size="sm">Generate Report</Button>
          </div>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
            <p className="text-red-700 mt-1">{error.message}</p>
            <Button 
              onClick={() => fetchComplianceData()}
              variant="destructive"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(complianceData).map(([framework, data]) => (
              <ComplianceCard
                key={framework}
                framework={framework.toUpperCase()}
                data={data}
                onViewDetails={() => handleViewDetails(framework)}
              />
            ))}
          </div>
        )}

        {selectedFramework && (
          <ComplianceModal 
            open={modalOpen} 
            onClose={() => setModalOpen(false)} 
            title={modalTitle}
            framework={selectedFramework}
            data={complianceData[selectedFramework]}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default function Page() {
  return (
    <Dashboard />
  );
}
