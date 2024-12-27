import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComplianceData, ComplianceRequirement, ComplianceDocument } from '@/types/compliance';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  framework: string;
  data: ComplianceData;
}

const ComplianceModal = ({ isOpen, onClose, framework, data }: ComplianceModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return 'bg-green-100 text-green-800';
      case 'NON_COMPLIANT':
        return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'REQUIRES_REVIEW':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{framework} Compliance Details</DialogTitle>
          <DialogDescription>
            Review and manage your {framework} compliance requirements, documents, and tasks.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{data.complianceScore}%</div>
                  <p className="text-sm text-gray-500 mt-2">
                    Based on {data.requirements.length} requirements
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.recentUpdates.map((update, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {update.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(update.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge>{update.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requirements">
            <div className="space-y-4">
              {data.requirements.map((req) => (
                <Card key={req.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{req.title}</CardTitle>
                      <div className="space-x-2">
                        <Badge className={getStatusColor(req.status)}>
                          {req.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(req.priority)}>
                          {req.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{req.description}</p>
                    {req.dueDate && (
                      <p className="text-sm text-gray-500 mt-2">
                        Due: {new Date(req.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    <div className="mt-4 flex items-center space-x-4">
                      <Button variant="outline" size="sm">
                        View Tasks ({req.tasks?.length || 0})
                      </Button>
                      <Button variant="outline" size="sm">
                        View Documents ({req.documents?.length || 0})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="space-y-4">
              {data.documents.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{doc.title}</CardTitle>
                      <Badge>{doc.fileType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{doc.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Uploaded by {doc.uploadedBy} on{' '}
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        View Requirements ({doc.requirements?.length || 0})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ComplianceModal;
