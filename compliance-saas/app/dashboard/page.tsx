'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { ComplianceCard } from '@/components/ui/ComplianceCard';
import { 
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  RefreshCcw
} from 'lucide-react';
import { ComplianceService } from '@/lib/services/compliance';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: string;
  status: string;
  framework: string;
  assignedTo: string;
}

interface Alert {
  id: string;
  message: string;
  type: string;
  timestamp: string;
  framework: string;
  relatedTaskId: string | null;
}

interface DashboardData {
  tasks: Task[];
  alerts: Alert[];
}

const FRAMEWORKS = ['SOC2', 'HIPAA', 'ISO27001', 'GDPR'];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, get this from your auth context
    setOrganizationId('default-org-id');
  }, []);

  const loadDashboardData = async () => {
    if (!organizationId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch tasks and alerts from MongoDB
      const [tasksRes, alertsRes] = await Promise.all([
        fetch(`/api/tasks?organizationId=${organizationId}`),
        fetch(`/api/alerts?organizationId=${organizationId}`)
      ]);

      const tasks = await tasksRes.json();
      const alerts = await alertsRes.json();

      setData({
        tasks: tasks.data || [],
        alerts: alerts.data || []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizationId) {
      loadDashboardData();
    }
  }, [organizationId]);

  const handleTaskStatusUpdate = async (taskId: string, status: string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      await loadDashboardData();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleBulkAction = async (action: 'complete' | 'delete') => {
    if (selectedTasks.size === 0) return;

    try {
      const tasks = Array.from(selectedTasks);
      if (action === 'complete') {
        await Promise.all(
          tasks.map(taskId =>
            fetch(`/api/tasks/${taskId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'COMPLETED' })
            })
          )
        );
      } else {
        await Promise.all(
          tasks.map(taskId =>
            fetch(`/api/tasks/${taskId}`, {
              method: 'DELETE'
            })
          )
        );
      }
      setSelectedTasks(new Set());
      await loadDashboardData();
    } catch (err) {
      console.error('Error performing bulk action:', err);
    }
  };

  if (!organizationId) {
    return <div>Loading organization...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {FRAMEWORKS.map(framework => (
          <ComplianceCard
            key={framework}
            framework={framework}
            organizationId={organizationId}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('complete')}
                disabled={selectedTasks.size === 0}
              >
                Complete Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                disabled={selectedTasks.size === 0}
              >
                Delete Selected
              </Button>
            </div>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {data?.tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <Checkbox
                    checked={selectedTasks.has(task.id)}
                    onCheckedChange={(checked) => {
                      const newSelected = new Set(selectedTasks);
                      if (checked) {
                        newSelected.add(task.id);
                      } else {
                        newSelected.delete(task.id);
                      }
                      setSelectedTasks(newSelected);
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTaskStatusUpdate(task.id, 'COMPLETED')}
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Alerts Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Alerts</h2>
            <Button variant="outline" size="sm" onClick={loadDashboardData}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {data?.alerts.map(alert => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg"
                >
                  {alert.type === 'warning' && (
                    <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />
                  )}
                  {alert.type === 'success' && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  )}
                  {alert.type === 'error' && (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                  {alert.type === 'info' && (
                    <InfoIcon className="h-5 w-5 text-blue-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
