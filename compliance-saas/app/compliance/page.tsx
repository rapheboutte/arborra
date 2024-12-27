'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DashboardSkeleton } from '@/components/loading-states';
import { ComplianceService } from '@/lib/services/compliance';
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

export default function CompliancePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complianceData, setComplianceData] = useState({});
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
              data: {
                ...data,
                complianceScore: data.complianceScore || 0,
                requirements: data.requirements || [],
                documents: data.documents || [],
                recentUpdates: data.recentUpdates || []
              }
            };
          } catch (err) {
            console.error(`Error loading ${framework} compliance data:`, err);
            return {
              framework,
              data: {
                complianceScore: 0,
                requirements: [],
                documents: [],
                recentUpdates: [],
                status: 'error'
              }
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

  const handleViewDetails = (framework, data) => {
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
    <div className="p-6 max-w-[1600px] mx-auto"> {/* Added max-width and margin auto */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Compliance Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage your compliance requirements across different frameworks
          </p>
        </div>
        <Button onClick={() => loadComplianceData()}>
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"> {/* Adjusted grid breakpoints */}
        {complianceData.map(({ framework, data }) => (
          <ComplianceCard
            key={framework}
            framework={framework}
            data={data}
            onViewDetails={() => handleViewDetails(framework, data)}
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
  );
}
