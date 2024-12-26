'use client';

import React, { useState } from 'react';
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { TaskManager } from './TaskManager';

interface Requirement {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  description?: string;
  steps?: string[];
  actionItems?: string[];
}

interface ComplianceModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  framework: string;
  data: {
    complianceScore: number;
    status: string;
    requirements: Requirement[];
    details: string[];
    recentUpdates: Array<{
      date: string;
      type: string;
      description: string;
    }>;
  };
}

const ComplianceModal: React.FC<ComplianceModalProps> = ({ 
  open, 
  onClose, 
  title, 
  framework,
  data 
}) => {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [requirements, setRequirements] = useState(data.requirements || []);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'non_compliant':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const handleStartTask = (requirement: any) => {
    const task = {
      id: requirement.id,
      title: requirement.title,
      description: requirement.description || '',
      priority: requirement.priority,
      dueDate: requirement.dueDate,
      status: requirement.status === 'compliant' ? 'completed' : 'not_started',
      steps: (requirement.actionItems || []).map((item: string, index: number) => ({
        id: `${requirement.id}-step-${index}`,
        title: item,
        completed: false
      }))
    };
    setSelectedTask(task);
  };

  const handleTaskUpdate = (updatedTask: any) => {
    // Update the requirements list with the new task status
    const updatedRequirements = requirements.map((req: any) =>
      req.id === updatedTask.id
        ? {
            ...req,
            status: updatedTask.status === 'completed' ? 'compliant' : 'in_progress'
          }
        : req
    );
    setRequirements(updatedRequirements);
  };

  if (!open) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <DialogContent className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-8 shadow-lg overflow-y-auto">
            <DialogTitle className="text-2xl font-bold mb-6">{title}</DialogTitle>
            
            {/* Overview Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-600 font-medium">Compliance Score</div>
                  <div className="text-2xl font-bold">{data.complianceScore}%</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-green-600 font-medium">Requirements Met</div>
                  <div className="text-2xl font-bold">
                    {requirements.filter((r: any) => r.status === 'compliant').length}/{requirements.length}
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-yellow-600 font-medium">Pending Actions</div>
                  <div className="text-2xl font-bold">
                    {requirements.filter((r: any) => r.status !== 'compliant').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Required Actions Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Required Actions</h3>
              <div className="space-y-4">
                {requirements
                  .filter(req => req.status !== 'compliant')
                  .sort((a, b) => a.priority === 'high' ? -1 : 1)
                  .map((req, index) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(req.status)}
                            <h4 className="font-medium">{req.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(req.priority)}`}>
                              {req.priority}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{req.description}</p>
                          {req.steps && (
                            <div className="pl-4">
                              {req.steps.map((step, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                  <ArrowRight className="w-4 h-4" />
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-sm text-gray-500">
                              Due by: {new Date(req.dueDate).toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => handleStartTask(req)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Start Task
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Recent Updates Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Recent Updates</h3>
              <div className="space-y-3">
                {data.recentUpdates?.map((update, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className="min-w-[100px] text-gray-500">
                      {new Date(update.date).toLocaleDateString()}
                    </div>
                    <div className={`flex-1 ${
                      update.type === 'enforcement'
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}>
                      {update.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <button
                onClick={() => {/* TODO: Implement export handler */}}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Export Report
              </button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {selectedTask && (
        <TaskManager
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </>
  );
};

export default ComplianceModal;
