import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComplianceData } from "@/types/compliance";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ComplianceCardProps {
  framework: string;
  data: ComplianceData;
  onViewDetails: (framework: string, data: ComplianceData) => void;
}

const frameworkInfo = {
  GDPR: {
    title: "GDPR",
    description: "General Data Protection Regulation",
    icon: "🇪🇺",
  },
  HIPAA: {
    title: "HIPAA",
    description: "Health Insurance Portability and Accountability Act",
    icon: "🏥",
  },
  CCPA: {
    title: "CCPA",
    description: "California Consumer Privacy Act",
    icon: "🔒",
  },
  SOX: {
    title: "SOX",
    description: "Sarbanes-Oxley Act",
    icon: "📊",
  },
  OSHA: {
    title: "OSHA",
    description: "Occupational Safety and Health Administration",
    icon: "⚡",
  },
};

const ComplianceCard = ({ framework, data, onViewDetails }: ComplianceCardProps) => {
  const info = frameworkInfo[framework as keyof typeof frameworkInfo];
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "#10B981"; // Green
    if (score >= 70) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{info.icon}</span>
            <div>
              <CardTitle>{info.title}</CardTitle>
              <p className="text-sm text-gray-500">{info.description}</p>
            </div>
          </div>
          <Badge className={getStatusBadgeColor(data.status)}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center">
            <div style={{ width: 80, height: 80 }}>
              <CircularProgressbar
                value={data.complianceScore}
                text={`${data.complianceScore}%`}
                styles={buildStyles({
                  textSize: "24px",
                  pathColor: getScoreColor(data.complianceScore),
                  textColor: getScoreColor(data.complianceScore),
                })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Requirements</p>
              <p className="text-lg font-semibold">{data.requirements.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Documents</p>
              <p className="text-lg font-semibold">{data.documents.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => onViewDetails(framework, data)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceCard;
