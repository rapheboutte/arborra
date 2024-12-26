'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Input } from './input';
import { Textarea } from './textarea';
import { Label } from './label';

interface TaskStep {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  steps: TaskStep[];
  status: 'not_started' | 'in_progress' | 'completed';
}

interface TaskManagerProps {
  task: Task;
  onClose: () => void;
  onTaskUpdate: (updatedTask: Task) => void;
}

export function TaskManager({ task, onClose, onTaskUpdate }: TaskManagerProps) {
  const [currentTask, setCurrentTask] = useState(task);
  const [notes, setNotes] = useState('');

  const handleStepToggle = (stepId: string) => {
    const updatedSteps = currentTask.steps.map(step =>
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );

    const allCompleted = updatedSteps.every(step => step.completed);
    const updatedTask = {
      ...currentTask,
      steps: updatedSteps,
      status: allCompleted ? 'completed' : 'in_progress'
    };

    setCurrentTask(updatedTask);
    onTaskUpdate(updatedTask);
  };

  const handleStartTask = () => {
    const updatedTask = {
      ...currentTask,
      status: 'in_progress'
    };
    setCurrentTask(updatedTask);
    onTaskUpdate(updatedTask);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{currentTask.title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Due by {new Date(currentTask.dueDate).toLocaleDateString()}
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {currentTask.priority}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-gray-600">{currentTask.description}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Required Steps</h4>
            <div className="space-y-2">
              {currentTask.steps.map(step => (
                <div key={step.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={step.id}
                    checked={step.completed}
                    onCheckedChange={() => handleStepToggle(step.id)}
                  />
                  <Label htmlFor={step.id}>{step.title}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Notes</h4>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or comments about this task..."
              className="h-24"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {currentTask.status === 'not_started' && (
              <Button onClick={handleStartTask}>
                Start Task
              </Button>
            )}
            {currentTask.status === 'in_progress' && (
              <Button
                disabled={!currentTask.steps.every(step => step.completed)}
                onClick={() => {
                  const updatedTask = { ...currentTask, status: 'completed' };
                  setCurrentTask(updatedTask);
                  onTaskUpdate(updatedTask);
                }}
              >
                Complete Task
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
