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
import { TooltipProvider } from '@/components/ui/tooltip';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { generatePDFReport } from '@/lib/generateReport'; 
import ComplianceModal from '@/components/ui/ComplianceModal';

const ComplianceCard = ({ framework, data, onViewDetails }) => {
  const getStatusClass = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (score) => {
    if (score >= 80) return 'Compliant';
    if (score >= 60) return 'Partially Compliant';
    return 'Non-Compliant';
  };

  const getInfoText = (framework) => {
    const info = {
      GDPR: "General Data Protection Regulation - EU data protection and privacy law",
      HIPAA: "Health Insurance Portability and Accountability Act - US healthcare data privacy",
      CCPA: "California Consumer Privacy Act - California data privacy law",
      SOX: "Sarbanes-Oxley Act - US corporate financial reporting and governance",
      OSHA: "Occupational Safety and Health Act - US workplace safety standards"
    };
    return info[framework] || "Compliance framework information";
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          {framework}
          <TooltipProvider>
            <TooltipPrimitive.Tooltip>
              <TooltipPrimitive.Trigger asChild>
                <Info className="h-4 w-4 ml-2 text-gray-500 cursor-help" />
              </TooltipPrimitive.Trigger>
              <TooltipPrimitive.Content>
                <p className="w-[200px] text-sm">{getInfoText(framework)}</p>
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Tooltip>
          </TooltipProvider>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(framework, data)}
        >
          View Details
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Compliance Score</span>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusClass(data.complianceScore)}`}>
              {data.complianceScore}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <span className="text-sm">{getStatusText(data.complianceScore)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Requirements</span>
            <span className="text-sm">{data.requirements?.length || 0} items</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Documents</span>
            <span className="text-sm">{data.documents?.length || 0} files</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complianceData, setComplianceData] = useState<ComplianceOverview>({});
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const frameworks = ['GDPR', 'HIPAA', 'CCPA', 'SOX', 'OSHA'];

  useEffect(() => {
    const loadComplianceData = async () => {
      try {
        setLoading(true);
        const complianceService = new ComplianceService();
        const overview = await complianceService.getComplianceOverview();
        setComplianceData(overview);
        setError(null);
      } catch (err) {
        console.error('Error loading compliance data:', err);
        setError('Failed to load compliance data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      loadComplianceData();
    }
  }, [session]);

  const handleViewDetails = (framework, data) => {
    setSelectedFramework({ framework, data });
    setModalOpen(true);
  };

  if (!session?.user) {
    router.push('/auth/signin');
    return null;
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Error</h2>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <Button
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Calculate overall compliance metrics
  const metrics = frameworks.reduce((acc, framework) => {
    const data = complianceData[framework];
    if (data) {
      acc.totalTasks += data.requirements.length;
      acc.pendingReviews += data.requirements.filter(r => r.status === 'REQUIRES_REVIEW').length;
      acc.complianceScore = Math.round(
        (acc.complianceScore * acc.frameworkCount + data.complianceScore) / (acc.frameworkCount + 1)
      );
      acc.frameworkCount++;
    }
    return acc;
  }, { totalTasks: 0, pendingReviews: 0, complianceScore: 0, frameworkCount: 0 });

  return (
    <ErrorBoundary>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Welcome back, {session.user.name || 'Admin'}</h1>
            <p className="text-gray-500">Here's what's happening with your compliance tasks today.</p>
          </div>
          <Button onClick={() => generatePDFReport(complianceData)}>
            Generate Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <div className="text-2xl">📋</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <div className="text-2xl">👥</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
              <div className="text-2xl">📈</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.complianceScore}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <div className="text-2xl">📅</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pendingReviews}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frameworks.map((framework) => (
            <ComplianceCard
              key={framework}
              framework={framework}
              data={complianceData[framework] || {
                complianceScore: 0,
                status: 'inactive',
                requirements: [],
                documents: [],
                recentUpdates: []
              }}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {selectedFramework && (
          <ComplianceModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedFramework(null);
            }}
            framework={selectedFramework.framework}
            data={selectedFramework.data}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <DashboardSkeleton />;
  }

  if (!session) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}
