"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Clock, AlertTriangle, Filter, Download, Plus, MoreVertical } from 'lucide-react';
import { mockComplianceData } from '@/lib/mocks/gdpr';

// Convert compliance requirements to tasks
const generateTasksFromCompliance = () => {
  const tasks = [];
  Object.entries(mockComplianceData).forEach(([framework, data]) => {
    data.requirements.forEach((req) => {
      tasks.push({
        id: req.id,
        name: req.title,
        deadline: req.dueDate,
        status: req.status === 'compliant' ? 'Completed' : 
                req.status === 'in_progress' ? 'In Progress' : 'Not Started',
        priority: req.priority === 'high' ? 'High' : 
                 req.priority === 'medium' ? 'Medium' : 'Low',
        description: req.description,
        regulation: framework.toUpperCase(),
        type: 'Review',
        assignedUser: '',
        progress: req.status === 'compliant' ? 100 : 
                 req.status === 'in_progress' ? 50 : 0,
        steps: req.actionItems || [],
        completedSteps: [],
        nextStep: req.actionItems ? req.actionItems[0] : '',
        createdAt: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        comments: [],
        attachments: [],
        relatedTasks: []
      });
    });
  });
  return tasks;
};

export default function TaskManagement() {
  const [tasks, setTasks] = useState(generateTasksFromCompliance());
  const [selectedView, setSelectedView] = useState('list');
  const [selectedRegulation, setSelectedRegulation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const regulations = ['GDPR', 'HIPAA', 'SOX', 'CCPA', 'OSHA'];
  const taskTypes = ['Review', 'Audit', 'Training', 'Documentation'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Not Started':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      case 'Overdue':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800'
    };
    return (
      <Badge className={colors[priority] || 'bg-gray-100'}>
        {priority}
      </Badge>
    );
  };

  const filteredTasks = tasks.filter(task => {
    const matchesRegulation = selectedRegulation === 'All' || task.regulation === selectedRegulation;
    const matchesType = selectedType === 'All' || task.type === selectedType;
    const matchesSearch = !searchQuery || 
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegulation && matchesType && matchesSearch;
  });

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const notStartedTasks = tasks.filter(t => t.status === 'Not Started').length;
  const overdueTasks = tasks.filter(t => 
    new Date(t.deadline) < new Date() && t.status !== 'Completed'
  ).length;

  const TaskDialog = ({ task, isOpen, onClose }) => {
    if (!task) return null;
    
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getStatusIcon(task.status)}
              {task.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(task.status)}
                  {task.status}
                </div>
              </div>
              <div>
                <Label>Priority</Label>
                <div className="mt-1">
                  {getPriorityBadge(task.priority)}
                </div>
              </div>
              <div>
                <Label>Deadline</Label>
                <div className="mt-1">
                  {new Date(task.deadline).toLocaleDateString()}
                </div>
              </div>
              <div>
                <Label>Regulation</Label>
                <div className="mt-1">
                  {task.regulation}
                </div>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <p className="mt-1 text-gray-600">{task.description}</p>
            </div>

            <div>
              <Label>Required Steps</Label>
              <div className="mt-2 space-y-2">
                {task.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.completedSteps.includes(step)}
                      onChange={() => {
                        const newTask = { ...task };
                        if (task.completedSteps.includes(step)) {
                          newTask.completedSteps = task.completedSteps.filter(s => s !== step);
                        } else {
                          newTask.completedSteps = [...task.completedSteps, step];
                        }
                        newTask.progress = Math.round((newTask.completedSteps.length / task.steps.length) * 100);
                        newTask.status = newTask.progress === 100 ? 'Completed' : 'In Progress';
                        setTasks(tasks.map(t => t.id === task.id ? newTask : t));
                      }}
                    />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Progress</Label>
              <div className="mt-2">
                <Progress value={task.progress} className="h-2" />
                <span className="text-sm text-gray-500 mt-1">{task.progress}% Complete</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button 
              onClick={() => {
                const newTask = { ...task, status: 'Completed', progress: 100 };
                setTasks(tasks.map(t => t.id === task.id ? newTask : t));
                onClose();
              }}
              disabled={task.status === 'Completed'}
            >
              Mark as Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Save Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-500">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-500">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-500">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Select value={selectedRegulation} onValueChange={setSelectedRegulation}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Regulation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Regulations</SelectItem>
            {regulations.map(reg => (
              <SelectItem key={reg} value={reg}>{reg}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            {taskTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[300px]"
        />
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Regulation</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow 
                key={task.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedTask(task);
                  setIsTaskDialogOpen(true);
                }}
              >
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell>{new Date(task.deadline).toLocaleDateString()}</TableCell>
                <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    {task.status}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={task.progress} className="w-[100px] h-2" />
                    <span className="text-sm text-gray-500">{task.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{task.regulation}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TaskDialog
        task={selectedTask}
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setSelectedTask(null);
          setIsTaskDialogOpen(false);
        }}
      />
    </div>
  );
}
