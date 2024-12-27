import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ComplianceCardProps {
  framework: string;
  data: {
    complianceScore: number;
    requirements?: any[];
    status?: string;
  };
  onViewDetails: (framework: string, data: any) => void;
}

const frameworkInfo = {
  GDPR: {
    title: 'General Data Protection Regulation',
    description: 'EU data protection and privacy regulation',
  },
  HIPAA: {
    title: 'Health Insurance Portability and Accountability Act',
    description: 'US healthcare data privacy and security regulation',
  },
  CCPA: {
    title: 'California Consumer Privacy Act',
    description: 'California state consumer data privacy law',
  },
  SOX: {
    title: 'Sarbanes-Oxley Act',
    description: 'US corporate financial reporting regulation',
  },
  OSHA: {
    title: 'Occupational Safety and Health Administration',
    description: 'US workplace safety and health standards',
  },
};

export function ComplianceCard({ framework, data, onViewDetails }: ComplianceCardProps) {
  const info = frameworkInfo[framework as keyof typeof frameworkInfo];
  const score = data.complianceScore || 0;
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span>{framework}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{info.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <div className={`text-2xl font-bold ${scoreColor}`}>{score}%</div>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {data.requirements?.length || 0} requirements
        </CardDescription>
        <div className="space-y-4">
          <Progress value={score} />
          <div className="text-sm text-muted-foreground">
            Compliance Score: {score}%
          </div>
        </div>
        <Button
          className="mt-4 w-full"
          variant="outline"
          onClick={() => onViewDetails(framework, data)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
