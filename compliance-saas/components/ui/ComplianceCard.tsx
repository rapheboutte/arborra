import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ComplianceOverview } from '@/types/compliance';
import { withCache } from '@/lib/utils/api-utils';
import { ComplianceService } from '@/lib/services/compliance';

interface ComplianceCardProps {
  framework: string;
  organizationId: string;
}

export function ComplianceCard({ framework, organizationId }: ComplianceCardProps) {
  const [data, setData] = useState<ComplianceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complianceService = new ComplianceService();
        const overview = await complianceService.getComplianceOverview(organizationId, framework);
        setData(overview);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch compliance data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [framework, organizationId]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-600">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{framework}</CardTitle>
        <Badge className={getStatusBadge(data.status)}>{data.status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Compliance Score</span>
              <span className="text-lg font-bold">{data.complianceScore}%</span>
            </div>
            <Progress
              value={data.complianceScore}
              className={`h-2 ${getScoreColor(data.complianceScore)}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-sm text-gray-500">Requirements</p>
              <p className="text-lg font-semibold">
                {data.completedRequirements}/{data.totalRequirements}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Critical Findings</p>
              <p className="text-lg font-semibold">{data.criticalFindings}</p>
            </div>
          </div>

          {data.upcomingDeadlines.length > 0 && (
            <div className="pt-4">
              <p className="text-sm font-medium mb-2">Upcoming Deadlines</p>
              <ul className="space-y-2">
                {data.upcomingDeadlines.slice(0, 2).map((deadline, index) => (
                  <li key={index} className="text-sm">
                    <span className="text-gray-600">{deadline.requirement}</span>
                    <span className="text-gray-400 ml-2">
                      {new Date(deadline.dueDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
