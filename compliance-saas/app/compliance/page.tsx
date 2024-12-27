'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ComplianceService } from '@/lib/services/compliance';
import { ComplianceCard } from './components/ComplianceCard';
import ComplianceModal from './components/ComplianceModal';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';

export default function CompliancePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complianceData, setComplianceData] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const frameworks = ['GDPR', 'HIPAA', 'CCPA', 'SOX', 'OSHA'];

  const loadComplianceData = async () => {
    try {
      setLoading(true);
      const complianceService = new ComplianceService();
      const results = await Promise.all(
        frameworks.map(async (framework) => {
          try {
            const data = await complianceService.getComplianceOverview(framework);
            return {
              framework,
              complianceScore: data.complianceScore,
              requirements: data.requirements || [],
              status: data.status || 'inactive'
            };
          } catch (err) {
            console.error(`Error loading ${framework} compliance data:`, err);
            return {
              framework,
              complianceScore: 0,
              requirements: [],
              status: 'error'
            };
          }
        })
      );
      setComplianceData(results);
      setError(null);
    } catch (err) {
      console.error('Error loading compliance data:', err);
      setError('Failed to load compliance data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user) {
      loadComplianceData();
    }
  }, [session, status, router]);

  const handleViewDetails = (framework: string, data: any) => {
    setSelectedFramework({ framework, data });
    setModalOpen(true);
  };

  if (status === 'loading' || loading) {
    return <DashboardSkeleton />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Error</h2>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <Button
            className="mt-4"
            onClick={() => loadComplianceData()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Compliance Overview</h1>
          <p className="text-gray-500">Review your compliance status across different frameworks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complianceData.map(({ framework, ...data }) => (
          <ComplianceCard
            key={framework}
            framework={framework}
            data={data}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      <ComplianceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        framework={selectedFramework?.framework}
        data={selectedFramework?.data}
      />
    </div>
  )
}
