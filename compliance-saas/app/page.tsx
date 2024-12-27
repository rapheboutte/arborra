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
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { generatePDFReport } from '@/lib/generateReport'; // Import the new PDF generator

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

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          {framework} Compliance Status
          <TooltipProvider>
            <Tooltip content={getInfoText(framework)}>
              <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 hover:bg-transparent">
                <Info className="h-4 w-4" />
              </Button>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Status</div>
            <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(data.score)}`}>
              {getStatusText(data.score)}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Current Score: {data.score}%</div>
              <div className="flex items-center text-xs">
                {data.trend}%
                {getTrendIcon(data.trend)}
              </div>
            </div>
            <div className="mt-2">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${data.score}%` }}
                />
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={onViewDetails}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: session } = useSession();

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Generate report data
      const reportData = {
        date: new Date().toISOString(),
        company: "Jane's Retail Store",
        frameworks: {
          GDPR: { score: 71, status: "Partially Compliant" },
          HIPAA: { score: 96, status: "Compliant" },
          CCPA: { score: 82, status: "Compliant" },
          SOX: { score: 73, status: "Partially Compliant" },
          OSHA: { score: 77, status: "Partially Compliant" }
        }
      };

      // Generate PDF
      const pdfBlob = await generatePDFReport(reportData);
      
      // Download the PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const complianceData = {
    GDPR: { score: 71, trend: 3 },
    HIPAA: { score: 96, trend: -2 },
    CCPA: { score: 82, trend: 1 },
    SOX: { score: 73, trend: 1 },
    OSHA: { score: 77, trend: 1 }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Welcome, Jane's Retail Store</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push('/settings')}
          >
            Settings
          </Button>
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(complianceData).map(([framework, data]) => (
          <ComplianceCard
            key={framework}
            framework={framework}
            data={data}
            onViewDetails={() => router.push(`/compliance/${framework.toLowerCase()}`)}
          />
        ))}
      </div>
    </div>
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

  return <Dashboard />;
}
