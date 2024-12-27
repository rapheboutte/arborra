import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ComplianceFramework, ComplianceRequirement } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  framework: ComplianceFramework & {
    requirements: ComplianceRequirement[];
  };
  onRefresh: () => void;
}

export default function ComplianceModal({ isOpen, onClose, framework, onRefresh }: ComplianceModalProps) {
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (requirementId: string, status: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/compliance/requirement', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requirementId,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update requirement status');
      }

      toast({
        title: 'Status updated',
        description: 'The requirement status has been updated successfully.',
      });

      onRefresh();
    } catch (error) {
      console.error('Error updating requirement status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update requirement status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500';
      case 'IN_PROGRESS':
        return 'bg-yellow-500';
      case 'NOT_STARTED':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{framework.name} Requirements</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {framework.requirements.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{req.title}</TableCell>
                <TableCell>{req.description}</TableCell>
                <TableCell>
                  <Badge className={getPriorityBadgeColor(req.priority)}>
                    {req.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(req.status)}>
                    {req.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={req.status}
                    onValueChange={(value) => handleStatusChange(req.id, value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
