'use client';

import { useState } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './dialog';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Checkbox } from './checkbox';
import { Textarea } from './textarea';

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
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    priority: "Medium",
    framework: "GDPR",
    status: "Not Started"
  });
  const [error, setError] = useState('');

  const validateNewTask = () => {
    if (!newTask.title.trim()) {
      setError('Task title is required');
      return false;
    }
    if (!newTask.dueDate) {
      setError('Due date is required');
      return false;
    }
    return true;
  };

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

  const handleAddTask = () => {
    if (!validateNewTask()) return;

    const taskToAdd = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: '',
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      framework: newTask.framework,
      status: 'not_started',
      steps: []
    };

    onTaskUpdate(taskToAdd);
    setNewTask({
      title: "",
      dueDate: "",
      priority: "Medium",
      framework: "GDPR",
      status: "Not Started"
    });
    setError('');
    setIsAddTaskOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button>Add Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[475px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new compliance task with the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && (
                <div className="text-sm text-red-600">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="framework">Framework</Label>
                <Select
                  value={newTask.framework}
                  onValueChange={(value) => setNewTask({ ...newTask, framework: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GDPR">GDPR</SelectItem>
                    <SelectItem value="HIPAA">HIPAA</SelectItem>
                    <SelectItem value="SOX">SOX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
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
      </div>
    </div>
  );
}
